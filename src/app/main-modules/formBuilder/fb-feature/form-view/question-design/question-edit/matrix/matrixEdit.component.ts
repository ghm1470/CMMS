/**
 * Created by Zar on 5/28/2017.
 */

import {Component, Input, Output, EventEmitter, Renderer2, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {Matrix} from '../../../../../fb-model/element/matrix';
import {Form} from '../../../../../fb-model/form/form';
import {MatrixQuestion} from '../../../../../fb-model/element/matrix-question';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {isNullOrUndefined} from 'util';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';

import {UUID} from 'angular2-uuid';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {Image} from '../../../../../shared/model/Image';

@Component({
  selector: 'MatrixEdit',
  templateUrl: './matrixEdit.component.html'
})

export class MatrixEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  matrixForm: FormGroup;
  matrix = new Matrix();
  form = new Form();
  options: Array<Image> = [];
  questions: Array<MatrixQuestion> = [];
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.matrixForm = fb.group({
      label: [null, Validators.required],
      helpText: [null],
      id: false,
      required: false,
      optionValue: false,
      questionValue: false,
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
    this.matrix = JSON.parse(JSON.stringify(this.editingItem.item));
    this.options = this.matrix.optionList;
    this.questions = this.matrix.matrixQuestionList;
  }

  save() {
    this.saveButton = true;
    if (this.matrix.label !== '' && this.checkOptions() && this.checkQuestions()) {
      this.matrix.optionList = this.options;
      this.matrix.matrixQuestionList = this.questions;
      this.form.elementList[this.editingItem.index] = this.matrix;
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

  createNewOption() {
    let index = 0;
    index += this.options.length;
    const opt = new Image();
    opt.id = UUID.UUID();
    opt.caption = '';
    opt.imageStatus = ImageStatus.WITHOUT_IMAGE;
    this.options[index] = opt;
  }

  createNewQuestion() {
    let index = 0;
    index += this.questions.length;
    const q = new MatrixQuestion();
    q.title = '';
    q.multipleSelect = false;
    this.questions[index] = q;
  }

  deleteOption(optionIndex) {
    this.options.splice(optionIndex, 1);
  }

  deleteQuestion(questionIndex) {
    this.questions.splice(questionIndex, 1);
  }

  settingQuestionImage(event) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.setPicture(event, this.matrix.picture).subscribe((res: Image) => {
      if (res != null) {
        this.matrix.picture = res;
        this.form.elementList[this.editingItem.index] = this.matrix;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.matrix.picture).subscribe((res: Image) => {
      if (res != null) {
        this.matrix.picture = res;
        this.form.elementList[this.editingItem.index] = this.matrix;
        this.saveOnStorage();
      }
    });
  }

  settingOptionImage(event, index) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.setPicture(event, this.options[index]).subscribe((res: Image) => {
      if (res != null) {
        this.options[index] = res;
        this.matrix.optionList = this.options;
        this.form.elementList[this.editingItem.index] = this.matrix;
        this.saveOnStorage();
      }
    });
  }

  deleteOptionImage(index) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.options[index]).subscribe((res: Image) => {
      if (res != null) {
        this.options[index] = res;
        this.matrix.optionList = this.options;
        this.form.elementList[this.editingItem.index] = this.matrix;
        this.saveOnStorage();
      }
    });
  }

  checkOptions() {
    let check = false;
    if (this.options.length > 0) {
      for (const item of this.options) {
        if ((isNullOrUndefined(item.caption) || item.caption === '') && item.imageStatus == ImageStatus.WITHOUT_IMAGE) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
    }
    return check;
  }

  checkQuestions() {
    let check = false;
    if (this.questions.length > 0) {
      for (const item of this.questions) {
        if ((isNullOrUndefined(item.title) || item.title === '') || isNullOrUndefined(item.multipleSelect)) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
    }
    return check;
  }

  onChangeOption(value, index) {
    this.options[index].caption = value;
  }

  onChangeQuestionTitle(event, index) {
    this.questions[index].title = event;
  }

  onChangeQuestionSelect(value, index) {
    if (value === 'MULTI') {
      this.questions[index].multipleSelect = true;
    }
    if (value === 'SINGLE') {
      this.questions[index].multipleSelect = false;
    }
  }

  changeLabel(value) {
    this.matrix.label = value;
  }

  changeHelpText(value) {
    this.matrix.helpText = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}
