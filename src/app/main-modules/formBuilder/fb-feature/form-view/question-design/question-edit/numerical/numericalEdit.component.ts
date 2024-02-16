/**
 * Created by Zar on 5/25/2017.
 */
import {Component, Input, Output, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {Numerical} from '../../../../../fb-model/element/numerical';
import {Form} from '../../../../../fb-model/form/form';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {FormService} from '../../../../../fb-service/form.service';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';

@Component({
  selector: 'NumericalEdit',
  templateUrl: './numericalEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class NumericalEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  numericalForm: FormGroup;
  numerical = new Numerical();
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.numericalForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      min: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
      step: new FormControl(null, Validators.required),
      beginLabel: new FormControl(null, Validators.required),
      endLabel: new FormControl(null, Validators.required),
      id: false,
      required: false,
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
    this.numerical = JSON.parse(JSON.stringify(this.editingItem.item));
  }

  save() {
    this.saveButton = true;
    if (this.numericalForm.controls['min'].valid && this.numericalForm.controls['max'].valid
      && this.numerical.label != ''
      && this.numerical.beginLabel != '' && this.numerical.endLabel != '') {
      this.form.elementList[this.editingItem.index] = this.numerical;
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
    setPicture.setPicture(event, this.numerical.picture).subscribe((res: Image) => {
      if (res != null) {
        this.numerical.picture = res;
        this.form.elementList[this.editingItem.index] = this.numerical;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.numerical.picture).subscribe((res: Image) => {
      if (res != null) {
        this.numerical.picture = res;
        this.form.elementList[this.editingItem.index] = this.numerical;
        this.saveOnStorage();
      }
    });
  }

  changeMaxLength(event) {
    if (event < this.numerical.minLength) {
      this.numerical.minLength = event - 1;
    }
  }

  changeMinLength(event) {
    if (event > this.numerical.maxLength) {
      this.numerical.maxLength = event + 1;
    }
  }

  changeLabel(value) {
    this.numerical.label = value;
  }

  changeHelpText(value) {
    this.numerical.helpText = value;
  }

  changeBeginLabel(value) {
    this.numerical.beginLabel = value;
  }

  changeEndLabel(value) {
    this.numerical.endLabel = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}
