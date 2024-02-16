import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output, SimpleChanges
} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../../../../part/model/dto/part';

import {WarrantyService} from '../../endpoint/warranty.service';
import {CacheService} from '../../../../formBuilder/shared/cache-service/cache.service';
import {CompanyDto} from '../../../../company/model/dto/companyDto';
import {CompanyService} from '../../../../company/endpoint/company.service';
import {WarrantyType} from '../../model/warranty-type-enum';
import {UnitOfMeasurement} from '../../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {UnitOfMeasurementService} from '../../../endpoint/unit-of-measurement.service';
import {ModalUtil} from '@angular-boot/widgets';
import Warranty = PartDto.Warranty;
import {WorkOrderDto} from '../../../../workOrder/model/dto/workOrderDto';
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";


declare var $: any;

@Component({
    selector: 'app-warranty-action',
    templateUrl: './warranty-action.component.html',
    styleUrls: ['./warranty-action.component.scss']
})
export class WarrantyActionComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() mode;
    @Input() type;
    @Input() partId: string;
    @Input() assetId: string;
    @Input() warrantyId: string;
    @Input() variableToReadGetOn: number;
    @Output() messageEvent = new EventEmitter<Warranty>();
    doSave = false;
    actionMode = ActionMode;
    warrantyType = WarrantyType;
    warranty = new Warranty();
    warrantyCopy = new Warranty();
    myPattern = MyPattern;
    myMoment = Moment;
    time: any;
    expiry: any;
    warrantyTypeList: any [] = [];
    companyList: CompanyDto.Create[] = [];
    uniteOfMeasurementList: UnitOfMeasurement[] = [];
    companyUId;
    disabledButton = false;
    uniteOfMeasurementUId: string;
    warrantyCodeExists = true;
    warrantyCodeExistsLoading = false;

    constructor(
        public location: Location,
        public warrantyService: WarrantyService,
        public unitOfMeasurementService: UnitOfMeasurementService,
        private activatedRoute: ActivatedRoute,
        private cacheService: CacheService,
        private companyService: CompanyService,
        public cdr: ChangeDetectorRef
    ) {
        this.warrantyTypeList = EnumHandle.getAsValueTitleList(WarrantyType);
    }

    ngOnInit() {
        if (this.mode !== ActionMode.VIEW) {
            this.getAllCompany();
            this.getAllUniteOfMeasurement();
        }
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.variableToReadGetOn) {
            this.companyUId = '-1';
            this.uniteOfMeasurementUId = '-1';
            this.warranty = new Warranty();
            if (this.mode !== ActionMode.ADD) {
                if (!isNullOrUndefined(this.warrantyId)) {
                    this.getOne();
                }
            }
        }
    }

    getOne() {
        this.warrantyService.getOne({warrantyId: this.warrantyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: Warranty) => {
            if (res) {
                this.warranty = res;
                this.warrantyCopy = JSON.parse(JSON.stringify(res));
                if (!isNullOrUndefined(this.warranty.time)) {
                    const t = new Date(this.warranty.time);
                    this.time = (Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(t.toISOString())));
                }
                this.warrantyCodeExists = false;
                if (!isNullOrUndefined(this.warranty.expiry)) {
                    const e = new Date(this.warranty.expiry);
                    this.expiry = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(e.toISOString()));
                }
                this.setDateSetting();
            }
        });
    }

    getAllUniteOfMeasurement() {
        this.unitOfMeasurementService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res) => {
                if (res && res.length) {
                    this.uniteOfMeasurementList = res;
                }
            });
    }

    getAllCompany() {
        this.companyService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res) => {
                if (res && res.length) {
                    this.companyList = res;
                }
            });
    }

    loading = false;

    action(form) {

        if (this.type === 'part') {
            if (this.partId) {
                this.warranty.partId = this.partId;
                this.warranty.assetId = null;
            }
        }
        if (this.type === 'asset') {
            if (this.assetId) {
                this.warranty.assetId = this.assetId;
                this.warranty.partId = null;
            }
        }
        if (this.warrantyCodeExists === false) {
            this.loading = true;

            if (this.mode === ActionMode.ADD) {
                this.warrantyService.create(this.warranty)
                    .pipe(takeUntilDestroyed(this)).subscribe((res: Warranty) => {
                    this.loading = false;
                    if (res) {
                        DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                        this.messageEvent.emit(JSON.parse(JSON.stringify(res)));
                        this.companyUId = '-1';
                        this.uniteOfMeasurementUId = '-1';
                        form.reset();
                        this.doSave = false;
                        this.cancelModal();
                    }
                }, error => {
                    this.loading = false;

                });
            } else if (this.mode === ActionMode.EDIT) {
                if (JSON.stringify(this.warrantyCopy) === JSON.stringify(this.warranty)) {
                    this.loading = false;
                    DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                } else {
                    this.warranty.companyName = this.companyList.find(c => c.id === this.warranty.companyId).name;
                    this.warranty.unitOfMeasurementName = this.uniteOfMeasurementList.find(u => u.id === this.warranty.unitOfMeasurementId).title;
                    this.warrantyService.update(this.warranty)
                        .pipe(takeUntilDestroyed(this)).subscribe(res => {
                        this.loading = false;

                        if (res) {
                            DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                            this.messageEvent.emit(JSON.parse(JSON.stringify(this.warranty)));
                            form.reset();
                            this.doSave = false;
                            this.cancelModal();
                        }
                    }, error => {
                        this.loading = false;
                    });
                }
            }
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }


    ngAfterViewInit(): void {
        if (this.mode !== ActionMode.VIEW) {
            const mthis = this;
            $('#expiryTime').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector:$( '#expiryTime'),
                disableBeforeToday: false
            }).on('change', (e) => {
                try {
                    mthis.warranty.expiry =
                        mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                } catch (e) {
                    DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                }
            });
            $('#startWarrantyTime').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#startWarrantyTime'),
                disableBeforeToday: false
            }).on('change', (e) => {
                try {
                    mthis.warranty.time =
                        mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                } catch (e) {
                    DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                }
            });

        }
        // ==========================================================
        // if (this.mode === ActionMode.VIEW) {
        //   if (!isNullOrUndefined(this.warrantyId)) {
        //     this.getOne();
        //     $('.input-p').attr('disabled', 'disabled');
        //   }
        // }


    }

    setDateSetting() {
        const mthis = this;
        setTimeout(() => {
            $('#time').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#time'),
            }).on('change', (e) => {
                mthis.time = $(e.currentTarget).val();
                mthis.warranty.time =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                mthis.cdr.detectChanges();
                mthis.checkDateFunction();
            });
            $('#expiry').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                // disableBeforeDate: this.warranty.time,
                ToDate: true, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#expiry'),
            }).on('change', (e) => {
                mthis.expiry = $(e.currentTarget).val();
                mthis.warranty.expiry =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                mthis.cdr.detectChanges();
                mthis.checkDateFunction();
            });
        }, 200);

    }

    checkDateFunction() {
        if (!isNullOrUndefined(this.warranty.time) && !isNullOrUndefined(this.warranty.expiry)) {
            if (this.warranty.expiry > this.warranty.time) {
                $('#time').addClass('is-valid');
                $('#time').removeClass('is-invalid');
                $('#expiry').addClass('is-valid');
                $('#expiry').removeClass('is-invalid');
            } else {
                $('#time').addClass('is-invalid');
                $('#time').removeClass('is-valid');
                $('#expiry').addClass('is-invalid');
                $('#expiry').removeClass('is-valid');
            }
        }
    }

    changeWarrantyType(event) {
        if (event.target.value === this.warrantyType[this.warrantyType.METERING.toString()]) {
            this.warranty.expiry = null;
            this.warranty.time = null;
            this.expiry = null;
            this.time = null;
        }
        if (this.warranty.type === this.warrantyType[this.warrantyType.TIME.toString()]) {
            this.warranty.kilometerWarranty = null;
            this.warranty.unitOfMeasurementId = null;

        }
        this.setDateSetting();
    }

    cancelModal() {
        $('#formsSSWarranty')[0].reset();
        this.warranty = new Warranty();
        ModalUtil.hideModal('warrantyModal');
    }

    existCode(form) {

        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (
            !isNullOrUndefined(this.warranty.time) && !isNullOrUndefined(this.warranty.expiry)) {
            if (this.warranty.expiry < this.warranty.time) {
                DefaultNotify.notifyDanger('تاریخ پایان گارانتی نمی تواند قبل از تاریخ شروع آن باشد.', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (this.warranty.kilometerWarranty) {
            this.warranty.kilometerWarranty = Toolkit2.Common.Fa2En(this.warranty.kilometerWarranty);
        }

        if (this.warranty.warrantyCode === this.warrantyCopy.warrantyCode) {
            this.action(form);
        } else {

            this.warrantyCodeExists = true;
            this.warrantyCodeExistsLoading = true;
            this.warrantyService.checkWarrantyCode({code: this.warranty.warrantyCode})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.warrantyCodeExistsLoading = false;
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    this.warrantyCodeExists = true;

                    if (isNullOrUndefined(this.warrantyId)) {
                        this.warranty.warrantyCode = '';
                    } else {
                        this.warranty.warrantyCode = this.warrantyCopy.warrantyCode;
                    }
                } else {
                    this.warrantyCodeExists = false;
                    this.action(form);
                }
            });
        }
    }


}








