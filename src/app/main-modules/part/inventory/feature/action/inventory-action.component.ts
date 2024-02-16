import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {PartDto} from '../../../model/dto/part';
import {Budget} from '../../../../basicInformation/budget/model/dto/budget';
import {ChargeDepartment} from '../../../../basicInformation/chargeDepartment/model/charge-department';
import {InventoryService} from '../../../endpoint/inventory.service';
import {Router} from '@angular/router';
import {BudgetService} from '../../../endpoint/budget.service';
import {ChargeDepartmentService} from '../../../endpoint/charge-department.service';
import {StorageService} from '../../../../storage/endpoint/storage.service';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {ModalUtil} from '@angular-boot/widgets';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {InventoryDTO} from '../../model/inventory';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";
// import {number} from '@angular-boot/validation/lib/nb-validation/validators/number/validator';

declare var $: any;

@Component({
    selector: 'app-inventory-action',
    templateUrl: './inventory-action.component.html',
    styleUrls: ['./inventory-action.component.scss']
})
export class InventoryActionComponent implements OnInit, OnDestroy, OnChanges {
    @Input() mode;
    @Input() showModal;
    @Input() inventoryId: string;
    @Input() partId: string;
    @Input() partName: string;
    @Input() partCode: string;
    @Input() variableToReadGetOn: number;
    @Output() messageEvent = new EventEmitter<InventoryDTO.GetAll>();
    @Output() closeModal = new EventEmitter<boolean>();
    actionMode = ActionMode;
    doSave = false;
    existInventoryCode = true;
    existLocation = false;
    budgetList: Budget[] = [];
    storageList: PartDto.Storage[] = [];
    budget = new Budget();
    user: UserDto.Create;
    sendLocation = new InventoryDTO.CheckLocation();
    chargeDepartment = new ChargeDepartment();
    chargeDepartmentList: ChargeDepartment[] = [];
    inventory = new InventoryDTO.GetOne();
    inventoryToEmit = new InventoryDTO.GetAll();
    inventoryCopy = new InventoryDTO.GetOne();
    inventoryLocation = new PartDto.Storage();
    myPattern = MyPattern;
    disabledButton = false;
    checkInventoryCodeLoading = false;
    readBudget = false;
    readChargeDepartment = false;
    readStorage = false;


    constructor(protected location: Location,
                private inventoryService: InventoryService,
                private chargeDepartmentService: ChargeDepartmentService,
                private budgetService: BudgetService,
                public router: Router,
                private storageService: StorageService,
    ) {
    }

    ngOnInit() {
        // if (this.mode !== ActionMode.VIEW) {
        this.getAllBudget();
        this.getAllChargeDepartment();
        this.getAllStorage();
        // }
    }

    showForm = true;

    ngOnChanges(changes: SimpleChanges): void {
        this.showForm = false;
        setTimeout(e => {
            this.showForm = true;
            this.doSave = false;
        }, 50);
        if (this.mode === this.actionMode.ADD) {
            this.inventory = new InventoryDTO.GetOne();
        } else {
            this.getOne();
        }
        // if (changes.inventoryId) {
        //     this.inventory = new InventoryDTO.GetOne();
        //     if (changes.mode.currentValue === this.actionMode.EDIT) {
        //         if (!isNullOrUndefined(this.inventoryId)) {
        //             this.getOne();
        //         }
        //     }
        //     if (changes.mode.currentValue === this.actionMode.VIEW) {
        //         if (!isNullOrUndefined(this.inventoryId)) {
        //             this.getOne();
        //         }
        //         $('.input-p').attr('disabled', 'disabled');
        //     }
        // }
    }


    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    getOne() {
        if (!this.inventoryId) {
            return;
        }
        if (this.readStorage && this.readChargeDepartment && this.readBudget) {
            this.inventoryService.getOne({inventoryId: this.inventoryId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: InventoryDTO.GetOne) => {
                if (res) {
                    this.inventory = res;
                    if (isNullOrUndefined(this.inventory.orderAmount)) {
                        this.inventory.orderAmount = null;
                    }
                    this.inventoryCopy = JSON.parse(JSON.stringify(res));
                    // =========================================================================
                    this.sendLocation.row = this.inventory.row;
                    this.sendLocation.corridor = this.inventory.corridor;
                    this.sendLocation.warehouse = this.inventory.warehouse;
                    this.sendLocation.inventoryLocationId = this.inventory.inventoryLocationId;
                    this.sendLocation.partId = this.partId;
                    this.sendLocation.location = this.inventory.location;
                    // =========================================================================
                }
            });
            this.existInventoryCode = false;
            // ============================================ تو html به این inventoryLocation نیازه=====================
            // this.inventoryLocation = this.storageList.find(e => e.id === this.inventory.inventoryLocationId);
        } else {
            setTimeout(() => {
                this.getOne();
            }, 50);
        }
    }

    changingInventory() {
        this.inventoryCopy.userId = JSON.parse(sessionStorage.getItem('user')).id;
        this.inventory.userId = this.inventoryCopy.userId;
        this.inventory.partId = this.partId;
        this.inventory.partName = this.partName;
        this.inventory.partCode = this.partCode;
    }

