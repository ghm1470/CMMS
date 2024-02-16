import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../../../part/model/dto/part';
import {InventoryService} from '../../../part/endpoint/inventory.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {StorageService} from '../../../storage/endpoint/storage.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {PartService} from "../../../part/endpoint/part.service";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {isNotNullOrUndefined} from "codelyzer/util/isNotNullOrUndefined";
import {isNullOrUndefined} from "util";
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {FileDataTable} from "../../../../shared/export-file/export-file/export-file.component";
import {GetAllWorkTableForReport} from "../../../part/feature/list/part-list.component";

@Component({
    selector: 'app-current-inventory-list',
    templateUrl: './current-inventory-list.component.html',
    styleUrls: ['./current-inventory-list.component.scss']
})
export class CurrentInventoryListComponent implements OnInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    actionMode = ActionMode;

    entityList: PartDto.GetAll[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    storageList: any[] = [];
    getAllByFilterAndPaginationCurrentInventory = new GetAllByFilterAndPagination();
    partList: any[] = [];

    constructor(private entityService: InventoryService,
                public router: Router,
                private cacheService: CacheService,
                protected assetService: AssetService,
                private storageService: StorageService,
                private partService: PartService,
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
        this.getAllStorage();

        /// قطعات
        this.loadSearchPart();
        this.pagingGetAllPart.size = 10;
        this.pagingGetAllPart.page = 0;
        setTimeout(() => {
            this.searchSubject.next('');
        }, 10);
        /// قطعات!!!!!!

        // this.getAllAssetByTerm('onInit');
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getAllStorage() {
        this.storageService.getAll().subscribe(res => {
            if (res) {
                this.storageList = res;
            }
        });
    }

    pagingGetAllPart = new Paging();
    totalElementsGetAllPart = -1;
    searchSubject = new Subject<string>();
    searchTextValuePart: string;
    loadingExecSearch = false;

    execSearch(event) {
        if (isNullOrUndefined(event)) {
            if (this.searchTextValuePart !== '') {
                this.searchSubject.next('');
            }
        } else if (event.term) {
            this.searchSubject.next(event.term);
        }
    }


    loadSearchPart() {
        this.searchSubject.pipe(
            debounceTime(1000)
        ).subscribe((searchTextValue: string) => {
            this.searchTextValuePart = searchTextValue;
            this.pagingGetAllPart.page = 0;
            this.totalElementsGetAllPart = -1;
            this.getAllPart();
        });


    }

    getAllPart() {
        if (this.totalElementsGetAllPart === this.partList.length) {
            return;
        }

        this.loadingExecSearch = true;
        this.partService.getAllPartByPagination(
            {
                paging: this.pagingGetAllPart,
                totalElements: this.totalElementsGetAllPart,
                term: this.searchTextValuePart
            }).subscribe((res: any) => {
            this.loadingExecSearch = false;

            if (res) {
                if (this.pagingGetAllPart.page === 0) {
                    this.partList = res.content;
                } else {
                    this.partList = this.partList.concat(res.content);
                }
                this.pagingGetAllPart.page++;
                this.totalElementsGetAllPart = res.totalElements;
            }
        }, error => {
            this.loadingExecSearch = false;
        });


    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        // this.getAllByFilterAndPaginationCurrentInventory.assetId = this.selectedAssetId;
        this.entityService.getInventoryByPartNameAndInventoryLocationTitle(
            this.getAllByFilterAndPaginationCurrentInventory, {
                paging,
                totalElements: -1,
                term: this.term
            }).pipe(takeUntilDestroyed(this))
            // this.entityService.getAll()
            .subscribe((res: any) => {
                this.loading = false;
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                }

            }, error => {
                this.loading = false;
            });
    }

    /// گزارش برای pdf. excel
    ////////////دریافت  pdf,excel
    entityListForReport: GetAllInventoryForReport[] = [];

    fileDataTableList: FileDataTable[] = [
        {thTitle: 'نام قطعه  ', tdTitle: 'partName'},
        {thTitle: 'کد قطعه                    ', tdTitle: 'partCode'},
        {thTitle: 'کد موجودی  ', tdTitle: 'inventoryCode'},
        {thTitle: 'انبار قطعه ', tdTitle: 'inventoryLocationTitle'},
        {thTitle: 'موقعیت مکانی در انبار  ', tdTitle: 'location'},
        {thTitle: 'مقدار در دسترس', tdTitle: 'currentQuantity'},
        {thTitle: 'حداقل موجودی', tdTitle: 'minQuantity'},
        {thTitle: 'مقدار سفارش  ', tdTitle: 'orderAmount'},
    ];

    ////////////دریافت  pdf,excel
    EmActivityGetPageForExcel() {

        this.entityService.getAllInventoryForExcel(
            this.getAllByFilterAndPaginationCurrentInventory).pipe(takeUntilDestroyed(this))
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    const list = res;
                    list.map(e => {
                        e.inventoryLocationTitle = e.inventoryLocation.title;
                    });
                    this.entityListForReport = res;
                }

            }, error => {
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
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                term: this.term,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: PartDto.GetAll) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.inventoryId},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: PartDto.GetAll) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.inventoryId},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: PartDto.GetAll, i) {
        console.log(item);
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.inventoryId;
        this.selectedItemForDelete.title = ' آیا    ' + item.partName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({inventoryId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === true) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                } else {
                    DefaultNotify.notifyDanger(res);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    selectedAssetId: string;
    termForAsset: string;
    loadingAssetList = false;
    assetList = [];
    assetPageIndex = 0;
    assetPageSize = 10;

    getAllAssetByTerm(type?) {
        const paging = new Paging();
        if (type === 'onInit') {
            this.assetPageIndex = 0;
        } else {
            this.assetPageIndex += 1;
        }
        paging.size = this.assetPageSize;
        paging.page = this.assetPageIndex;
        this.loadingAssetList = true;
        this.assetService.getAllAssetByTerm({paging, totalElements: 0, term: this.termForAsset})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAssetList = false;
            if (this.assetList.length === 0) {
                this.assetList = res.content;
            } else {
                this.assetList = this.assetList.concat(res.content);
            }
            this.assetList = this.assetList.filter(u => u.id !== this.selectedAssetId);

        });
    }

}

