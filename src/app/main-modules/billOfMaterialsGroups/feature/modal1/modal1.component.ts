import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {PartDto} from '../../../part/model/dto/part';
import {BOM} from '../../model/bom';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {PartService} from '../../../part/endpoint/part.service';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-modal1',
    templateUrl: './modal1.component.html',
    styleUrls: ['./modal1.component.scss']
})
export class Modal1Component implements OnInit, OnDestroy, OnChanges {
    @Input() BOMId;
    @Input() VariableToDeclareGet;
    @Output() getPartList = new EventEmitter<boolean>();
    componentData = new ComponentData();
    selectedItemForDelete = new DeleteModel();
    roleList = new TokenRoleList();
    dataOfPartList: BOM.ALLPart [] = [];
    loading = false;
    doSave = false;
    MyModalSize = ModalSize;
    partSelectedList: BOM.BOMPart[] = [];
    partSelectedListCopy: BOM.BOMPart[] = [];
    exist = false;
    BOMPartList: BOM.BOMPartListCreate [] = [];
    BOMPart = new BOM.BOMPartListCreate();
    disabledButton = false;
    toolKit2 = Toolkit2;
    allPartSelectedList: BOM.BOMPart[] = [];


    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
                public partService: PartService,
    ) {
    }


    ngOnInit() {
        // this.getPartSelectedList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getListSelf();

        if (changes.VariableToDeclareGet) {
            this.getPartSelectedList();
        }
    }


    getPartSelectedList() {
        this.partSelectedList = [];
        this.partSelectedList = this.cacheService.get('PartSelectedList', CacheType.LOCAL_STORAGE);
        for (const item of this.dataOfPartList) {
            item.partQuantity = 0;
            for (const one of this.partSelectedList) {
                if (one.partId === item.id) {
                    item.partQuantity = one.partQuantity;
                }

            }

        }

    }

    sendItemForModal1(item: BOM.ALLPart) {
        const partSelected = new BOM.BOMPart();
        if (this.partSelectedList.length > 0) {
            for (let i = 0; i < this.partSelectedList.length; i++) {
                if (this.partSelectedList[i].partId === item.id) {
                    this.exist = true;
                    break;
                }
            }
            if (this.exist === false) {
                if (!item.partQuantity) {
                    DefaultNotify.notifyDanger('تعداد قطعه را انتخاب کنید.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (item.partQuantity && item.partQuantity % 1 !== 0) {
                    DefaultNotify.notifyDanger('تعداد قطعه نمی تواند به صورت اعشاری باشد.', '', NotiConfig.notifyConfig);
                    return;
                }
                partSelected.partId = item.id;
                partSelected.partName = item.name;
                partSelected.partCode = item.partCode;
                partSelected.partQuantity = item.partQuantity;
                this.partSelectedList.push(partSelected);
            }
            this.exist = false;
        } else {
            if (!item.partQuantity) {
                DefaultNotify.notifyDanger('تعداد قطعه را انتخاب کنید.', '', NotiConfig.notifyConfig);
                return;
            }
            partSelected.partId = item.id;
            partSelected.partName = item.name;
            partSelected.partCode = item.partCode;
            partSelected.partQuantity = item.partQuantity;
            this.partSelectedList.push(partSelected);
        }
        this.exist = false;

    }


    hasItem(id: string) {
        let has = false;
        if (this.partSelectedList && this.partSelectedList.length) {
            for (const item of this.partSelectedList) {
                if (item.partId === id) {
                    has = true;
                    break;
                } else {
                    has = false;
                }
            }
            return has;
        }
    }


    deleteItemFromModal1(item: BOM.BOMPart, i) {
        this.exist = false;
        if (this.partSelectedListCopy && this.partSelectedListCopy.length > 0) {
            for (let j = 0; j < this.partSelectedListCopy.length; j++) {
                if (this.partSelectedListCopy[j].partId === item.partId) {
                    this.partSelectedList.splice(i, 1);
                    this.partSelectedListCopy.splice(j, 1);
                    this.exist = true;
                    break;
                }
            }
        }
        if (this.exist === false) {
            this.partSelectedList.splice(i, 1);
        }
        for (const one of this.dataOfPartList) {
            if (one.id === item.partId) {
                one.partQuantity = 0;
            }
        }
        this.exist = false;
    }


    getListSelf(options?: any) {
        this.loading = true;
        this.dataOfPartList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        const getAllByFilterAndPaginationPart = new GetAllByFilterAndPaginationBOM();
        this.partService.getAllPartByPagination({
            paging,
            totalElements:-1,
            term: this.term,
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<BOM.ALLPart>) => {
            this.loading = false;
            this.dataOfPartList = res.content;
            this.length = res.totalElements;
        }, error => {
            this.loading = false;

        });
    }

    onReceiveRouteData(routeData: any) {
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


    search() {
        this.pageIndex = 0;
        this.getListSelf();

    }


    ngOnDestroy(): void {
    }

    action() {
        this.disabledButton = true;
        // for (const item of this.partSelectedList)  {
        //   this.BOMPart = new BOM.BOMPartListCreate();
        //   this.BOMPart.partId = item.partId;
        //   this.BOMPart.partQuantity = item.partQuantity;
        //   this.BOMPartList.push(this.BOMPart);
        // }
        for (let i = 0; i < this.partSelectedList.length; i++) {
            this.BOMPartList[i] = new BOM.BOMPartListCreate();
            this.BOMPartList[i].partQuantity = this.partSelectedList[i].partQuantity;
            this.BOMPartList[i].partId = this.partSelectedList[i].partId;
        }
        this.allPartSelectedList = this.partSelectedList;
        this.billOfMaterialsGroupsService.updatePartBOM(this.BOMPartList, {id: this.BOMId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            this.disabledButton = false;
            if (res) {
                this.cacheService.set('PartSelectedList', this.allPartSelectedList, CacheType.LOCAL_STORAGE);
                DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                this.cancelModal();
            }
        }, error => {
            this.disabledButton = false;
        });
    }


    cancelModal() {
        this.getPartList.emit(true);
        ModalUtil.hideModal('modal1');
    }


    hideModal() {
        ModalUtil.hideModal('modal1');

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


// =============================================================================
//   BaseListComponentSeven<partListNsp.RouteParam, partListNsp.QueryParam,
//   partListNsp.ComponentData, PartDto.Create>
//   implements OnInit, OnDestroy, AfterViewInit, OnChanges {
//   @Input() listOnCallback: () => any;
//   @Input() BOMId;
//   @Input() BOMGroupName;
//   @Input() deletedPart: boolean;
//   @Output() sendToAction = new EventEmitter<BOM.Create>();
//   @Input() off = true;
//   totalElements = 0;
//   doSave = false;
//   MyModalSize = ModalSize;
//   partList: partListNsp.ComponentData;
//   inventory = new PartDto.Create();
//   partSelectedList: BOM.BOMPart[] = [];
//   partSelectedListCopy: BOM.BOMPart[] = [];
//   exist = false;
//   BOMPartList: BOM.BOMPartListCreate [] = [];
//   BOMPart = new BOM.BOMPartListCreate();
//   disabledButton = false;
//   toolKit2 = Toolkit2;
//   constructor(public partService: PartService,
//               public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
//               public activatedRoute: ActivatedRoute,
//               private cacheService: CacheService,
//               public router: Router) {
//     super(activatedRoute, router, partListNsp.RouteParam, partListNsp.QueryParam);
//     this.partList = new partListNsp.ComponentData(partListNsp.RouteParam, partListNsp.QueryParam);
//     /**
//      * If You want change default values in dataOfUserList, you can do like blew
//      * --> this.dataOfUserList.init({sizeList: [2, 5, 10, 15]});
//      */
//     this.partList = new partListNsp.ComponentData(partListNsp.RouteParam, partListNsp.QueryParam);
//     this.fireInitiatePagination();
//     super.receiveData();
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
//   }
//
//   ngOnChanges(changes: SimpleChanges) {
//     if (changes && changes.off && changes.off.currentValue) {
//     }
//     if (this.deletedPart === true) {
//       this.getCacheServiceList();
//       // this.partSelectedList.splice(this.indexOfItem, 1);
//       // this.indexOfItem = null;
//     }
//     if (this.BOMId && !isNullOrUndefined(this.BOMId)) {
//       this.getOneBOMByCacheService();
//       // same define
//       this.getAllSelectedParts();
//     }
//   }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.partList.queryParamReal.paging,
//         term: this.partList.term
//       }
//     );
//   }
//
//   getListSelf(options?: any) {
//     this.partService.getAllPartByPagination({
//       paging: this.partList.queryParamReal.paging,
//       totalElements: this.partList.itemPage.totalElements,
//       term: this.partList.term
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.Create>) => {
//       this.partList.itemPage = res;
//     });
//     // ===========================================================================
//   }
//
//   getCacheServiceList() {
//     this.partSelectedList = this.cacheService.get('allPartList', CacheType.LOCAL_STORAGE);
//     for (const item of this.partList.itemPage.content) {
//       item.partQuantity = 0;
//       for (const one of this.partSelectedList) {
//         if (one.partId === item.id) {
//           item.partQuantity = one.partQuantity;
//         }
//
//       }
//
//     }
//
//   }
//
//   chooseSelectedItemForEdit(item: PartDto.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, id: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: PartDto.Create) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   deleteItem(item: PartDto.Create) {
//     this.partService.delete({partId: item.id})
//       .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//       if (res === true) {
//         this.partList.itemPage.content = this.partList.itemPage.content
//           .filter((e) => {
//             return e.id !== item.id;
//           });
//         this.processPage();
//       }
//     });
//   }
//
//   onReceiveQueryParam(queryParam: partListNsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.partList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: partListNsp.RouteParam): any {
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
//     this.partList.sortings =
//       super.defaultSortify(this.partList.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: PartDto.Create) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: PartDto.Create) {
//     if (this.selectedList.filter(e => e.id === item.id).length > 0) {
//       this.selectedList
//         .splice(this.selectedList.map(e => e.id)
//           .indexOf(item.id), 1);
//       this.deSelectedItem.emit(item);
//     } else {
//       this.selectedList.push(item);
//       this.selectedItem.emit(item);
//     }
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
//   getComponentData(): partListNsp.ComponentData {
//     return this.partList;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//   ngAfterViewInit(): void {
//   }
//
//   getListOnCallback(): Function {
//     return undefined;
//   }
//
//
//   sendItemForModal1(item: PartDto.Create) {
//     const partSelected = new BOM.BOMPart();
//     if (this.partSelectedList.length > 0) {
//       for (let i = 0; i < this.partSelectedList.length; i++) {
//         if (this.partSelectedList[i].partId === item.id) {
//           this.exist = true;
//           break;
//         }
//       }
//       if (this.exist === false) {
//         if (!item.partQuantity) {
//           DefaultNotify.notifyDanger('تعداد قطعه را انتخاب کنید.');
//           return;
//         }
//         if (item.partQuantity && item.partQuantity % 1 !== 0) {
//           DefaultNotify.notifyDanger('تعداد قطعه نمی تواند به صورت اعشاری باشد.');
//           return;
//         }
//         partSelected.partId = item.id;
//         partSelected.partName = item.name;
//         partSelected.partCode = item.partCode;
//         partSelected.partQuantity = item.partQuantity;
//         // partSelected.id = this.BOMId;
//         this.partSelectedList.push(partSelected);
//       }
//       this.exist = false;
//     } else {
//       if (!item.partQuantity) {
//         DefaultNotify.notifyDanger('تعداد قطعه را انتخاب کنید.');
//         return;
//       }
//       partSelected.partId = item.id;
//       partSelected.partName = item.name;
//       partSelected.partCode = item.partCode;
//       partSelected.partQuantity = item.partQuantity;
//       // partSelected.id = this.BOMId;
//       this.partSelectedList.push(partSelected);
//     }
//     this.exist = false;
//
//   }
//
//   getAllSelectedParts() {
//     // this.billOfMaterialsGroupsService.getAllPartBOM({
//     //   BOMId: this.BOMId
//     // }).pipe(takeUntilDestroyed(this)).subscribe((res: BOM.BOMPart[]) => {
//     //   if (res && res.length) {
//     //     this.partSelectedList = res;
//     //   } else {
//     //     this.partSelectedList = [];
//     //   }
//     // });
//   }
//
//   hasItem(id: string) {
//     let has = false;
//     if (this.partSelectedList && this.partSelectedList.length) {
//       for (const item of this.partSelectedList) {
//         if (item.partId === id) {
//           has = true;
//           break;
//         } else {
//           has = false;
//         }
//       }
//       return has;
//     }
//   }
//
//
//   deleteItemFromModal1(item: BOM.BOMPart, i) {
//     this.exist = false;
//     if (this.partSelectedListCopy && this.partSelectedListCopy.length > 0) {
//       for (let j = 0; j < this.partSelectedListCopy.length; j++) {
//         if (this.partSelectedListCopy[j].partId === item.partId) {
//           this.partSelectedList.splice(i, 1);
//           this.partSelectedListCopy.splice(j, 1);
//
//           // this.billOfMaterialsGroupsService.deletePartBOM({
//           //   BOMPartId: item.partId,
//           //   // BOMId: item.id
//           // }).subscribe((res: boolean) => {
//           //   if (res) {
//           //     this.partSelectedList.splice(i, 1);
//           //     this.partSelectedListCopy.splice(j, 1);
//           //   }
//           // });
//           this.exist = true;
//           break;
//         }
//       }
//     }
//     if (this.exist === false) {
//       this.partSelectedList.splice(i, 1);
//     }
//     for (let one of this.partList.itemPage.content) {
//       if (one.id === item.partId) {
//         one.partQuantity = 0;
//       }
//     }
//     this.exist = false;
//   }
//
//
//   action() {
//     this.disabledButton = true;
//     for (const item of this.partSelectedList)  {
//       this.BOMPart = new BOM.BOMPartListCreate();
//       this.BOMPart.partId = item.partId;
//       this.BOMPart.partQuantity = item.partQuantity;
//       this.BOMPartList.push(this.BOMPart);
//     }
//     this.billOfMaterialsGroupsService.updatePartBOM(this.BOMPartList, {id: this.BOMId })
//         .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
//         if (res) {
//           this.disabledButton = false;
//           DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
//           this.cancelModal();
//         }
//       });
//   }
//
//
//   cancelModal() {
//     ModalUtil.hideModal('modal1');
//   }
//
//   getOneBOMByCacheService() {
//     this.partSelectedList = [];
//     this.partSelectedList = this.cacheService.get('allPartList', CacheType.LOCAL_STORAGE);
//     for (const item of this.partSelectedList) {
//       if (!isNullOrUndefined(item.partCode)) {
//         item.partCode = item.partCode;
//       }
//     }
//
//     // this.billOfMaterialsGroupsService.getOneBOM({BOMId: this.BOMId})
//     //   .pipe(takeUntilDestroyed(this)).subscribe((res: BOM.Create) => {
//     //   if (res) {
//     //     this.BOM = res;
//     //     this.partSelectedList = res.bomPartList;
//     //     this.partSelectedListCopy = res.bomPartList;
//     //   } else {
//     //     this.partSelectedList = [];
//     //   }
//     // });
//
//   }
//
//   hideModal() {
//     ModalUtil.hideModal('modal1');
//
//   }
//
// }
//
// export namespace partListNsp {
//
//   export class ComponentData extends ListComponentData<PartDto.Create, RouteParam, QueryParam> {
//     // labels: Labels = new Labels();
//   }
//
//
//   export class RouteParam {
//   }
//
//   export class QueryParam extends ListQueryParam {
//   }
// }
