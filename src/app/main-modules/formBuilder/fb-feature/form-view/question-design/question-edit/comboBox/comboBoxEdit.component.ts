/**
 * Created by Zar on 5/25/2017.
 */
import {Component, Input, Output, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {ComboBox} from '../../../../../fb-model/element/combo-box';
import {Form} from '../../../../../fb-model/form/form';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {isNullOrUndefined} from 'util';
import swal from 'sweetalert2';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {FormService} from '../../../../../fb-service/form.service';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {DefaultNotify} from "@angular-boot/util";
import {NotiConfig} from "../../../../../../../shared/tools/notifyConfig";

@Component({
  selector: 'ComboBoxEdit',
  templateUrl: './comboBoxEdit.component.html',
  styleUrls: ['../question-edit.component.css']
})

export class ComboBoxEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();

  comboBoxForm: FormGroup;
  opt: Array<string> = [];
  optTest: Array<ComboOption> = [];
  comboBox = new ComboBox();
  comboBoxCopy = new ComboBox();
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.comboBoxForm = fb.group({
      label: [null, Validators.required],
      helpText: [null],
      placeHolder: [null],
      required: false,
      value: false,
      id: false,
    });
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.comboBox = JSON.parse(JSON.stringify(this.editingItem.item));
    this.comboBoxCopy = JSON.parse(JSON.stringify(this.editingItem.item));
    this.opt = this.comboBox.comboOptionList;
    for (let j = 0; j < this.opt.length; j++) {
      const id = j;
      const value = this.opt[j];
      const option: ComboOption = {id, value};
      this.optTest.push(option);
    }
    console.log('ngOnInit.optTest', this.optTest)

    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
  }

  save() {
    this.saveButton = true;
    if (this.editingItem.newElement === true && this.comboBoxCopy.label === this.comboBox.label) {
      DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired, '', NotiConfig.notifyConfig);
      return;

    }
    // ممکنه متن پیشنهادی مطابق متن کاربر باشه پس ولیدیشنش رو اعمال نمیکنم
    // else if (this.editingItem.newElement === true && this.comboBoxCopy.placeHolder === this.comboBox.placeHolder) {
    //   DefaultNotify.notifyDanger(this.data.errorMessages.placeHolderRequired);
    //   return;
    // }
    // console.log('optList--?', this.optTest)
    else if (this.comboBox.label !== ''  && this.checkOptions()) {

      this.opt = [];
      console.log('this.optTest', this.optTest)
      this.optTest[0].value = this.comboBox.placeHolder;
      for (const op of this.optTest) {
        this.opt.push(op.value);
      }
      this.comboBox.comboOptionList = this.opt;
      console.log('optList--?', this.opt);

      this.form.elementList[this.editingItem.index] = this.comboBox;
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
        this.onUpdate.emit(null);
      }
    }
  }

  onChangeRadio(value) {
    this.comboBox.comboBoxType = value;
  }

  createNewOption() {
    let index = 0;
    index += this.optTest.length;
    const id = index;
    const value = '';
    const option: ComboOption = {id, value};
    this.optTest[index] = option;
  }

  onChange(value, index) {
    this.optTest[index].id = index;
    this.optTest[index].value = value;
  }

  deleteOption(optionIndex) {
    this.optTest.splice(optionIndex, 1);
  }

  settingQuestionImage(event) {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.setPicture(event, this.comboBox.picture).subscribe((res: Image) => {
      if (res != null) {
        this.comboBox.picture = res;
        this.form.elementList[this.editingItem.index] = this.comboBox;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.comboBox.picture).subscribe((res: Image) => {
      if (res != null) {
        this.comboBox.picture = res;
        this.form.elementList[this.editingItem.index] = this.comboBox;
        this.saveOnStorage();
      }
    });
  }

  checkOptions() {
    let check = false;
    const options = this.optTest.slice(1, this.optTest.length);
    if (options.length > 0) {
      for (const item of options) {
        if (isNullOrUndefined(item.value) || item.value == '') {
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
    this.comboBox.label = value;
  }

  changeHelpText(value) {
    this.comboBox.helpText = value;
  }

  changePlaceHolder(value) {
    this.comboBox.placeHolder = value;
    this.opt[0] = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }
}

export class ComboOption {
  id: number;
  value: string;
}
