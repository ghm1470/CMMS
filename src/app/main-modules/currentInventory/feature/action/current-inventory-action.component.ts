import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PartDto} from '../../../part/model/dto/part';
import {ActionMode, DefaultNotify, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {UserDto} from '../../../user/model/dto/user-dto';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {Location} from '@angular/common';
import {InventoryService} from '../../../part/endpoint/inventory.service';
import {ChargeDepartmentService} from '../../../part/endpoint/charge-department.service';
import {BudgetService} from '../../../part/endpoint/budget.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../storage/endpoint/storage.service';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {PartService} from "../../../part/endpoint/part.service";
import {InventoryDTO} from "../../../part/inventory/model/inventory";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {MyPattern} from "../../../../shared/shared/tools/myPattern";

declare var $: any;

@Component({
    selector: 'app-current-inventory-action',
    templateUrl: './current-inventory-action.component.html',
    styleUrls: ['./current-inventory-action.component.scss']
})
export class CurrentInventoryActionComponent implements OnInit, OnDestroy {
    @Input() receiveInventoryForEdit: any;
    @Output() messageEvent = new EventEmitter<PartDto.CreateInventory>();
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    doSave = false;
    part = new PartDto.Create();
    budgetUId: string;
    storageUId: string;
    existInventoryCode = true;
    existLocation = false;
    chargeDepartmentUId: string;
    budgetList: Budget[] = [];
    storageList: any[] = [];
    budget = new Budget();
    user: UserDto.Create;
    inventoryId;
    modalId;
    chargeDepartment = new ChargeDepartment();
    chargeDepartmentList: ChargeDepartment[] = [];
    inventory = new PartDto.CreateInventory();
    inventoryCopy = new PartDto.CreateInventory();
    checkLocation = new PartDto.CheckLocation();
    disabledButton = false;
    partList: any[] = [];
    myPattern = MyPattern;
    checkInventoryCodeLoading = false;

    constructor(public location: Location,
                private inventoryService: InventoryService,
                private chargeDepartmentService: ChargeDepartmentService,
                private budgetService: BudgetService,
                public partService: PartService,
                public router: Router,
                public activatedRoute: ActivatedRoute,
                private storageService: StorageService,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.inventoryId = this.activatedRoute.snapshot.queryParams.entityId;
        this.modalId = ModalUtil.generateModalId();
    }

    ngOnInit() {
        this.inventory = new PartDto.CreateInventory();
        // this.storageUId = '';
        this.chargeDepartmentUId = '';
        this.budgetUId = '';
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.inventoryId)) {
                this.getOne();

            }
        }
        if (this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.inventoryId)) {
                this.getOne();
                $('.input-c').attr('disabled', 'disabled');
            }
        }

        this.getAllBudget();
        this.getAllChargeDepartment();
        this.getAllStorage();
        /// قطعات
        if (this.mode === ActionMode.ADD) {
            this.loadSearchPart();
            this.pagingGetAllPart.size = 10;
            this.pagingGetAllPart.page = 0;
            setTimeout(() => {
                this.searchSubject.next('');
            }, 10);
        }
        /// قطعات!!!!!!
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
                if (this.mode === ActionMode.EDIT) {
                    if (!isNullOrUndefined(this.inventoryId)) {
                        if (!this.partList.some(p => p.id === this.inventoryPart.id)) {
                            this.partList.unshift(this.inventoryPart);
                        }
                    }
                }
            }
        }, error => {
            this.loadingExecSearch = false;
        });


    }


    cancel() {
        // $('#forms')[0].reset();
        // this.inventory = new PartDto.CreateInventory();
        // this.existLocation = false;
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    receiveMessage(event: PartDto.Create) {
        this.inventory.partName = event.name;
        this.inventory.partCode = event.partCode;
        this.inventory.partId = event.id;
    }

    inventoryPart: any;

    getOne() {
        this.inventoryService.getOne({inventoryId: this.inventoryId})
            .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            if (res) {
                this.inventory = res;
                // if (this.inventory.budgetId) {
                //     if (this.inventory.budgetId.) {
                //         this.budgetUId = this.inventory.budgetId.id;
                //     }      // if (this.inventory.chargeDepartmentId) {
                //                 //     if (this.inventory.chargeDepartmentId.id) {
                //                 //         this.chargeDepartmentUId = this.inventory.chargeDepartmentId.id;
                //                 //     }
                //                 // }
                // }

                // if (this.inventory.inventoryLocationId) {
                //     if (this.inventory.inventoryLocationId.id) {
                //         this.storageUId = this.inventory.inventoryLocationId.id;
                //     }
                // }
                const part = {
                    id: this.inventory.partId,
                    name: this.inventory.partName
                };
                this.inventoryPart = part;
                if (this.mode !== ActionMode.ADD) {
                    this.partList = [part]

                }
                if (isNullOrUndefined(this.inventory.orderAmount)) {
                    this.inventory.orderAmount = null;
                }
                this.inventoryCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    changingInventory() {
        // this.inventory.budgetId = new Budget();
        // this.inventory.budgetId.id = this.budgetUId;
        // this.inventory.chargeDepartmentId = new ChargeDepartment();
        // this.inventory.chargeDepartmentId.id = this.chargeDepartmentUId;
        // this.inventory.inventoryLocationId = new PartDto.Storage();
        // this.inventory.inventoryLocationId.id = this.storageUId;
        this.inventory.user = new UserDto.Create();
        this.inventoryCopy.user = JSON.parse(sessionStorage.getItem('user'));
        this.inventory.user = this.inventoryCopy.user;
    }

    loading = false;
    sendLocation = new InventoryDTO.CheckLocation();


    action(form) {
        if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.inventoryCopy) === JSON.stringify(this.inventory)) {
                // this.loading = false;
                this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                return;
            }
        }
        this.inventory.inventoryCode = Toolkit2.Common.Fa2En(this.inventory.inventoryCode);
        this.inventory.currentQuantity = Toolkit2.Common.Fa2En(this.inventory.currentQuantity);
        this.inventory.minQuantity = Toolkit2.Common.Fa2En(this.inventory.minQuantity);
        this.inventory.price = Toolkit2.Common.Fa2En(this.inventory.price);
        this.inventory.row = Toolkit2.Common.Fa2En(this.inventory.row);
        this.inventory.corridor = Toolkit2.Common.Fa2En(this.inventory.corridor);
        this.inventory.warehouse = Toolkit2.Common.Fa2En(this.inventory.warehouse);
        this.inventory.orderAmount = Toolkit2.Common.Fa2En(this.inventory.orderAmount);
        this.inventory.location = Toolkit2.Common.Fa2En(this.inventory.location);
        this.inventory.receiptNumber = Toolkit2.Common.Fa2En(this.inventory.receiptNumber);

        if (this.mode === ActionMode.ADD) {
            this.changingInventory();
            const dto = this.convertDto();
            this.inventoryService.createInventory(dto)
                .pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.CreateInventory) => {
                this.loading = false;
                if (res && res.inventoryId) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.doSave = false;
                    this.cancel();
                }
            }, error => {
                this.loading = false;
            });
            // ==============================================================>Edit
        } else if (this.mode === ActionMode.EDIT) {
            this.changingInventory();
            if (JSON.stringify(this.inventoryCopy) === JSON.stringify(this.inventory)) {
                // this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
            } else {
                this.inventory.previousQuantity = this.inventoryCopy.currentQuantity;
                const dto = this.convertDto();
                dto.id = this.inventory.id;
                this.inventoryService.createInventory(dto)
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    if (res && res.inventoryId) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        form.reset();
                        this.doSave = false;
                        this.cancel();
                    }
                }, error => {
                    this.loading = false;
                });

            }
        }

    }

    convertDto() {
        const dto = new DtoForAction();
        // dto.id = this.inventory.id;
        dto.currentQuantity = +this.inventory.currentQuantity;
        dto.previousQuantity = +this.inventory.previousQuantity;
        dto.minQuantity = +this.inventory.minQuantity;
        dto.partId = this.inventory.partId;
        dto.chargeDepartmentId = this.inventory.chargeDepartmentId;
        dto.budgetId = this.inventory.budgetId;
        dto.corridor = this.inventory.corridor;
        dto.row = this.inventory.row;
        dto.warehouse = this.inventory.warehouse;
        dto.price = this.inventory.price;
        dto.inventoryCode = this.inventory.inventoryCode;
        dto.userId = this.inventory.user.id;
        dto.inventoryLocationId = this.inventory.inventoryLocationId;
        dto.location = this.inventory.location;
        dto.orderAmount = this.inventory.orderAmount;
        dto.receiptNumber = this.inventory.receiptNumber;
        return dto;
    }

    checkInventoryCode(form) {
        if (this.inventory.inventoryCode && this.inventoryCopy.inventoryCode !== this.inventory.inventoryCode) {
            this.checkInventoryCodeLoading = true;

            this.inventoryService.checkInventoryCode({inventoryCode: this.inventory.inventoryCode}).subscribe((res: boolean) => {
                this.checkInventoryCodeLoading = false;
                if (res) {

                    this.existInventoryCode = true;
                    DefaultNotify.notifyDanger('کد تخصیص یافته تکراری می باشد.', '', NotiConfig.notifyConfig);
                } else if (!res) {
                    this.checkStorage(form);
                    this.existInventoryCode = false;
                }
            });
        } else {
            this.existInventoryCode = false;
            this.checkStorage(form);

        }

    }


    checkStorage(form) {
        if (this.loading) {
            return;
        }


        this.sendLocation.row = this.inventory.row;
        this.sendLocation.corridor = this.inventory.corridor;
        this.sendLocation.warehouse = this.inventory.warehouse;
        this.sendLocation.inventoryLocationId = this.inventory.inventoryLocationId;
        this.sendLocation.partId = this.inventory.partId;
        this.sendLocation.location = this.inventory.location;
        this.sendLocation.receiptNumber = this.inventory.receiptNumber;
        this.sendLocation.orderAmount = this.inventory.orderAmount;
        // =====================================================================>
        // if (this.existInventoryCode === false) {
        this.doSave = true;

        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.loading = false;
            return;
        }
        this.loading = true;
        if (this.mode === ActionMode.ADD) {
            // this.inventoryService.checkLocation(this.sendLocation).subscribe(res => {
            //     if (res === true) {
            //         this.existLocation = true;
            //         this.loading = false;
            //         window.scrollTo(0, 0);
            //         DefaultNotify.notifyDanger('انبار با این ردیف ، راهرو و انبارک قبلا ثبت گردیده است.', '', NotiConfig.notifyConfig);
            //     } else {
            //         this.action(form);
            //         this.existLocation = false;
            //     }
            // }, error => {
            //     this.loading = false;
            //     this.existLocation = false;
            // });
            const locationDTO = {
                location: this.inventory.location,
                inventoryLocationId: this.inventory.inventoryLocationId
            };
            this.inventoryService.checkInventoryLocation(locationDTO).subscribe(res => {
                if (res === true) {
                    this.existLocation = true;
                    this.loading = false;
                    window.scrollTo(0, 0);
                    DefaultNotify.notifyDanger('موقعیت مکانی با این مشخصات در انبار موجود میباشد.', '', NotiConfig.notifyConfig);
                } else {
                    this.action(form);
                    //         this.existLocation = false;
                }
            }, error => {
                this.loading = false;
                this.existLocation = false;
            });
        } else {
            this.action(form);
            this.existLocation = false;
        }
        // }
    }


    getAllChargeDepartment() {
        this.chargeDepartmentService.getAllChargeDepartment().subscribe(res => {
            if (res) {
                this.chargeDepartmentList = res;
            }
        });
    }

    getAllBudget() {
        this.budgetService.getAllBudget().subscribe(res => {
            if (res) {
                this.budgetList = res;
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

    // getListSelf(options?: any) {
    //   this.partService.getAllPart({
    //     paging: 0,
    //     totalElements: 10,
    //     term: ''
    //   }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.Create>) => {
    //     this.partsList.itemPage = res;
    //   });
    // }


    openModal() {
        ModalUtil.showModal(this.modalId, true);
    }

    deleteInventory() {
        this.inventory = new PartDto.CreateInventory();
    }

    newCurrentQuantity: number;

    changeNewCurrentQuantity() {
        if (this.newCurrentQuantity) {
            const n = this.newCurrentQuantity;
            if (+this.inventory.currentQuantity + (+n) < 0) {
                DefaultNotify.notifyDanger('موجودی در دسترس نمیتواند از 0 کمتر باشد.', '', NotiConfig.notifyConfig);
                return;
            } else {
                this.inventory.currentQuantity = (+this.inventory.currentQuantity + (+n));
                this.newCurrentQuantity = null;

            }
        }
    }

}

export class DtoForAction {
    id: string;
    currentQuantity: number;
    previousQuantity: number;
    minQuantity: number;
    partId: string;
    chargeDepartmentId: string;
    budgetId: string;
    corridor: string;
    row: string;
    warehouse: string;
    price: string;
    inventoryCode: string;
    userId: string;
    inventoryLocationId: string;
    orderAmount: string = null;//مقدار سفارش
    location: string; //موقعیت در انبار
    receiptNumber: string; //شماره رسید

}
