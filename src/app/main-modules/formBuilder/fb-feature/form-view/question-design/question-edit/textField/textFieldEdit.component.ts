/**
 * Created by Zar on 5/24/2017.
 */
import {Component, OnInit, Input, Output, EventEmitter, Renderer2} from '@angular/core';
import {Validators, FormControl, FormBuilder, FormGroup} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {TextField} from '../../../../../fb-model/element/text-field';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {EnumHandle} from '../../../../../shared/utility/enum-array/enum-handle';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {TextFieldType} from '../../../../../fb-model/enumeration/text-field-type';
import {DefaultNotify} from '@angular-boot/util';

@Component({
  selector: 'TextFieldEdit',
  templateUrl: './textFieldEdit.component.html',
  styleUrls: ['../question-edit.component.css']

})

export class TextFieldEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  textFieldForm: FormGroup;
  txtField = new TextField();
  txtFieldCopy = new TextField();
  form = new Form();
  data: any = null;
  textFieldTypeEnum: any[] = [];
  txtFieldType: any;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {

    this.textFieldForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      placeHolder: new FormControl(''),
      minLength: new FormControl(null, Validators.required),
      maxLength: new FormControl(null, Validators.required),
      txtType: new FormControl(null, Validators.required),
      id: false,
      required: false,
      textFieldType: false,
    });
    languageDataService.renderer = renderer;
  }


  ngOnInit() {
    this.textFieldTypeEnum = EnumHandle.getEnumList(EnumHandle.listEnums<TextFieldType>(TextFieldType));
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.txtField = JSON.parse(JSON.stringify(this.editingItem.item));
    this.txtFieldCopy = JSON.parse(JSON.stringify(this.editingItem.item));
    this.txtFieldType = this.txtField.textFieldType;
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
  }

  save() {

    this.saveButton = true;
    if (this.editingItem.newElement === true && this.txtFieldCopy.label === this.txtField.label) {
      DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired);
      return;

    } else if (this.textFieldForm.controls.minLength.valid && this.textFieldForm.controls.maxLength.valid
      && this.txtField.label !== '') {
      this.form.elementList[this.editingItem.index] = this.txtField;
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
    setPicture.setPicture(event, this.txtField.picture).subscribe((res: Image) => {
      if (res != null) {
        this.txtField.picture = res;
        this.form.elementList[this.editingItem.index] = this.txtField;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.txtField.picture).subscribe((res: Image) => {
      if (res != null) {
        this.txtField.picture = res;
        this.form.elementList[this.editingItem.index] = this.txtField;
        this.saveOnStorage();
      }
    });
  }



  changeTFMaxLength(event) {
    if (event < this.txtField.minLength) {
      this.txtField.minLength = event;
    }
  }

  changeTFMinLength(event) {
    if (event > this.txtField.maxLength) {
      this.txtField.minLength = this.txtField.maxLength;
    }
  }

  changeLabel(value) {
    this.txtField.label = value;
  }

  changeHelpText(value) {
    this.txtField.helpText = value;
  }

  changePlaceHolder(value) {
    this.txtField.placeHolder = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}
