import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../part/model/dto/part';
import {InventoryService} from '../part/endpoint/inventory.service';
import {MyPattern} from '../../shared/shared/tools/myPattern';
import set = Reflect.set;
import {InventoryDTO} from '../part/inventory/model/inventory';
import {NotiConfig} from "../../shared/tools/notifyConfig";


@Component({
    selector: 'app-adjustment-inventory',
    templateUrl: './adjustment-inventory.component.html',
    styleUrls: ['./adjustment-inventory.component.scss']
})
export class AdjustmentInventoryComponent implements OnInit, OnDestroy {
    MyModalSize = ModalSize;
    myPattern = MyPattern;
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.VIEW;
    changesCurrentInventory = new ChangesCurrentInventory();
    showInventory = new ReceiveCurrentInventory();
    showModal = false;
    allowToOpenCollapse = 0;
    disabledButton = false;
    index;
    doSave = false;
    lastEvent = new ChangesCurrentInventory();

    constructor(private inventoryService: InventoryService) {
    }

    ngOnInit() {
    }


    ngOnDestroy(): void {
    }

    receiveMessage(event: PartDto.GetAll) {
        this.showInventory.previousQuantity = event.currentQuantity;
        this.showInventory.minQuantity = event.minQuantity;
        this.showInventory.partCode = '#' + event.partCode;
        this.showInventory.partName = event.partName;
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.changesCurrentInventory.userId = user.id;
        this.changesCurrentInventory.inventoryId = event.inventoryId;
    }

    loading = false;

    action(form) {
        if (this.loading) {
            return;
        }
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.changesCurrentInventory.inventoryId) {
            this.changesCurrentInventory.currentQuantity = this.showInventory.newQuantity;
            this.loading = true;
            this.inventoryService.createInventoryList(this.changesCurrentInventory)
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.loading = false;
                DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                this.lastEvent.inventoryId = this.changesCurrentInventory.inventoryId;
                this.lastEvent.currentQuantity = this.changesCurrentInventory.currentQuantity;
                form.reset();
                this.changesCurrentInventory = new ChangesCurrentInventory();
                this.showInventory = new ReceiveCurrentInventory();
                this.doSave = false;
            }, error => {
                this.loading = false;
            });
        } else {
            DefaultNotify.notifyDanger('شما هیچ درخواستی ندارید', '', NotiConfig.notifyConfig);
        }
    }

    openModal(index) {
        if (this.loading) {
            return;
        }
        this.showModal = true;
        setTimeout(() => {
            this.allowToOpenCollapse = this.allowToOpenCollapse + 1;
            ModalUtil.showModal('current');
        }, 50);
        this.index = index;

    }
}

export class ReceiveCurrentInventory {
    userId: string;
    newQuantity: number;
    previousQuantity: number;
    inventoryId: string;
    partId: string;
    partCode: string;
    partName: string;
    minQuantity: number;

}

export class CreateCurrentInventory {
    userId: string;
    newQuantity: number;
    previousQuantity: number;
    inventoryId: string;
    partId: string;
    partCode: string;
    partName: string;
    inventoryLocationId: string;
    warehouse: string;
    corridor: string;
    row: string;
}

export class ChangesCurrentInventory {
    currentQuantity: number;
    inventoryId: string;
    userId: string;
}