    action(form) {
        if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.inventoryCopy) === JSON.stringify(this.inventory)) {
                // this.loading = false;
                this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                return;
            }
        }

        this.inventory.currentQuantity = Toolkit2.Common.Fa2En(this.inventory.currentQuantity);
        this.inventory.minQuantity = Toolkit2.Common.Fa2En(this.inventory.minQuantity);
        this.inventory.inventoryCode = Toolkit2.Common.Fa2En(this.inventory.inventoryCode);
        this.inventory.row = Toolkit2.Common.Fa2En(this.inventory.row);
        this.inventory.corridor = Toolkit2.Common.Fa2En(this.inventory.corridor);
        this.inventory.location = Toolkit2.Common.Fa2En(this.inventory.location);
        this.inventory.orderAmount = Toolkit2.Common.Fa2En(this.inventory.orderAmount);
        this.inventory.receiptNumber = Toolkit2.Common.Fa2En(this.inventory.receiptNumber);
        // this.inventory.id = null;
        /////////////////////////////
        this.sendLocation = new InventoryDTO.CheckLocation();
        if (this.mode === ActionMode.ADD) {
            this.changingInventory();
            this.disabledButton = true;
            this.inventory.partCode = null;
            this.inventory.partName = null;
            this.inventoryService.createInventory(this.inventory)
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.disabledButton = false;
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    // this.inventory.inventoryId = res;
                    // ===============================================================
                    this.emitInventoryToEmit(res, form);


                }
            }, error => {
                this.loading = false;
            });
            // ==============================================================>Edit
        } else if (this.mode === ActionMode.EDIT) {

            this.changingInventory();
            // this.inventory.inventoryId = new PartDto.CreateInventory().id;
            this.inventory.previousQuantity = +this.inventoryCopy.currentQuantity;
            this.disabledButton = true;
            this.inventory.partCode = null;
            this.inventory.partName = null;
            this.inventoryService.createInventory(this.inventory)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    this.disabledButton = false;
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    // this.inventory.inventoryId = res.id;
                    // ===============================================================
                    this.emitInventoryToEmit(res, form);
                }
            }, error => {
                this.loading = false;
            });


        }

    }

    emitInventoryToEmit(res, form) {
        this.inventoryToEmit.inventoryLocationName = res.locationName;
        this.inventoryToEmit.inventoryId = res.inventoryId;
        this.inventoryToEmit.corridor = this.inventory.corridor;
        this.inventoryToEmit.row = this.inventory.row;
        this.inventoryToEmit.warehouse = this.inventory.warehouse;
        this.inventoryToEmit.currentQuantity = this.inventory.currentQuantity;
        this.inventoryToEmit.minQuantity = this.inventory.minQuantity;
        this.inventoryToEmit.previousQuantity = this.inventory.previousQuantity;
        this.inventoryToEmit.inventoryCode = this.inventory.inventoryCode;
        this.inventoryToEmit.orderAmount = this.inventory.orderAmount;
        this.inventoryToEmit.location = this.inventory.location;
        this.inventoryToEmit.receiptNumber = this.inventory.receiptNumber;
        // =================================================================
        this.messageEvent.emit(JSON.parse(JSON.stringify(this.inventoryToEmit)));
        this.doSave = false;
        form.reset();
        this.cancelModal();
    }

    checkInventoryCode(form) {
        if (this.inventory.inventoryCode && this.inventoryCopy.inventoryCode !== this.inventory.inventoryCode) {
            this.checkInventoryCodeLoading = true;
            this.loading = true;
            this.inventoryService.checkInventoryCode({inventoryCode: this.inventory.inventoryCode}).subscribe((res: boolean) => {
                this.checkInventoryCodeLoading = false;
                this.loading = false;
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
            this.loading = false;
            this.checkStorage(form);

        }

    }

    loading = false;

    checkStorage(form) {
        if (this.loading) {
            return;
        }

        this.sendLocation.row = this.inventory.row;
        this.sendLocation.corridor = this.inventory.corridor;
        this.sendLocation.warehouse = this.inventory.warehouse;
        this.sendLocation.inventoryLocationId = this.inventory.inventoryLocationId;
        this.sendLocation.partId = this.partId;
        this.sendLocation.location = this.inventory.location;
        this.sendLocation.receiptNumber = this.inventory.receiptNumber;

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
            // this.action(form);
            //         this.existLocation = false;
            //     }
            // }, error => {
            //     this.loading = false;
            //     this.existLocation = false;
            // });
            //
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
                this.readChargeDepartment = true;
            }
        });
    }

    getAllBudget() {
        this.budgetService.getAllBudget().subscribe(res => {
            if (res) {
                this.budgetList = res;
                this.readBudget = true;
            }
        });
    }

    getAllStorage() {
        this.storageService.getAll().subscribe(res => {
            if (res) {
                this.storageList = res;
                this.readStorage = true;
            }
        });
    }

    cancelModal() {
        /////////////////////////////
        this.sendLocation = new InventoryDTO.CheckLocation();
        this.closeModal.emit(true);
        // $('#forms')[0].reset();
        // this.inventory = new PartDto.CreateInventory();
        this.existLocation = false;

        this.newCurrentQuantity = null;
        ModalUtil.hideModal('inventoryModal');

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
