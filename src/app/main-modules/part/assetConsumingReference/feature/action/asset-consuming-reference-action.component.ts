import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {Budget} from '../../../../basicInformation/budget/model/dto/budget';
import {Location} from '@angular/common';
import {isNullOrUndefined, log} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetConsumingReferenceService} from '../../../endpoint/asset-consuming-reference.service';
import {AssetConsumringReference} from '../../model/asset-consumring-reference';
import {ModalUtil} from '@angular-boot/widgets';
import {AssetDto} from '../../../../asset/model/dto/assetDto';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {PartDto} from '../../../model/dto/part';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-asset-consuming-reference-action',
    templateUrl: './asset-consuming-reference-action.component.html',
    styleUrls: ['./asset-consuming-reference-action.component.scss']
})
export class AssetConsumingReferenceActionComponent implements OnInit, OnDestroy, OnChanges {
    @Input() mode;
    @Input() ACRId: string;
    @Input() partId: string;
    @Input() type: string;
    @Input() autoplay: boolean;
    @Input() receiveInventoryForEdit: any; // PartDto.GetAll
    @Input() assetConsumingReferenceList: any[] = []; // PartDto.GetAll
    @Output() messageEvent = new EventEmitter<PartDto.CreateInventory>();

    actionMode = ActionMode;
    doSave = false;
    myPattern = MyPattern;
    budget = new Budget();
    ACR = new AssetConsumringReference();
    ACRCopy = new AssetConsumringReference();
    disabledButton = false;
    showAssetListModal = false;

    constructor(public location: Location,
                private assetConsumingReferenceService: AssetConsumingReferenceService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.ACR = new AssetConsumringReference();
        if (this.mode === ActionMode.ADD && this.type !== 'getPage') {
            this.openModal();
        }
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.ACRId)) {
                this.getOne();
            }
        }

    }


    ngOnDestroy(): void {
    }


    getOne() {
        this.ACR = this.receiveInventoryForEdit;
        this.ACRCopy = JSON.parse(JSON.stringify(this.receiveInventoryForEdit));
    }

    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.ACR.quantity) {
            DefaultNotify.notifyDanger('موجودی را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        } else {
            this.ACR.quantity = Toolkit2.Common.Fa2En(this.ACR.quantity);
        }
        if (this.mode === ActionMode.ADD) {
            this.ACR.partId = this.partId;
            this.assetConsumingReferenceService.createACR(this.ACR)
                .pipe(takeUntilDestroyed(this)).subscribe((res: AssetConsumringReference) => {
                if (res && res.id) {
                    this.ACR.id = res.id;
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.messageEvent.emit(JSON.parse(JSON.stringify(this.ACR)));
                    form.reset();
                    this.doSave = false;
                    this.cancelModal(form);

                } else {
                    DefaultNotify.notifyDanger('این دارایی قبلا ثبت شده است.', '', NotiConfig.notifyConfig);
                }
            });
            // ==============================================================>Edit
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.ACRCopy) === JSON.stringify(this.ACR)) {
                // this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            } else {
                this.assetConsumingReferenceService.updateACR(this.ACR)
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.messageEvent.emit(JSON.parse(JSON.stringify(this.ACR)));
                        form.reset();
                        this.cancelModal(form);

                    }
                });

            }
        }

    }

    openModal() {
        // مودال درختی
        this.showAssetListModal = true;
        setTimeout(() => {
            ModalUtil.showModal('AssetConsumingReferenceViewModal');
        }, 50);
    }

    cancelModal(form) {
        // مودال افزودن
        ModalUtil.hideModal('AssetConsumingReferenceModal');
        this.ACR = new AssetConsumringReference();
        form.reset();
    }


    receiveMessage(event: AssetDto.GetAllByFilterAndPagination) {
        console.log('receiveMessageEvent', event);
        this.ACR.assetName = event.name;
        this.ACR.assetCode = event.code;
        // این شرط باید در مکان مناسب قرار بگیرد=======================
        if (this.assetConsumingReferenceList.length > 0) {
            for (const item of this.assetConsumingReferenceList) {
                if (item.assetName === this.ACR.assetName && item.assetCode === this.ACR.assetCode) {
                    this.ACR.assetName = null;
                    this.ACR.assetCode = null;
                    DefaultNotify.notifyDanger('این مرجع مصرف دارایی قبلا ثبت شده است , کافیست موجودی آن را تغییر دهید. ', '', NotiConfig.notifyConfig);
                    return;
                }
            }
        }
    }


    deleteACR() {
        this.ACR = new AssetConsumringReference();
    }
}
