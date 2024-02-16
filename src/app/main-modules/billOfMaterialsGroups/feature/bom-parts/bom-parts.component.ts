import {Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {BOM} from '../../model/bom';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {Location} from '@angular/common';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {Tools} from '../../../../shared/tools/Tools';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";


@Component({
    selector: 'app-bom-parts',
    templateUrl: './bom-parts.component.html',
    styleUrls: ['./bom-parts.component.scss']
})
export class BomPartsComponent implements OnInit, OnDestroy {
    @Input() BOMId;
    @Input() mode: ActionMode;
    componentData = new ComponentData();
    selectedItemForDelete = new DeleteModel();
    actionMode = ActionMode;
    roleList = new TokenRoleList();
    dataOfPartsBOMList: BOM.BOMPart [] = [];
    loading = false;
    showModal = false;
    tools = Tools;
    VariableToDeclareGet = 0;

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public location: Location,
                public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
    ) {
        // super(activatedRoute, router, CourseParam.RouteParam, CourseParam.QueryParam);
        // this.componentData = new ComponentData();
        // this.BOMId = this.activatedRoute.snapshot.queryParams.BOMId;
        // this.receiveData();
    }


    ngOnInit() {
        this.getRoleListKey();
        this.getListSelf();

    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }


    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getListSelf();

    }


    getListSelf(options?: any) {
        this.loading = true;
        this.dataOfPartsBOMList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.billOfMaterialsGroupsService.getAllByPaginationPartBOM({
            paging,
            totalElements:-1,
            BOMId: this.BOMId
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<BOM.BOMPart>) => {
            this.loading = false;
            this.dataOfPartsBOMList = res.content;
            this.cacheService.set('PartSelectedList', this.dataOfPartsBOMList, CacheType.LOCAL_STORAGE);
            this.length = res.totalElements;
        }, error => {
            this.loading = false;
        });
    }


    search() {
        this.pageIndex = 0;
        this.getListSelf();

    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.billOfMaterialsGroupsService.deletePartBOM({
                BOMId: this.BOMId,
                BOMPartId: this.selectedItemForDelete.id
            })
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    return;
                } else if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.dataOfPartsBOMList = this.dataOfPartsBOMList

                        .filter((e) => {
                            return e.partId !== this.selectedItemForDelete.id;
                        });
                    this.cacheService.set('PartSelectedList', this.dataOfPartsBOMList, CacheType.LOCAL_STORAGE);

                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

                } else {
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                }
            }, error => {
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.partId;
        this.selectedItemForDelete.title = ' آیا قطعه ی    ' + item.partName + '#' + item.partCode + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    setService() {
        this.VariableToDeclareGet = this.VariableToDeclareGet + 1;
        this.cacheService.set('PartSelectedList', this.dataOfPartsBOMList, CacheType.LOCAL_STORAGE);
        this.showModal = true;
        setTimeout(() => {
            ModalUtil.showModal('modal1');
        }, 50);
    }

    getPartList($event: boolean) {
        this.dataOfPartsBOMList = this.cacheService.get('PartSelectedList', CacheType.LOCAL_STORAGE);
    }
}

export class ComponentData {
    myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
}

export namespace CourseParam {
    export class RouteParam {

    }

    export class QueryParam {
        paging: Paging;
        getAllByFilterAndPaginationBOM: GetAllByFilterAndPaginationBOM;
        userId;

        constructor() {
            this.paging = new Paging();
            this.paging.page = 0;
            this.paging.size = 10;
            this.userId = null;
            this.getAllByFilterAndPaginationBOM = new GetAllByFilterAndPaginationBOM();
            this.getAllByFilterAndPaginationBOM.term = null;

        }
    }
}

export class GetAllByFilterAndPaginationBOM {
    term: string;
}

