import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../../../model/dto/part';
import {InventoryService} from '../../../endpoint/inventory.service';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {Tools} from '../../../../../shared/tools/Tools';
import {InventoryDTO} from '../../model/inventory';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-inventory-list',
    templateUrl: './inventory-list.component.html',
    styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() partName: string;
    @Input() modePart: ActionMode;
    @Input() partCode: string;
    @Input() listOnCallback: () => any;
    @Output() numberOfInventory = new EventEmitter<number>();
    componentData = new ComponentData();
    selectedItemForDelete = new DeleteModel();
    MyModalSize = ModalSize;
    actionMode = ActionMode;
    tools = Tools;

    dataOfInventoryList: InventoryDTO.GetAll [] = [];
    loading = false;
    showModal = false;
    variableToReadGetOn = 0;
    mode: ActionMode = ActionMode.ADD;
    id;
    partId: string;
    location = new PartDto.CheckLocation();


    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        public inventoryService: InventoryService,
    ) {
        this.partId = this.activatedRoute.snapshot.queryParams.entityId;
        this.componentData = new ComponentData();

    }

    canDeactivate(): boolean {
        return true;
    }

    ngOnInit() {
        this.getListSelf();

    }

    ngOnChanges() {
    }

    onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
    }


    onReceiveRouteData(routeData: any) {
    }


    getListSelf(options?: any) {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.inventoryService.getAllByPaginationInventory({
            paging,
            totalElements:-1,
            partId: this.partId
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<InventoryDTO.GetAll>) => {
            this.loading = false;
            if (res) {
                this.dataOfInventoryList = res.content;
                this.length = res.totalElements;
            }
        }, error => {
            this.loading = false;
        });
    }


    chooseSelectedItemForEdit(item: InventoryDTO.GetAll) {
        this.mode = this.actionMode.EDIT;
        this.showModal = true;
        this.id = null;
        setTimeout(() => {
            this.id = JSON.parse(JSON.stringify(item.inventoryId));
        }, 50);
        setTimeout(() => {
            ModalUtil.showModal('inventoryModal');
        }, 100);
    }

    chooseSelectedItemForView(item: InventoryDTO.GetAll) {
        this.mode = this.actionMode.VIEW;
        this.showModal = true;
        this.id = null;
        setTimeout(() => {
            this.id = JSON.parse(JSON.stringify(item.inventoryId));
        }, 50);
        setTimeout(() => {
            ModalUtil.showModal('inventoryModal');
        }, 100);

    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.inventoryService.deleteInventory({inventoryId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

                if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                } else if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.dataOfInventoryList = this.dataOfInventoryList

                        .filter((e) => {
                            return e.inventoryId !== this.selectedItemForDelete.id;
                        });

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


    showModalDelete(item: InventoryDTO.GetAll, i) {
        // this.location.warehouse = item.warehouse;
        // this.location.row = item.row;
        // this.location.corridor = item.corridor;
        // this.location.inventoryLocation.id = item.inventoryLocation.id;
        // this.location.partId = this.partId;
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.inventoryId;
        this.selectedItemForDelete.title = ' آیا    ' + 'این موجودی ' + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }


    search() {
        this.length = 0;
        if (this.componentData.myQuery.paging.page === 0) {
            this.getListSelf();
        } else {
            this.componentData.myQuery.paging.page = 0;
            this.router.navigate([], {
                queryParams: {
                    page: this.componentData.myQuery.paging.page,
                    size: this.componentData.myQuery.paging.size
                },
                relativeTo: this.activatedRoute
            });
        }
    }

    setService() {
        this.mode = ActionMode.ADD;
        this.id = null;
        this.showModal = true;
        this.id = -1;
        setTimeout(() => {
            this.id = null;
        }, 50);
        setTimeout(() => {
            ModalUtil.showModal('inventoryModal');
        }, 100);
    }

    receiveMessage(event: InventoryDTO.GetAll) {
        // this.showModal = false;
        if (this.mode === ActionMode.EDIT) {
            const index = this.dataOfInventoryList.findIndex(e => e.inventoryId === this.id);
            if (index !== -1) {
                this.eventMethod(event, index);
            }
        } else {
            this.eventMethod(event, -1);

        }
    }

    eventMethod(event: InventoryDTO.GetAll, index) {
        if (index !== -1) {
            this.dataOfInventoryList[index] = new InventoryDTO.GetAll();
            this.dataOfInventoryList[index] = event;
        } else {
            this.dataOfInventoryList.push(event);
        }
        this.numberOfInventory.emit(JSON.parse(JSON.stringify(this.dataOfInventoryList.length)));
    }

    closeModal() {
        // this.showModal = false;
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
}

export class ComponentData {
    myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
}

export namespace CourseParam {
    export class RouteParam {

    }

    export class QueryParam {
        paging: Paging;

        constructor() {
            this.paging = new Paging();
            this.paging.page = 0;
            this.paging.size = 10;
        }
    }
}

