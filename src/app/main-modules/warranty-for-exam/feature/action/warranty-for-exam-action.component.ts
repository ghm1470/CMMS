import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {WarrantyType} from '../../../part/warranty/model/warranty-type-enum';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {Location} from '@angular/common';
import {WarrantyService} from '../../../part/warranty/endpoint/warranty.service';
import {UnitOfMeasurementService} from '../../../part/endpoint/unit-of-measurement.service';
import {ActivatedRoute} from '@angular/router';
import {CacheService} from '../../../formBuilder/shared/cache-service/cache.service';
import {CompanyService} from '../../../company/endpoint/company.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../../part/model/dto/part';
import Warranty = PartDto.Warranty;
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
declare var $: any;
@Component({
  selector: 'app-warranty-for-exam-action',
  templateUrl: './warranty-for-exam-action.component.html',
  styleUrls: ['./warranty-for-exam-action.component.scss']
})
export class WarrantyForExamActionComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  doSave = false;
  @Input() mode;
  actionMode = ActionMode;
  warrantyType = WarrantyType;
  @Input() assetId: string;
  warranty = new Warranty();
  warrantyCopy = new Warranty();
  @Input() warrantyId: string;
  @Input() receiveWarrantyForEdit: Warranty;
  @Output() messageEvent = new EventEmitter<Warranty>();
  myPattern = MyPattern;
  myMoment = Moment;
  time: any;
  expiry: any;
  warrantyTypeList: any [] = [];
  companyList: CompanyDto.Create[] = [];
  uniteOfMeasurementList: UnitOfMeasurement[] = [];
  companyUId;
  uniteOfMeasurementUId: string;

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
    this.getAllCompany();
    this.getAllUniteOfMeasurement();
  }

  ngOnChanges() {
    this.warranty = new Warranty();
    this.companyUId = '';
    this.uniteOfMeasurementUId = '';
    if (this.mode === ActionMode.EDIT) {
      if (!isNullOrUndefined(this.warrantyId)) {
        this.getOne();
      }
    }
  }

  getOne() {
    this.warranty = this.receiveWarrantyForEdit;
    this.warrantyCopy = JSON.parse(JSON.stringify(this.receiveWarrantyForEdit));
    if (!isNullOrUndefined(this.warranty.time)) {
      const t = new Date(this.receiveWarrantyForEdit.time);
      this.time = (Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(t.toISOString())));
    }
    if (!isNullOrUndefined(this.warranty.expiry)) {
      const e = new Date(this.receiveWarrantyForEdit.expiry);
      this.expiry = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(e.toISOString()));
    }
    this.setDateSetting();
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

  action(form) {
    this.doSave = true;
    if (form.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.warranty.type === WarrantyType[WarrantyType.TIME.toString()] &&
      isNullOrUndefined(this.warranty.time) && isNullOrUndefined(this.warranty.expiry)) {
      DefaultNotify.notifyDanger('وارد کردن تاریخ شروع و پایان الزامیست.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.warranty.expiry < this.warranty.time) {
      DefaultNotify.notifyDanger('تاریخ پایان گارانتی نمی تواند قبل از تاریخ شروع آن باشد.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.mode === ActionMode.ADD) {
      // this.warranty.partId = this.assetId;
      const indexCompany = this.companyList.findIndex(e => e.id === this.companyUId);
      // if (indexCompany !== -1) {
      //   this.warranty.warrantyCompany = this.companyList[indexCompany];
      // }
      this.warrantyService.create(this.warranty)
        .pipe(takeUntilDestroyed(this)).subscribe(res => {
        if (res) {
          DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
          this.messageEvent.emit(JSON.parse(JSON.stringify(this.warranty)));
          form.reset();
          this.doSave = false;
          this.cancelModal();
        }
      });
    } else if (this.mode === ActionMode.EDIT) {
      if (JSON.stringify(this.warrantyCopy) === JSON.stringify(this.warranty)) {
        // this.loading = false;
        DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
      } else {
        this.warrantyService.update(this.warranty)
          .pipe(takeUntilDestroyed(this)).subscribe(res => {
          if (res) {
            DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            this.messageEvent.emit(JSON.parse(JSON.stringify(this.warranty)));
            form.reset();
            this.doSave = false;
            this.cancelModal();
          }
        });
      }
    }
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }


  ngAfterViewInit(): void {
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
}