// =====================================================================================
//   extends BaseListComponentSeven<partsBOMListNsp.RouteParam, partsBOMListNsp.QueryParam,
//   partsBOMListNsp.ComponentData, BOM.BOMPart>
//   implements OnInit, OnDestroy, OnChanges {
//   @Input() listOnCallback: () => any;
//   @Input() BOMGroupName;
//   @Input() BOMId;
//   @Input() doBack: boolean;
//   @Input() mode: ActionMode;
//   @Output() BOMPart = new EventEmitter<BOM.BOMPart[]>();
//   BOM = new BOM.Create();
//   off = true;
//   totalElements = 0;
//   partsBOMList: partsBOMListNsp.ComponentData;
//   partsSelectedBOMList: any;
//   partsBOMListCopy: any[] = [];
//   actionMode = ActionMode;
//   selectedItemForDelete = new DeleteModel();
//   loading = false;
//   deletedPart = false;
//
//   constructor(public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
//               public activatedRoute: ActivatedRoute,
//               public location: Location,
//               private cacheService: CacheService,
//               public router: Router) {
//     super(activatedRoute, router, partsBOMListNsp.RouteParam, partsBOMListNsp.QueryParam);
//     this.partsBOMList = new partsBOMListNsp.ComponentData(partsBOMListNsp.RouteParam, partsBOMListNsp.QueryParam);
//     /**
//      * If You want change default values in dataOfUserList, you can do like blew
//      * --> this.dataOfUserList.init({sizeList: [2, 5, 10, 15]});
//      */
//     this.partsBOMList = new partsBOMListNsp.ComponentData(partsBOMListNsp.RouteParam, partsBOMListNsp.QueryParam);
//     this.fireInitiatePagination();
//
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   private fireInitiatePagination() {
//     this.initiatePagination({size: 10});
//   }
//
//   private fireResetPagination() {
//     this.resetPagination({size: 10});
//   }
//
//   ngOnInit() {
//     super.receiveData();
//     this._setToQueryParams(this.partsBOMList.queryParam);
//     // this.getAllPartSelectedList();
//
//   }
//
//   ngOnChanges(changes: SimpleChanges) {
//     if (this.doBack === true) {
//       this.cancel();
//     }
//   }
//
//   getAllPartSelectedList() {
//     this.partsBOMList.itemPage.content = this.cacheService.get('allPartList', CacheType.LOCAL_STORAGE);
//     for (const item of this.partsBOMList.itemPage.content) {
//     item.partCode = '#' + item.partCode;
//     }
//
//   }
//
//   getListOnCallback() {
//     return this.listOnCallback;
//   }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.partsBOMList.queryParamReal.paging,
//         term: this.partsBOMList.term
//       }
//     );
//   }
//
//   cancel() {
//     // this.location.replaceState("panel/billOfMaterialsGroups");
//     this.partsBOMList.itemPage.content = [];
//     this.location.back();
//     // this.router.url.replace(:'/panel/billOfMaterialsGroups?page=0&size=5')
//
//   }
//
//   getListSelf(options?: any) {
//     this.loading = true;
//     // this.billOfMaterialsGroupsService.getAllByPaginationPartBOM({
//     //   paging: this.partsBOMList.queryParamReal.paging,
//     //   totalElements: this.partsBOMList.itemPage.totalElements,
//     //   term: this.partsBOMList.term,
//     //   BOMId: this.BOMId
//     // }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<any>) => {
//     //   // alert(1)
//     //   this.loading = false;
//     //   this.partsBOMList.itemPage = res;
//     //   this.partsBOMListCopy = JSON.parse(JSON.stringify(this.partsBOMList.itemPage.content));
//     // });
//     // ===========================================================================
//     setTimeout(e => {
//       this.partsBOMList.itemPage.content = this.cacheService.get('allPartList', CacheType.LOCAL_STORAGE);
//       for (const item of this.partsBOMList.itemPage.content) {
//         item.partCode = '#' + item.partCode;
//       }
//       this.loading = false;
//       }, 500);
//
//
//   }
//
//   chooseSelectedItemForEdit(item: BOM.BOMPart) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, partId: item.partId},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: BOM.BOMPart) {
//     this.router.navigate([item.partId, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   showModalDelete(item, i) {
//     this.selectedItemForDelete.loading = false;
//
//     this.selectedItemForDelete.id = item.partId;
//     this.selectedItemForDelete.title = ' آیا    ' + item.partName + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//   onReceiveQueryParam(queryParam: partsBOMListNsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.partsBOMList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: partsBOMListNsp.RouteParam): any {
//     this.fireResetPagination();
//     this.hardSyncQueryParamReal();
//     this.getList();
//   }
//
//   onReceiveRouteData(routeData: any): any {
//   }
//
//   onChangedTerm() {
//     this.getList();
//   }
//
//   public _setToQueryParams(queryParam) {
//     super.setToQueryParams(queryParam);
//   }
//
//   sortify(event) {
//     this.partsBOMList.sortings =
//       super.defaultSortify(this.partsBOMList.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: BOM.BOMPart) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: BOM.BOMPart) {
//     if (this.selectedList.filter(e => e.partId === item.partId).length > 0) {
//       this.selectedList.splice(this.selectedList.map(e => e.partId)
//         .indexOf(item.partId), 1);
//       this.deSelectedItem.emit(item);
//     } else {
//       this.selectedList.push(item);
//       this.selectedItem.emit(item);
//     }
//   }
//
//   isInSelected(arg: { item: UserDto.Create, selectedList: UserDto.Create[] }) {
//     if (isNullOrUndefined(arg.selectedList)) {
//       return false;
//     }
//     // const b = arg.selectedList.includes(arg.item);
//     let b: boolean;
//     if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
//       b = true;
//     } else {
//       b = false;
//     }
//     return b;
//   }
//
//   onChooseMultiMode() {
//   }
//
//   onChooseOneMode() {
//   }
//
//   onDefaultMode() {
//   }
//
//   getComponentData(): partsBOMListNsp.ComponentData {
//     return this.partsBOMList;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//   setService() {
//     this.off = !this.off;
//
//     setTimeout(() => {
//       ModalUtil.showModal('modal1');
//     }, 200);
//   }
//
//   receiveTrueOrFalse(event) {
//     if (event === true) {
//       // this.off = true;
//       // this.getListSelf();
//       this.getAllPartSelectedList();
//     }
//
//   }
//
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//
//       if (this.partsBOMListCopy.length === 0) {
//         // this.indexOfItem = this.partsBOMList.itemPage.content.findIndex(e => e.partId === this.selectedItemForDelete.id);
//
//         this.partsBOMList.itemPage.content = this.partsBOMList.itemPage.content
//           .filter((e) => {
//             return e.partId !== this.selectedItemForDelete.id;
//           });
//         this.cacheService.setItem('allPartList', this.partsBOMList.itemPage.content, CacheType.LOCAL_STORAGE);
//
//         this.deletedPart = true;
//         ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         this.BOMPart.emit(this.partsBOMList.itemPage.content);
//         DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//       }
//       // else if (this.partsBOMListCopy && this.partsBOMListCopy.length > 0) {
//       //   for (let i = 0; i < this.partsBOMListCopy.length; i++) {
//       //     if (this.partsBOMListCopy[i].partId === this.selectedItemForDelete.id) {
//       //       this.billOfMaterialsGroupsService.deletePartBOM({
//       //         BOMId: this.BOMId,
//       //         BOMPartId: this.selectedItemForDelete.id
//       //       })
//       //         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//       //         if (res === true) {
//       //           // this.off = true;
//       //           this.partsBOMList.itemPage.content = this.partsBOMList.itemPage.content
//       //             .filter((e) => {
//       //               return e.partId !== this.selectedItemForDelete.id;
//       //             });
//       //           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//       //           this.BOMPart.emit(this.partsBOMList.itemPage.content);
//       //           this.processPage();
//       //           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//       //           // this.alertForChangeInformation();
//       //         }
//       //       });
//       //     } else if (this.partsBOMListCopy[i].partId !== this.selectedItemForDelete.id) {
//       //       // this.indexOfItem = this.partsBOMList.itemPage.content.findIndex(e => e.partId === this.selectedItemForDelete.id);
//       //       this.partsBOMList.itemPage.content = this.partsBOMList.itemPage.content
//       //         .filter((e) => {
//       //           return e.partId !== this.selectedItemForDelete.id;
//       //         });
//       //       this.BOMPart.emit(this.partsBOMList.itemPage.content);
//       //       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//       //
//       //       DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//       //
//       //     }
//       //   }
//       // }
//     }
//
//   }
//
//   addQuantityForPartBOM(event, i) {
//     this.partsBOMList.itemPage.content[i].partQuantity = event.target.value;
//
//     this.BOMPart.emit(this.partsBOMList.itemPage.content);
//     // this.alertForChangeInformation();
//   }
//
//   sendToAction(event) {
//     //   this.loading = true;
//     //
//     //   this.BOM = event;
//     //   if (this.partsBOMList.itemPage.content && this.partsBOMList.itemPage.content.length === 0) {
//     //     this.partsBOMList.itemPage.content = this.BOM.bomPartList;
//     //     this.loading = false;
//     //   } else if (this.partsBOMList.itemPage.content && this.partsBOMList.itemPage.content.length > 0) {
//     //     this.loading = false;
//     //     if (this.BOM.bomPartList && this.BOM.bomPartList.length > 0) {
//     //       for (let i = 0; i < this.BOM.bomPartList.length; i++) {
//     //         this.partsSelectedBOMList = this.partsBOMList.itemPage.content.find(e => e.partId === this.BOM.bomPartList[i].partId)
//     //         if (!isNullOrUndefined(this.partsSelectedBOMList)) {
//     //           this.partsSelectedBOMList = null;
//     //         } else {
//     //           this.partsBOMList.itemPage.content.push(this.BOM.bomPartList[i]);
//     //         }
//     //       }
//     //     }
//     //   }
//     //
//     //   this.BOMPart.emit(this.BOM.bomPartList);
//   }
//
//   alertForChangeInformation() {
//     DefaultNotify.notifyDanger('لطفا برای ثبت اطلاعات دکمه ی ثبت را بزنید');
//   }
//
//
// }
//
// export namespace partsBOMListNsp {
//
//   export class ComponentData extends ListComponentData<BOM.BOMPart, RouteParam, QueryParam> {
//     // labels: Labels = new Labels();
//   }
//
//
//   // class Labels {
//   //   listTitle = 'لیست کاربران';
//   // }
//
//   export class RouteParam {
//   }
//
//   export class QueryParam extends ListQueryParam {
//   }
// }
//
