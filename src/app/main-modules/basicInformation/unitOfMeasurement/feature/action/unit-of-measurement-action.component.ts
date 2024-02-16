import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UnitOfMeasurement} from '../../model/dto/unitOfMeasurement';
import {UnitOfMeasurementService} from '../../endpoint/unit-of-measurement.service';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-unit-of-measurement-action',
    templateUrl: './unit-of-measurement-action.component.html',
    styleUrls: ['./unit-of-measurement-action.component.scss']
})
export class UnitOfMeasurementActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    unitOfMeasurement = new UnitOfMeasurement();
    unitOfMeasurementCopy = new UnitOfMeasurement();
    unitOfMeasurementId: string;
    myPattern = MyPattern;
    doSave = false;
    disabledButton = false;

    constructor(
        public location: Location,
        public unitOfMeasurementService: UnitOfMeasurementService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.unitOfMeasurementId = this.activatedRoute.snapshot.queryParams.unitOfMeasurementId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.unitOfMeasurementId)) {
                this.getOne();
            }
        }
    }

    getOne() {
        this.unitOfMeasurementService.getOne({unitOfMeasurementId: this.unitOfMeasurementId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: UnitOfMeasurement) => {
            if (res) {
                this.unitOfMeasurement = res;
                this.unitOfMeasurementCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    loading = false;

    checkIfUnitAndTitleExist(form) {
        if (this.loading === true) {
            return;
        }
        if (JSON.stringify(this.unitOfMeasurement) === JSON.stringify(this.unitOfMeasurementCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.disabledButton = true;
        this.doSave = true;
        this.loading = true;
        console.log('this.unitOfMeasurement', this.unitOfMeasurement);
        this.unitOfMeasurement.unit ? this.unitOfMeasurement.unit = this.unitOfMeasurement.unit.trim() : '';
        this.unitOfMeasurement.title ? this.unitOfMeasurement.title = this.unitOfMeasurement.title.trim() : '';
        if (!this.unitOfMeasurement.unit || !this.unitOfMeasurement.title) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;
            return;
        }
        const dto = {
            unit: this.unitOfMeasurement.unit,
            title: this.unitOfMeasurement.title
        };

        //TODO
        // چک شود سرویس از سمت سرور درست باشد
        this.unitOfMeasurementService.checkIfUnitAndTitleExist(dto).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('آیتمی با این عنوان و واحد موجود میباشد.', '', NotiConfig.notifyConfig);
                this.loading = false;
                this.disabledButton = false;
                return;
            } else {
                this.action(form);
            }
        }, error => {
            this.loading = false;
            this.disabledButton = false;

        });
    }

    action(form) {


        if (this.mode === ActionMode.ADD) {
            this.unitOfMeasurementService.create(this.unitOfMeasurement)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;
                this.disabledButton = false;
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.unitOfMeasurementCopy) === JSON.stringify(this.unitOfMeasurement)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.disabledButton = false;
                this.loading = false;
                return;
            } else {
                this.unitOfMeasurementService.update(this.unitOfMeasurement, {unitOfMeasurementId: this.unitOfMeasurementId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    console.log('update', res);
                    this.loading = false;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    this.loading = false;
                    this.disabledButton = false;
                });
            }
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    stringLength(value, id) {
        console.log('value', value)
        console.log('id', id)
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid').removeClass('is-valid');
                $('#form').addClass('ng-invalid').removeClass('ng-valid');
                this.disabledButton = true;
                console.log('1', this.disabledButton)

                return false;
            } else {

                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#form').addClass('ng-valid').removeClass('ng-invalid');
                this.disabledButton = false;
                console.log('2', this.disabledButton)

                return true;

            }
        } else if (isNullOrUndefined(value)) {

            $('#' + id).addClass('is-invalid').removeClass('is-valid');
            $('#form').addClass('ng-invalid').removeClass('ng-valid');
            this.disabledButton = true;
            console.log('3', this.disabledButton)

            // return false;
            return true;
        }
    }

}
