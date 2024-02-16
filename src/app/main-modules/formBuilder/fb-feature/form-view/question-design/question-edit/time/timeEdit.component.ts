/**
 * Created by Zar on 5/25/2017.
 */
import {Component, Input, Output, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {Time} from '../../../../../fb-model/element/time';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {DefaultNotify} from "@angular-boot/util";
import {NotiConfig} from "../../../../../../../shared/tools/notifyConfig";

@Component({
  selector: 'TimeEdit',
  templateUrl: './timeEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class TimeEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  timeForm: FormGroup;
  time = new Time();
  timeCopy = new Time();
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.timeForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      id: false,
      required: false,
    });
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.time = JSON.parse(JSON.stringify(this.editingItem.item));
    this.timeCopy = JSON.parse(JSON.stringify(this.editingItem.item));
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
  }

  save() {
    this.saveButton = true;
    if (this.editingItem.newElement === true && this.timeCopy.label === this.time.label) {
      DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired, '', NotiConfig.notifyConfig);
      return;

    }  else if (this.time.label !== '') {
      this.form.elementList[this.editingItem.index] = this.time;
      this.saveOnStorage();
      this.onUpdate.emit(true);
    }
  }

  close() {
    if (this.editingItem.newElement) {
      this.form.elementList.splice(this.editingItem.index, 1);
      this.saveOnStorage();
      this.onUpdate.emit(null);
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
    setPicture.setPicture(event, this.time.picture).subscribe((res: Image) => {
      if (res != null) {
        this.time.picture = res;
        this.form.elementList[this.editingItem.index] = this.time;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.time.picture).subscribe((res: Image) => {
      if (res != null) {
        this.time.picture = res;
        this.form.elementList[this.editingItem.index] = this.time;
        this.saveOnStorage();
      }
    });
  }

  changeLabel(value) {
    this.time.label = value;
  }

  changeHelpText(value) {
    this.time.helpText = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }

}