export class GetAllInventoryForReport {
    inventoryId: string;
    inventoryLocation: any;
    inventoryLocationTitle: string;
    currentQuantity: string;
    minQuantity: string;
    partId: string;
    partName: string;
    partCode: string;
    location: string;
    orderAmount: string;
    inventoryCode: string;
    previousQuantity: string;
}

//////////////////////////////////////

//     componentData: ComponentData;
//     totalElements = 0;
//     totalPages = 0;
//     loading = false;
//     datOfCurrentInventoryList: PartDto.GetAll [] = [];
//     inventoryLocation: PartDto.CheckLocation;
//     storageList: any[] = [];
//     roleList = new TokenRoleList();
//     selectedItemForDelete = new DeleteModel();
//     toolkit2 = Toolkit2;
//
//     constructor(protected _Router: Router,
//                 protected _ActivatedRoute: ActivatedRoute,
//                 public inventoryService: InventoryService,
//                 private cacheService: CacheService,
//                 private storageService: StorageService,
//                 protected assetService: AssetService,
//     ) {
//         super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//         this.componentData = new ComponentData();
//         this.receiveData();
//
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     ngOnInit() {
//         this.getRoleListKey();
//         this.getAllStorage();
//     }
//
//     getAllStorage() {
//         this.storageService.getAll().subscribe(res => {
//             if (res) {
//                 this.storageList = res;
//             }
//         });
//     }
//
//     getRoleListKey() {
//         this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             if (res) {
//                 this.roleList = res;
//             }
//         });
//     }
//
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.loading = true;
//         this.getListSelf();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//
//     getListSelf() {
//         // =============================================
//         this.loading = true;
//         this.inventoryService.getInventoryByPartNameAndInventoryLocationTitle(
//             this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory,
//             {
//                 paging: this.componentData.myQuery.paging,
//                 totalElements: this.totalElements,
//             }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.GetAll>) => {
//             this.loading = false;
//             if (res) {
//                 this.datOfCurrentInventoryList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//
//     }
//
//     chooseSelectedItemForEdit(item: PartDto.GetAll) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, inventoryId: item.inventoryId},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: PartDto.GetAll) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.VIEW, inventoryId: item.inventoryId},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     deleteItem(event) {
//         console.log('this.selectedItemForDelete.id', this.selectedItemForDelete.id);
//
//         if (event) {
//             this.inventoryService.delete({inventoryId: this.selectedItemForDelete.id})
//
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
//                 if (res === true) {
//                     DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//                     this.datOfCurrentInventoryList = this.datOfCurrentInventoryList
//                         .filter((e) => {
//                             return e.inventoryId !== this.selectedItemForDelete.id;
//                         });
//                 } else if (!res) {
//                     DefaultNotify.notifyDanger('مشکلی رخ داد.');
//
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                 }
//             });
//         } else if (!event) {
//             ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//     }
//
//
//     showModalDelete(item, i) {
//         console.log('item', item);
//
//         this.selectedItemForDelete.loading = false;
//         this.selectedItemForDelete.id = item.inventoryId;
//         this.selectedItemForDelete.title = ' آیا موجودی با عنوان    ' + item.partName + ' ' + item.partCode + ' حذف  شود؟ ';
//         this.selectedItemForDelete.index = i;
//         setTimeout(e => {
//             ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//         }, 10);
//     }
//
//
//     setPage(page) {
//         super.setToQueryParams({page: page, size: this.componentData.myQuery.paging.size});
//     }
//
//
//     search() {
//         if (!isNullOrUndefined(this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.partName)) {
//             this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.partName = this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.partName.trim();
//         }
//         this.totalElements = 0;
//         super.setToQueryParams({
//             page: 0,
//             size: 10,
//             inventoryLocation: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.inventoryLocation,
//             partCode: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.partCode,
//             warehouse: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.warehouse,
//             row: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.row,
//             corridor: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.corridor,
//             partName: this.componentData.myQuery.getAllByFilterAndPaginationCurrentInventory.partName,
//         });
//     }
//
//
//     ngOnDestroy(): void {
//     }
//
//     ngOnChanges(changes: SimpleChanges): void {
//     }
//
//
//     ngAfterViewInit(): void {
//     }
// }
//
// export class ComponentData {
//     myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
// }
//
// export namespace CourseParam {
//     export class RouteParam {
//
//     }
//
//     export class QueryParam {
//         paging: Paging;
//         getAllByFilterAndPaginationCurrentInventory: GetAllByFilterAndPagination;
//
//         constructor() {
//             this.paging = new Paging();
//             this.getAllByFilterAndPaginationCurrentInventory = new GetAllByFilterAndPagination();
//             this.paging.page = 0;
//             this.paging.size = 10;
//             this.getAllByFilterAndPaginationCurrentInventory.inventoryLocation = null;
//             this.getAllByFilterAndPaginationCurrentInventory.partCode = null;
//             this.getAllByFilterAndPaginationCurrentInventory.warehouse = null;
//             this.getAllByFilterAndPaginationCurrentInventory.row = null;
//             this.getAllByFilterAndPaginationCurrentInventory.corridor = null;
//             this.getAllByFilterAndPaginationCurrentInventory.partName = null;
//         }
//     }
//
// }
//
//
export class GetAllByFilterAndPagination {
    // inventoryLocation: string;
    // partCode: string;
    // inventoryCode: string;
    // warehouse: string;
    // row: string;
    // corridor: string;
    // partName: string;
    // assetId: string;

    partId: string; //ایدی قطعه
    inventoryLocation: string;//انبار قطعه
    location: string; //موقعیت مکانی در انبار
}

//
