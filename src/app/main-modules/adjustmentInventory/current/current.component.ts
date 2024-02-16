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
import {ActionMode, isNullOrUndefined, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../part/model/dto/part';
import {InventoryService} from '../../part/endpoint/inventory.service';
import {DeleteModel} from '../../../shared/conferm-delete/model/delete-model';
import {StorageService} from '../../storage/endpoint/storage.service';
import {ChangesCurrentInventory} from '../adjustment-inventory.component';


@Component({
    selector: 'app-current',
    templateUrl: './current.component.html',
    styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() lastEvent = new ChangesCurrentInventory();
    @Input() allowToOpenCollapse: number;
    @Output() messageEvent = new EventEmitter<PartDto.GetAll>();
    loading = false;
    datOfCurrentList: PartDto.GetAll [] = [];
    datOfCurrentListCopy: PartDto.GetAll [] = [];
    selectedItemForDelete = new DeleteModel();
    storageList: any[] = [];
    MyModalSize = ModalSize;
    inventory = new PartDto.GetAll();
    inventoryCopy = new PartDto.GetAll();
    getAllByFilterAndPaginationAdjustmentInventory = new GetAllByFilterAndPaginationAdjustmentInventory();

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                public  storageService: StorageService,
                public inventoryService: InventoryService,
    ) {

    }

    canDeactivate(): boolean {
        return true;
    }

    ngOnInit() {
        this.getAllStorage();
        // this.getListSelf();

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.lastEvent) {
            this.inventoryCopy.previousQuantity = this.inventoryCopy.currentQuantity;
            this.inventoryCopy.currentQuantity = this.lastEvent.currentQuantity;
            this.datOfCurrentList.push(this.inventoryCopy);
        }
    }

    getAllStorage() {
        this.storageService.getAll().subscribe(res => {
            if (res) {
                this.storageList = res;
            }
        });
    }


    getListSelf() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.inventoryService.getAllCurrentInventory(
            this.getAllByFilterAndPaginationAdjustmentInventory, {
                paging,
                totalElements:-1,
            }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.GetAll>) => {
            this.loading = false;
            if (res) {
                this.loading = false;
                this.datOfCurrentList = res.content;
                this.datOfCurrentListCopy = JSON.parse(JSON.stringify(res.content));
                this.length = res.totalElements;
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


    search() {
        this.pageIndex = 0;
        this.getListSelf();
    }


    ngOnDestroy(): void {
    }


    cancelModal() {
        ModalUtil.hideModal('current');
    }

    sendMassage(inventory) {
        this.inventory = inventory;
        if (!isNullOrUndefined(this.inventoryCopy.inventoryId)) {
            if (this.inventoryCopy.inventoryId !== this.inventory.inventoryId) {
                this.datOfCurrentList.push(this.inventoryCopy);
            }
        }
        this.inventoryCopy = JSON.parse(JSON.stringify(this.inventory));
        this.messageEvent.emit(this.inventory);

        // ==================================حذف
        this.datOfCurrentList = this.datOfCurrentList
            .filter((e) => {
                return e.inventoryId !== inventory.inventoryId;
            });
        // ================================حذف
        this.cancelModal();
    }

    ngAfterViewInit(): void {
        ModalUtil.showModal('adjustmentInventory');
    }
}

// export class ComponentData {
//   myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
// }

// export namespace CourseParam {
//   export class RouteParam {
//
//   }
//
//   export class QueryParam {
//     paging: Paging;
//     getAllByFilterAndPaginationAdjustmentInventory: GetAllByFilterAndPaginationAdjustmentInventory;
//
//     constructor() {
//       this.paging = new Paging();
//       this.getAllByFilterAndPaginationAdjustmentInventory = new GetAllByFilterAndPaginationAdjustmentInventory();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.getAllByFilterAndPaginationAdjustmentInventory.partName = null;
//       this.getAllByFilterAndPaginationAdjustmentInventory.partCode = null;
//       this.getAllByFilterAndPaginationAdjustmentInventory.corridor = null;
//       this.getAllByFilterAndPaginationAdjustmentInventory.row = null;
//       this.getAllByFilterAndPaginationAdjustmentInventory.warehouse = null;
//       this.getAllByFilterAndPaginationAdjustmentInventory.inventoryLocation = null;
//     }
//   }
//
// }


export class GetAllByFilterAndPaginationAdjustmentInventory {
    partName: string;
    partCode: string;
    inventoryCode: string;
    corridor: string;
    row: string;
    warehouse: string;
    inventoryLocation: string;
}

// ========================================================================================================
//   extends BaseListComponentSeven<CurrentListNsp.RouteParam, CurrentListNsp.QueryParam,
//   CurrentListNsp.ComponentData, PartDto.GetAll>
//   implements OnInit, OnDestroy, AfterViewInit, OnChanges {
//   @Input() listOnCallback: () => any;
//   @Input() wrongChoiceInventory: any;
//   @Input() againGetAll: boolean;
//   @Output()messageEvent = new EventEmitter<PartDto.GetAll>();
//   totalElements = 0;
//   againGetAllLast
//   searchedCurrent = new PartDto.GetAll();
//   noSearchResult = false;
//
//   MyModalSize = ModalSize;
//   currentList: CurrentListNsp.ComponentData;
//   inventory = new PartDto.GetAll();
//   constructor(public inventoryService: InventoryService,
//               public activatedRoute: ActivatedRoute,
//               public router: Router) {
//     super(activatedRoute, router, CurrentListNsp.RouteParam, CurrentListNsp.QueryParam);
//     this.currentList = new CurrentListNsp.ComponentData(CurrentListNsp.RouteParam, CurrentListNsp.QueryParam);
//     /**
//      * If You want change default values in dataOfUserList, you can do like blew
//      * --> this.dataOfUserList.init({sizeList: [2, 5, 10, 15]});
//      */
//     this.currentList = new CurrentListNsp.ComponentData(CurrentListNsp.RouteParam, CurrentListNsp.QueryParam);
//     this.fireInitiatePagination();
//     super.receiveData();
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
//     // this._setToQueryParams(this.currentList.queryParam);
//   }
//   ngOnChanges() {
//     if (this.againGetAll === this.againGetAllLast ) {
//       this.currentList.itemPage.content.push(this.wrongChoiceInventory);
//     }
//     if (this.againGetAll !== this.againGetAllLast && this.againGetAll === true) {
//       this.getListSelf();
//     }
//     this.againGetAllLast = this.againGetAll;
//   }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.currentList.queryParamReal.paging,
//         term: this.currentList.term
//       }
//     );
//   }
//
//   getListSelf(options?: any) {
//     this.inventoryService.getAllCurrentInventory({
//       paging: this.currentList.queryParamReal.paging,
//       totalElements: this.currentList.itemPage.totalElements,
//       term: this.currentList.term
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.GetAll>) => {
//       // ;
//       this.currentList.itemPage = res;
//     });
//     // ===========================================================================
//   }
//
//   chooseSelectedItemForEdit(item: PartDto.GetAll) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, inventoryId: item.inventoryId},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: PartDto.GetAll) {
//     this.router.navigate([item.inventoryId, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   deleteItem(item: PartDto.GetAll) {
//     // if (confirm('از حذف این '))
//     this.inventoryService.deleteInventory({inventoryId: item.inventoryId})
//       .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//       if (res === true) {
//         this.currentList.itemPage.content = this.currentList.itemPage.content
//           .filter((e) => {
//             return e.inventoryId !== item.inventoryId;
//           });
//         this.processPage();
//       }
//     });
//   }
//
//   onReceiveQueryParam(queryParam: CurrentListNsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.currentList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: CurrentListNsp.RouteParam): any {
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
//     this.currentList.sortings =
//       super.defaultSortify(this.currentList.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: PartDto.GetAll) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: PartDto.GetAll) {
//     if (this.selectedList.filter(e => e.inventoryId === item.inventoryId).length > 0) {
//       this.selectedList
//         .splice(this.selectedList.map(e => e.inventoryId)
//           .indexOf(item.inventoryId), 1);
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
//   getComponentData(): CurrentListNsp.ComponentData {
//     return this.currentList;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//   setIdFor(event) {
//     // this.getAllUserFilter.userTypeId = event.id;
//   }
//
//   cancelModal() {
//     ModalUtil.hideModal('current');
//   }
//   sendMassage(inventory) {
//     this.inventory = inventory;
//     this.messageEvent.emit(this.inventory);
//
//     // ==================================حذف
//     this.currentList.itemPage.content = this.currentList.itemPage.content
//           .filter((e) => {
//             return e.inventoryId !== inventory.inventoryId;
//           });
//     this.processPage();
//     // ================================حذف
//     this.cancelModal();
//   }
//
//   ngAfterViewInit(): void {
//     ModalUtil.showModal('adjustmentInventory');
//   }
//   search() {
//     this.inventoryService.search({
//       paging: this.currentList.queryParamReal.paging,
//       totalElements: this.currentList.itemPage.totalElements,
//       partName: this.searchedCurrent.partName,
//       partCode: this.searchedCurrent.partCode
//     } )
//         .subscribe((res: any) => {
//           if (res.content.length > 0) {
//             this.currentList.itemPage.content = res.content;
//             this.noSearchResult = false;
//           } else {
//             this.currentList.itemPage.content = [];
//             this.noSearchResult = true;
//           }
//         });
//     }
//
//   getListOnCallback(): Function {
//     return undefined;
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
// }
//
// export namespace CurrentListNsp {
//
//   export class ComponentData extends ListComponentData<PartDto.GetAll, RouteParam, QueryParam> {
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
