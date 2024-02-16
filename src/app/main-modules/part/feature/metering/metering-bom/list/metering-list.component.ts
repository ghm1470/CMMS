import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Paging} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {MeteringService} from '../../../../endpoint/metering.service';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {UserDto} from '../../../../../user/model/dto/user-dto';
import {isNullOrUndefined} from 'util';
import {Reading} from '../../../../../reading/model/reading';
import {AssetService} from '../../../../../asset/endpoint/asset.service';
import {UnitOfMeasurement} from '../../../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {PartDto} from '../../../../model/dto/part';
import {DateViewMode} from '../../../../../../shared/tools/date-view-mode.enum';
import {Province} from "../../../../../dashboard/model/dto/province";
import {DeleteModel} from "../../../../../../shared/conferm-delete/model/delete-model";
import {TokenRoleList} from "../../../../../../shared/shared/constants/tokenRoleList";
import {ProvinceService} from "../../../../../basicInformation/province/endpoint/province.service";
import {Auth} from "../../../../../../shared/constants/cacheKeys";
import {ModalUtil} from "@angular-boot/widgets";
import {Moment} from "../../../../../../shared/shared/tools/date/moment";


@Component({
    selector: 'app-metering-list',
    templateUrl: './metering-list.component.html',
    styleUrls: ['./metering-list.component.scss']
})
export class MeteringListComponent implements OnInit, OnDestroy, OnChanges {
    @Input() listOnCallback: () => any;
    @Input() refId;
///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: Reading.GetAllNew[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    showMessage = false;
    unitId: string;
    dateViewMode = DateViewMode;
    myMoment = Moment;

    constructor(private entityService: MeteringService,
                private assetService: AssetService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getPage();

        });
    }

    ngOnInit() {
        this.getRoleListKey();
        this.getAsset();
    }


    ngOnChanges(): void {
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    selectedUid: string;

    getPage(options?) {
        options ? this.selectedUid = options : null;
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getMeteringListOfUnitOfAssetPagination({
            assetId: this.refId,
            unitId: options,
            paging,
            totalElements:-1,
        }).subscribe((res: any) => {
            if (res) {
                this.entityList = res.content;
                this.length = res.totalElements;
                this.loading = false;
                if (this.entityList.length > 0) {
                    this.showMessage = false;
                } else {
                    this.showMessage = true;
                }
            }

        }, error => {
            this.loading = false;
        });
    }

    search() {
        if (this.pageIndex == 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }

    }

    navigate() {
        this.getPage(this.selectedUid);
        // this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
        //     queryParams: {
        //         pageIndex: this.pageIndex,
        //         pageSize: this.pageSize,
        //         term: this.term,
        //     },
        // });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: Province) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: Province, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            // this.entityService.delete({provinceId: this.selectedItemForDelete.id})
            //     .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            //     this.selectedItemForDelete.loading = false;
            //     if (res === true) {
            //         this.entityList.splice(this.selectedItemForDelete.index, 1);
            //         ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
            //         if (this.entityList.length === 0) {
            //             this.pageIndex = this.pageIndex - 1;
            //             if (this.pageIndex < 0) {
            //                 this.pageIndex = 0;
            //                 this.getPage();
            //             }
            //             this.navigate();
            //         }
            //     } else {
            //         DefaultNotify.notifyDanger('این آیتم قابل حذف نمی باشد.');
            //         ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
            //     }
            // });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    setIdFor(event) {
        // this.getAllUserFilter.userTypeId = event.id;
    }

    unitList: UnitOfMeasurement[] = [];
    hasUnitList = false;
    unitName: string;

    getAsset() {
        this.assetService.getUnitListOfAsset({assetId: this.refId}).pipe(takeUntilDestroyed(this)).subscribe((res: UnitOfMeasurement[]) => {
            if (res && res.length > 0) {
                if (res.length > 1) {
                    this.unitList = res;
                    this.hasUnitList = true;
                } else if (res.length < 1 || res.length === 1) {
                    this.hasUnitList = false;
                    this.unitName = res[0].title;
                    this.selectedUid = res[0].id;
                    this.getPage(res[0].id);
                }
            }
        });
    }
}

//////////////////////////////////////

