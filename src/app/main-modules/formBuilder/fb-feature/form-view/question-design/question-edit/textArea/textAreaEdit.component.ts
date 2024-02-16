/**
 * Created by Zar on 5/25/2017.
 */
import {Component, Input, Output, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Form} from '../../../../../fb-model/form/form';
import {TextArea} from '../../../../../fb-model/element/text-area';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
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

@Component({
  selector: 'TextAreaEdit',
  templateUrl: './textAreaEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class TextAreaEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  textAreaForm: FormGroup;
  textArea = new TextArea();
  textAreaCopy = new TextArea();
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.textAreaForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      placeHolder: new FormControl(''),
      id: false,
      required: false,
    });
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.textArea = JSON.parse(JSON.stringify(this.editingItem.item));
    this.textAreaCopy = JSON.parse(JSON.stringify(this.editingItem.item));
    // console.log('textAreaJSON.parse', this.textArea);

    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
    console.log('editingItem', this.editingItem);
    console.log('textArea', this.textArea);

  }

  save() {
    this.saveButton = true;
    if (this.editingItem.newElement === true && this.textAreaCopy.label === this.textArea.label) {
      DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired);
      return;

    }  else if (this.textArea.label !== '') {
      this.form.elementList[this.editingItem.index] = this.textArea;
      console.log('textArea', this.textArea);
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
    setPicture.setPicture(event, this.textArea.picture).subscribe((res: Image) => {
      if (res != null) {
        this.textArea.picture = res;
        this.form.elementList[this.editingItem.index] = this.textArea;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.textArea.picture).subscribe((res: Image) => {
      if (res != null) {
        this.textArea.picture = res;
        this.form.elementList[this.editingItem.index] = this.textArea;
        this.saveOnStorage();
      }
    });
  }

  changeLabel(value) {
    this.textArea.label = value;
  }

  changeHelpText(value) {
    this.textArea.helpText = value;
  }

  changePlaceHolder(value) {
    this.textArea.placeHolder = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}
