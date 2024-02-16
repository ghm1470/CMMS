import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {Reading} from '../../model/reading';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {Asset} from '../../../asset/feature/tree-action/tree-action.component';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {UnitOfMeasurementService} from '../../../part/endpoint/unit-of-measurement.service';
import {ModalUtil} from '@angular-boot/widgets';
import {Location} from '@angular/common';
import {MeteringService} from '../../../part/endpoint/metering.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-reading-action',
    templateUrl: './reading-action.component.html',
    styleUrls: ['./reading-action.component.scss']
})
export class ReadingActionComponent implements OnInit, OnDestroy {
    // @Input() mode: ActionMode;
    // @Input() readingId: string;
    show = false;
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    MyModalSize = ModalSize;
    reading = new Reading.Create();
    asset = new AssetDto.CreateAsset();
    parentAssetB = new Asset();
    myPattern = MyPattern;
    doSave = false;
    hasUnitList = false;
    disabledButton = false;
    unitOfMeasurementList: UnitOfMeasurement[] = [];
    user;
    max;
    selectedUnitOfMeasurementId: string;

    constructor(public location: Location,
                private meteringService: MeteringService,
                private  assetService: AssetService) {
    }

    ngOnInit() {
        const parentAssetB = sessionStorage.getItem('selectedAsset');
        if (parentAssetB) {
            this.parentAssetB = JSON.parse(parentAssetB);
            this.getUnitOfMeasurement();
        }
        console.log('this.reading.ngOnInit', this.reading)
        // this.getUnitOfMeasurement();

    }

    loading = false;

    action(form) {
        console.log('this.reading.action', this.reading)

        this.reading.userId = JSON.parse(sessionStorage.getItem('user')).id;
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }

        if (!this.reading.unitOfMeasurement.id) {
            DefaultNotify.notifyDanger('واحد اندازه گیری را انتخاب کنید', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.max > this.reading.amount) {
            DefaultNotify.notifyDanger('کارکرد فعلی باید بزرگتر از ' + this.max + ' باشد', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.mode === ActionMode.ADD) {
            // this.metering.referenceId = this.refId;
            // const index = this.unitOfMeasurementList.findIndex(e => e.id === this.meteringUId);

            // if (index !== -1) {
            //   this.metering.unitOfMeasurement = this.unitOfMeasurementList[index];
            // }
            this.reading.referenceId = this.parentAssetB.id;
            this.loading = true;
            this.meteringService.create(this.reading)
                .pipe(takeUntilDestroyed(this)).subscribe((res: Reading.Create) => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.doSave = false;
                    form.reset();
                    this.cancel();
                    this.reading = new Reading.Create();
                    this.parentAssetB = new Asset();
                }
            }, error => {
                this.loading = false;
            });
        } else if (this.mode === ActionMode.EDIT) {
            // if (JSON.stringify(this.reading) === JSON.stringify(this.meteringCopy) && this.meteringUId === this.meteringUIdCopy) {
            //   DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید');
            // } else {
            //   const index = this.unitOfMeasurementList.findIndex(e => e.id === this.meteringUId);
            //   this.metering.unitOfMeasurement = this.unitOfMeasurementList[index];
            //   this.meteringService.update(this.metering)
            //     .pipe(takeUntilDestroyed(this)).subscribe((res: Metering) => {
            //     if (res) {
            //       DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
            //       this.messageEvent.emit(JSON.parse(JSON.stringify(this.metering)));
            //       form.reset();
            //       this.doSave = false;
            //       this.cancelModal();
            //     }
            //   });
            // }
        }
    }

    receiveParentAsset(event: Asset) {
        this.parentAssetB = new Asset();
        this.parentAssetB = event;
        sessionStorage.setItem('selectedAsset', JSON.stringify(this.parentAssetB));

        this.getUnitOfMeasurement();
        // this.asset.isPartOfAsset = event.id;
    }

    openModal() {
        this.show = !this.show;
        ModalUtil.showModal('ViewAsset');
    }

    getUnitOfMeasurement() {
        // this.unitOfMeasurementService.getAll().pipe(takeUntilDestroyed(this))
        //   .subscribe( (res: UnitOfMeasurement[]) => {
        //
        //     if (res && res.length) {
        //       this.unitOfMeasurementList = res;
        //       console.log('unitOfMeasurementList', this.unitOfMeasurementList);
        //     }
        //   });
        this.assetService.getUnitListOfAsset({assetId: this.parentAssetB.id})
            .pipe(takeUntilDestroyed(this)).subscribe((res: UnitOfMeasurement[]) => {
            if (res && res.length > 0) {
                this.unitOfMeasurementList = res;
                this.hasUnitList = true;
            }
        });
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    deleteSelectedAsset() {
        this.parentAssetB = new Asset();
    }

    getMax() {
        this.max = null;
        if (this.selectedUnitOfMeasurementId) {
            this.reading.unitOfMeasurement = this.unitOfMeasurementList.find(e => e.id === this.selectedUnitOfMeasurementId);
            if (!isNullOrUndefined(this.reading.unitOfMeasurement)) {
                if (!isNullOrUndefined(this.reading.unitOfMeasurement.id)) {
                    this.meteringService.getMaxMetring({
                        unitOfMeasurementId: this.reading.unitOfMeasurement.id,
                        assetId: this.parentAssetB.id
                    }).subscribe(res => {
                        this.max = res;
                    });
                }
            }
        }

    }

    checkMax() {
        this.reading.amount = Toolkit2.Common.Fa2En(this.reading.amount);
        if (this.max > this.reading.amount) {
            // DefaultNotify.notifyDanger('کارکرد فعلی باید بزرگتر از ' + this.max + ' باشد');
        }
    }
}
