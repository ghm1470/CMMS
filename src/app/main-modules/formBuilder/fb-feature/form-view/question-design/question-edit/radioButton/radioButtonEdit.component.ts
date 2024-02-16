/**
 * Created by Zar on 5/28/2017.
 */
import {Component, Input, Output, EventEmitter, Renderer2, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {RadioButton} from '../../../../../fb-model/element/radio-button';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {isNullOrUndefined} from 'util';
import swal from 'sweetalert2';
import {UUID} from 'angular2-uuid';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {DefaultNotify} from "@angular-boot/util";
import {NotiConfig} from "../../../../../../../shared/tools/notifyConfig";

@Component({
  selector: 'RadioButtonEdit',
  templateUrl: './radioButtonEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class RadioButtonEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  radioButtonForm: FormGroup;
  radioButton = new RadioButton();
  radioButtonCopy = new RadioButton();
  opt: Array<Image>;
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.radioButtonForm = fb.group({
      label: [null, Validators.required],
      helpText: [null],
      id: false,
      required: false,
      value: false,
    });
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.radioButton = JSON.parse(JSON.stringify(this.editingItem.item));
    this.radioButtonCopy = JSON.parse(JSON.stringify(this.editingItem.item));
    this.opt = this.radioButton.optionList;
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
  }

  save() {
    this.saveButton = true;
    if (this.editingItem.newElement === true && this.radioButtonCopy.label === this.radioButton.label) {
      DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired, '', NotiConfig.notifyConfig);
      return;

    } else if (this.radioButton.label !== ''  && this.checkOptions()) {
      this.radioButton.optionList = this.opt;
      this.form.elementList[this.editingItem.index] = this.radioButton;
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
    setPicture.setPicture(event, this.radioButton.picture).subscribe((res: Image) => {
      if (res != null) {
        this.radioButton.picture = res;
        this.form.elementList[this.editingItem.index] = this.radioButton;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.radioButton.picture).subscribe((res: Image) => {
      if (res != null) {
        this.radioButton.picture = res;
        this.form.elementList[this.editingItem.index] = this.radioButton;
        this.saveOnStorage();
      }
    });
  }

  createNewOption() {
    let index = 0;
    index += this.opt.length;
    const option = new Image();
    option.id = UUID.UUID();
    option.caption = '';
    option.imageStatus = ImageStatus.WITHOUT_IMAGE;
    this.opt[index] = option;
  }

  onChangeOption(value, index) {
    this.opt[index].caption = value;
  }

  deleteOption(optionIndex) {
    this.opt.splice(optionIndex, 1);
  }

  settingOptionImage(event, index) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.setPicture(event, this.opt[index]).subscribe((res: Image) => {
      if (res != null) {
        this.opt[index] = res;
        this.radioButton.optionList = this.opt;
        this.form.elementList[this.editingItem.index] = this.radioButton;
        this.saveOnStorage();
      }
    });
  }

  deleteOptionImage(index) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.opt[index]).subscribe((res: Image) => {
      if (res != null) {
        this.opt[index] = res;
        this.radioButton.optionList = this.opt;
        this.form.elementList[this.editingItem.index] = this.radioButton;
        this.saveOnStorage();
      }
    });
  }

  checkOptions() {
    let check = false;
    if (this.opt.length > 0) {
      for (const item of this.opt) {
        if ((isNullOrUndefined(item.caption) || item.caption == '') && item.imageStatus == ImageStatus.WITHOUT_IMAGE) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
    }
    return check;
  }

  changeLabel(value) {
    this.radioButton.label = value;
  }

  changeHelpText(value) {
    this.radioButton.helpText = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}
