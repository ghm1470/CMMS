/**
 * Created by Zar on 5/25/2017.
 */
import {Component, Input, Output, EventEmitter, Renderer2, OnInit, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {Date} from '../../../../../fb-model/element/date';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {Toolkit} from '../../../../../shared/utility/toolkit';
import {FindLanguageFromKeyPipe} from '../../../../../shared/language-data-service/find-language-from-key.pipe';
import {isNullOrUndefined} from 'util';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import * as moment from 'jalali-moment';
import {Toolkit2} from "@angular-boot/util";

declare var $: any;

@Component({
  selector: 'DateEdit',
  templateUrl: './dateEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class DateEditComponent implements OnInit , AfterViewInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  dateForm: FormGroup;
  date = new Date();
  start: string; // تاریخ ابتدای از قبل وارد شده که به صورت رشته نمایش داده می شود.
  end: string; // تاریخ انتهای از قبل وارد شده که به صورت رشته نمایش داده می شود.
  form = new Form();
  data: any = null;
  selectedLanguage: string;
  isRtl = true;
  saveButton = false;
  dateError = '';
  MyImageStatus = ImageStatus;
  startNotValid = false;
  endNotValid = false;
  nowBiggerThanStart = false;
  nowBiggerThanEnd = false;
  startBiggerThanEnd = false;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2,
              private findLanguageFromKeyPipe: FindLanguageFromKeyPipe) {
    this.dateForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      id: false,
      required: false,
      startRTL: false,
      endRTL: false,
      startMiladi: false,
      endMiladi: false,
    });
    languageDataService.renderer = renderer;
  }


  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
    this.date = JSON.parse(JSON.stringify(this.editingItem.item));
    this.languageDataService.getSelectedLanguage().subscribe(res => {
      if (res != null) {
        this.selectedLanguage = res;
        this.isRtl = this.findLanguageFromKeyPipe.isRTL(this.selectedLanguage);
      }
      if (isNullOrUndefined(this.date.startDate)) {
        this.start = '';
      } else {
        this.start = Toolkit2.Moment.getJaliliDateFromIsoOrFull(this.date.startDate);
      }
      if (isNullOrUndefined(this.date.endDate)) {
        this.end = '';
      } else {
        this.end = Toolkit2.Moment.getJaliliDateFromIsoOrFull(this.date.endDate);
      }
    });
  }

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('#startDate').azPersianDateTimePicker({
        Placement: 'left',
        Trigger: 'click',
        EnableTimePicker: false,
        TargetSelector: '#startDate',
        GroupId: '',
        ToDate: false,
        FromDate: false,
        DisableBeforeToday: true,
        Disabled: false,
        Format: 'yyyy/MM/dd',
        IsGregorian: false
      });
    });
    $(document).ready(function () {
      $('#endDate').azPersianDateTimePicker({
        Placement: 'left',
        Trigger: 'click',
        EnableTimePicker: false,
        TargetSelector: '#endDate',
        GroupId: '',
        ToDate: false,
        FromDate: false,
        DisableBeforeToday: true,
        Disabled: false,
        Format: 'yyyy/MM/dd',
        IsGregorian: false
      });
    });

    $(document).ready(function () {
      $('#MstartDate').azPersianDateTimePicker({
        Placement: 'left',
        Trigger: 'click',
        EnableTimePicker: false,
        TargetSelector: '#MstartDate',
        GroupId: '',
        ToDate: false,
        FromDate: false,
        DisableBeforeToday: true,
        Disabled: false,
        Format: 'yyyy/MM/dd',
        IsGregorian: true
      });
    });
    $(document).ready(function () {
      $('#MendDate').azPersianDateTimePicker({
        Placement: 'left',
        Trigger: 'click',
        EnableTimePicker: false,
        TargetSelector: '#MendDate',
        GroupId: '',
        ToDate: false,
        FromDate: false,
        DisableBeforeToday: true,
        Disabled: false,
        Format: 'yyyy/MM/dd',
        IsGregorian: true
      });
    });
  }

  onChangeStartDate(value) {
    this.start = value;
    this.checkStartDateEndDate(this.start, this.end);
  }

  onChangeEndDate(value) {
    this.end = value;
    this.checkStartDateEndDate(this.start, this.end);
  }

  checkStartDateEndDate(startDate, endDate) {
    let result: boolean [] = [];
    if (!isNullOrUndefined(startDate) || !isNullOrUndefined(endDate)) {
      result = Toolkit.compareMomentDate(startDate + '-00:00', endDate + '-00:00');
      console.log(result);
      this.startNotValid = result[0];
      this.endNotValid = result[1];
      this.nowBiggerThanStart = result[2];
      this.nowBiggerThanEnd = result[3];
      this.startBiggerThanEnd = result[4];
    }
    console.log(this.startNotValid);
    console.log(this.endNotValid);
    console.log(this.nowBiggerThanStart);
    console.log(this.nowBiggerThanEnd);
    console.log(this.startBiggerThanEnd);
  }

  save() {
    this.saveButton = true;
    if (this.date.label !== '' && this.dateError === ''
    && !this.startNotValid && !this.endNotValid && !this.startBiggerThanEnd && !this.nowBiggerThanStart && !this.nowBiggerThanEnd) {
      const s = moment(Toolkit.Fa2En(this.start + '-00:00'), 'jYYYY/jMM/jDD-HH:mm');
      const e = moment(Toolkit.Fa2En(this.end + '-00:00'), 'jYYYY/jMM/jDD-HH:mm');
      this.date.startDate = s.toISOString();
      this.date.endDate = e.toISOString();
      this.form.elementList[this.editingItem.index] = this.date;
      this.saveOnStorage();
      this.onUpdate.emit(true);
    }
  }

  close() {
    if (this.editingItem.newElement) {
      this.form.elementList.splice(this.editingItem.index, 1);
      this.saveOnStorage();
      this.onUpdate.emit(true);
    } else if (!this.editingItem.newElement) {
      if (confirm(this.data.publicMessage.deleteMessage)) {
        this.form.elementList[this.editingItem.index] = this.editingItem.item;
        this.saveOnStorage();
        this.onUpdate.emit(true);
      }
    }
  }

  settingQuestionImage(event) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.setPicture(event, this.date.picture).subscribe((res: Image) => {
      if (res != null) {
        this.date.picture = res;
        this.form.elementList[this.editingItem.index] = this.date;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.date.picture).subscribe((res: Image) => {
      if (res != null) {
        this.date.picture = res;
        this.form.elementList[this.editingItem.index] = this.date;
        this.saveOnStorage();
      }
    });
  }

  changeLabel(value) {
    this.date.label = value;
    this.saveOnStorage();
  }

  changeHelpText(value) {
    this.date.helpText = value;
    this.saveOnStorage();
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }

}
