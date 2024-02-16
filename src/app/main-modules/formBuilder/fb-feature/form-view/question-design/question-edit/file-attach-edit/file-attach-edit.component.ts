import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FileAttach} from '../../../../../fb-model/element/fileAttach';
import {Form} from '../../../../../fb-model/form/form';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {FormService} from '../../../../../fb-service/form.service';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import swal from 'sweetalert2';

import {FileUploadType} from '../../../../../fb-model/enumeration/file-upload-type';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {EnumObject} from '../../../../../shared/utility/enum-array/enum-object';
import {EnumHandle} from '../../../../../shared/utility/enum-array/enum-handle';

@Component({
  selector: 'app-file-attach-edit',
  templateUrl: './file-attach-edit.component.html',
  styleUrls: ['./file-attach-edit.component.css', '../question-edit.component.css']
})
export class FileAttachEditComponent implements OnInit {

  @Input() editingItem: QuestionEmitterHelper;
  @Output() onUpdate = new EventEmitter();
  fileAttachForm: FormGroup;
  fileAttach = new FileAttach();
  form = new Form();
  data: any = null;
  saveButton = false;
  MyImageStatus = ImageStatus;
  fileTypeList: EnumObject[] = [];

  constructor(fb: FormBuilder,
              private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    this.fileAttachForm = fb.group({
      label: new FormControl(null, Validators.required),
      helpText: new FormControl(null),
      limitation: new FormControl(null, Validators.required),
      fileType: new FormControl(null, Validators.required),
      id: false,
      required: false,
    });
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.fileTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<FileUploadType>(FileUploadType));
    console.log(this.fileTypeList);

    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.fileAttach = JSON.parse(JSON.stringify(this.editingItem.item));
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      this.form = res;
    });
  }

  save() {
    this.saveButton = true;
    if (this.fileAttach.label != '' && this.fileAttach.helpText != '' && this.fileAttach.fileCountLimitation < 10 && this.fileAttach.fileCountLimitation > 0) {
      this.form.elementList[this.editingItem.index] = this.fileAttach;
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
    setPicture.setPicture(event, this.fileAttach.picture).subscribe((res: Image) => {
      if (res != null) {
        this.fileAttach.picture = res;
        this.form.elementList[this.editingItem.index] = this.fileAttach;
        this.saveOnStorage();
      }
    });
  }

  deleteQuestionImage() {
    const setPicture = new ImageUploadClass(this.formService);
    setPicture.deletePicture(this.fileAttach.picture).subscribe((res: Image) => {
      if (res != null) {
        this.fileAttach.picture = res;
        this.form.elementList[this.editingItem.index] = this.fileAttach;
        this.saveOnStorage();
      }
    });
  }

  changeLabel(value) {
    this.fileAttach.label = value;
  }

  changeHelpText(value) {
    this.fileAttach.helpText = value;
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }

}