//     @Input() listOnCallback: () => any;
//     @Input() refId;
//     unitId: string;
//     unitList: UnitOfMeasurement[] = [];
//     totalElements = 0;
//     metringList: MeteringListNsp.ComponentData;
//     noSearchResult = false;
//     showMessage = false;
//     hasUnitList = false;
//     unitName: string;
//     user;
//     loading = false;
//     dateViewMode = DateViewMode;
//
//     constructor(private meteringService: MeteringService,
//                 private assetService: AssetService,
//                 public activatedRoute: ActivatedRoute,
//                 public router: Router) {
//         super(activatedRoute, router, MeteringListNsp.RouteParam, MeteringListNsp.QueryParam);
//         this.metringList = new MeteringListNsp.ComponentData(MeteringListNsp.RouteParam, MeteringListNsp.QueryParam);
//         /**
//          * If You want change default values in dataOfUserList, you can do like blew
//          * --> this.dataOfUserList.init({sizeList: [2, 5, 10, 15]});
//          */
//         this.metringList = new MeteringListNsp.ComponentData(MeteringListNsp.RouteParam, MeteringListNsp.QueryParam);
//         this.fireInitiatePagination();
//         super.receiveData();
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     private fireInitiatePagination() {
//         this.initiatePagination({size: 10});
//     }
//
//     private fireResetPagination() {
//         this.resetPagination({size: 10});
//     }
//
//     ngOnInit() {
//         this.user = JSON.parse(sessionStorage.getItem('user'));
//         // this._setToQueryParams(this.metringList.queryParam);
//         this.getAsset();
//     }
//
//     ngOnChanges() {
//         // this.getAsset();
//     }
//
//     getListOnCallback() {
//         return this.listOnCallback;
//     }
//
//     getListRemoteArg(optionsOfGetList?: any) {
//         return new ListHelper(
//             {
//                 paging: this.metringList.queryParamReal.paging,
//                 term: this.metringList.term
//             }
//         );
//     }
//
//     getListSelf(options?: any) {
//         // this.meteringService.getMeteringListOfUnitOfAsset({
//         //   refId: this.assetId,
//         //   unitId: uId
//         // }).pipe(takeUntilDestroyed(this)).subscribe((UL: Reading.GetAll[]) => {
//         //   this.dataOfReadingList = UL;
//         // });
//         if (this.refId) {
//             this.loading = true;
//             this.meteringService.getMeteringListOfUnitOfAssetPagination({
//                 assetId: this.refId,
//                 unitId: options,
//                 paging: this.metringList.queryParamReal.paging,
//                 totalElements: this.metringList.itemPage.totalElements,
//             }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Reading.GetAllNew>) => {
//                 this.metringList.itemPage = res;
//                 if (res.content.length > 0) {
//                     this.showMessage = false;
//                     this.loading = false;
//                 } else if (res.content.length === 0) {
//                     this.loading = false;
//                     this.showMessage = true;
//                 }
//             });
//         }
//
//     }
//
//     getListSelfTow(uId) {
//     }
//
//     chooseSelectedItemForEdit(item: Reading.GetAllNew) {
//         // this.router.navigate(['action'], {
//         //   queryParams: {mode: ActionMode.EDIT, inventoryId: item.inventoryId},
//         //   relativeTo: this.activatedRoute
//         // });
//     }
//
//     chooseSelectedItemForView(item: Reading.GetAllNew) {
//         // this.router.navigate([item.inventoryId, ActionMode.VIEW], {
//         //   relativeTo: this.activatedRoute
//         // });
//     }
//
//     deleteItem(item: Reading.GetAllNew) {
//         // // if (confirm('از حذف این '))
//         // this.inventoryService.deleteInventory(this.inventoryLocation)
//         //   .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//         //   if (res === true) {
//         //     this.metringList.itemPage.content = this.metringList.itemPage.content
//         //       .filter((e) => {
//         //         return e.inventoryId !== item.inventoryId;
//         //       });
//         //     this.processPage();
//         //   }
//         // });
//     }
//
//     onReceiveQueryParam(queryParam: MeteringListNsp.QueryParam): any {
//         super.defaultOnReceiveQueryParam(queryParam);
//         this.metringList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//     }
//
//     onReceiveRouteParam(routeParam: MeteringListNsp.RouteParam): any {
//         this.fireResetPagination();
//         this.hardSyncQueryParamReal();
//         this.getList();
//     }
//
//     onReceiveRouteData(routeData: any): any {
//     }
//
//     onChangedTerm() {
//         this.getList();
//     }
//
//     public _setToQueryParams(queryParam) {
//         super.setToQueryParams(queryParam);
//     }
//
//     sortify(event) {
//         this.metringList.sortings =
//             super.defaultSortify(this.metringList.sortings, event);
//         this.getList();
//     }
//
//     // chooseOne(item: Reading.GetAll) {
//     //   this.selectedItem.emit(item);
//     // }
//
//     selectDeselectItem(item: Reading.GetAllNew) {
//         // if (this.selectedList.filter(e => e.inventoryId === item.inventoryId).length > 0) {
//         //   this.selectedList
//         //     .splice(this.selectedList.map(e => e.inventoryId)
//         //       .indexOf(item.inventoryId), 1);
//         //   this.deSelectedItem.emit(item);
//         // } else {
//         //   this.selectedList.push(item);
//         //   this.selectedItem.emit(item);
//         // }
//     }
//
//     isInSelected(arg: { item: UserDto.Create, selectedList: UserDto.Create[] }) {
//         // if (isNullOrUndefined(arg.selectedList)) {
//         //   return false;
//         // }
//         // // const b = arg.selectedList.includes(arg.item);
//         // let b: boolean;
//         // if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
//         //   b = true;
//         // } else {
//         //   b = false;
//         // }
//         // return b;
//     }
//
//     onChooseMultiMode() {
//     }
//
//     onChooseOneMode() {
//     }
//
//     onDefaultMode() {
//     }
//
//     getComponentData(): MeteringListNsp.ComponentData {
//         return this.metringList;
//     }
//
//     ngOnDestroy(): void {
//     }
//
//     setIdFor(event) {
//         // this.getAllUserFilter.userTypeId = event.id;
//     }
//
//     getAsset() {
//         this.assetService.getUnitListOfAsset({assetId: this.refId}).pipe(takeUntilDestroyed(this)).subscribe((res: UnitOfMeasurement[]) => {
//             if (res && res.length > 0) {
//                 if (res.length > 1) {
//                     this.unitList = res;
//                     this.hasUnitList = true;
//                 } else if (res.length < 1 || res.length === 1) {
//                     this.hasUnitList = false;
//                     this.unitName = res[0].title;
//                     this.getListSelf(res[0].id);
//                 }
//             }
//         });
//     }
//
// }
//
// export namespace MeteringListNsp {
//
//     export class ComponentData extends ListComponentData<Reading.GetAllNew, RouteParam, QueryParam> {
//         // labels: Labels = new Labels();
//     }
//
//
//     // class Labels {
//     //   listTitle = 'لیست کاربران';
//     // }
//
//     export class RouteParam {
//     }
//
//     export class QueryParam extends ListQueryParam {
//     }
// }


// ===================================================================
//   implements OnInit, OnDestroy {
//   dateViewMode = DateViewMode;
//   myMoment = Moment;
//   meteringList: Metering[] = [];
//   metering = new Metering();
//   hasUnitList = false;
//   paging = new Paging();
//   totalElements = 0;
//   actionMode = ActionMode;
// @Input() refId: string;
//   mode: ActionMode = ActionMode.ADD;
//   meteringId;
//   metringIndex ;
//   sendMeteringForEdit = new Metering();
//   toolkit = Toolkit2;
//   showLoader = true;
//   constructor(public meteringService: MeteringService,
//     public activatedRoute: ActivatedRoute,
//     public router: Router) {
//     this.paging.page = 0;
//     this.paging.size = 10;
//   }
//
//   ngOnInit() {
//     this.getAllMetering();
//   }
//   receiveMessage(event: Metering) {
//     if (this.mode === ActionMode.EDIT) {
//       this.meteringList[this.metringIndex] = event;
//     } else {
//       this.meteringList.push(event);
//     }
//   }
//
//
//   chooseSelectedItemForEdit(item: Metering, i) {
//     this.metringIndex = i;
//     this.meteringId =  item.id;
//     this.mode = this.actionMode.EDIT;
//     this.sendMeteringForEdit = JSON.parse(JSON.stringify(item));
//     ModalUtil.showModal('meteringModal');
//   }
//
//   deleteItem(item: Metering) {
//     // this.meteringService.delete({meteringId: item.id})
//     //   .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//     //     if (res) {
//     //     this.meteringList = this.meteringList
//     //       .filter((e) => {
//     //         return e.id !== item.id;
//     //       });
//     //     DefaultNotify.notifySuccess('باموفقیت حذف شد');
//     //   }
//     // });
//   }
//
//   ngOnDestroy(): void {
//   }
//
//
//   getAllMetering() {
//     // this.meteringService.getAll({ refId: this.refId}).subscribe((res: Metering[]) => {
//     //   if (res) {
//     //     this.meteringList = res;
//     //     this.showLoader = false;
//     //   }
//     // });
//   }
//
//   setService() {
//     this.mode = ActionMode.ADD;
//     ModalUtil.showModal('meteringModal');
//   }
//   cancelModal() {
//     // $('#check').prop('checked', false);
//     ModalUtil.hideModal('budgetAllocatedModal');
//   }
// }
