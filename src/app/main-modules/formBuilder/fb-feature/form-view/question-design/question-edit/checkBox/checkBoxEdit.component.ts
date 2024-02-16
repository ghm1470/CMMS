/**
 * Created by Zar on 5/27/2017.
 */

import {Component, Input, Output, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CheckBox} from '../../../../../fb-model/element/check-box';
import {Form} from '../../../../../fb-model/form/form';
import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
import {CacheService} from '../../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../../shared/language-data-service/language.service';
import {isNullOrUndefined} from 'util';
import swal from 'sweetalert2';
import {UUID} from 'angular2-uuid';
import {FORM} from '../../../../../fb-model/constants/storage-keys';
import {Image} from '../../../../../shared/model/Image';
import {ImageStatus} from '../../../../../shared/model/ImageStatus';
import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
import {FormService} from '../../../../../fb-service/form.service';
import {DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from "../../../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'CheckBoxEdit',
    templateUrl: './checkBoxEdit.component.html',
    styleUrls: ['../question-edit.component.css']
})

export class CheckBoxEditComponent implements OnInit {

    @Input() editingItem: QuestionEmitterHelper;
    @Output() onUpdate = new EventEmitter();

    checkBoxForm: FormGroup;
    checkBox = new CheckBox();
    checkBoxCopy = new CheckBox();
    opt: Array<Image> = [];
    form = new Form();
    data: any = null;
    saveButton = false;
    MyImageStatus = ImageStatus;

    constructor(fb: FormBuilder,
                private formService: FormService,
                private cacheService: CacheService,
                private languageDataService: LanguageService,
                renderer: Renderer2) {
        this.checkBoxForm = fb.group({
            label: [null, Validators.required],
            helpText: [null],
            minItemSelectable: [null, Validators.required],
            maxItemSelectable: [null, Validators.required],
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
        this.checkBox = JSON.parse(JSON.stringify(this.editingItem.item));
        this.checkBoxCopy = JSON.parse(JSON.stringify(this.editingItem.item));
        this.opt = this.checkBox.optionList;
        this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
            this.form = res;
        });
    }

    save() {
        if (this.checkBox.maxItemSelectable < this.checkBox.minItemSelectable) {
            DefaultNotify.notifyDanger('حداکثر تعداد گزینه های قابل انتخاب نباید نباید کوچکتر از حداقل تعداد گزینه های قابل انتخاب باشد.', '', NotiConfig.notifyConfig)
            return;

        }
        this.saveButton = true;
        if (this.editingItem.newElement === true && this.checkBoxCopy.label === this.checkBox.label) {
            DefaultNotify.notifyDanger(this.data.errorMessages.labelRequired, '', NotiConfig.notifyConfig);
            return;

        } else if (this.checkBoxForm.controls['minItemSelectable'].valid && this.checkBoxForm.controls['maxItemSelectable'].valid
            && this.checkBox.label !== '' && this.checkOptions() &&
            !(this.checkBox.maxItemSelectable === 0 && this.checkBox.required)) {
            this.checkBox.optionList = this.opt;
            this.form.elementList[this.editingItem.index] = this.checkBox;
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
        setPicture.setPicture(event, this.checkBox.picture).subscribe((res: Image) => {
            if (res != null) {
                this.checkBox.picture = res;
                this.form.elementList[this.editingItem.index] = this.checkBox;
                this.saveOnStorage();
            }
        });
    }

    deleteQuestionImage() {
        const setPicture = new ImageUploadClass(this.formService);
        setPicture.deletePicture(this.checkBox.picture).subscribe((res: Image) => {
            if (res != null) {
                this.checkBox.picture = res;
                this.form.elementList[this.editingItem.index] = this.checkBox;
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
        this.checkBox.minItemSelectable = 1;
        this.checkBox.maxItemSelectable = 1;
    }

    deleteOption(optionIndex) {
        this.opt.splice(optionIndex, 1);
        this.checkBox.minItemSelectable = 1;
        this.checkBox.maxItemSelectable = 1;
    }

    settingOptionImage(event, index) {
        const setPicture = new ImageUploadClass(this.formService);
        setPicture.setPicture(event, this.opt[index]).subscribe((res: Image) => {
            if (res != null) {
                this.opt[index] = res;
                this.checkBox.optionList = this.opt;
                this.form.elementList[this.editingItem.index] = this.checkBox;
                this.saveOnStorage();
            }
        });
    }

    deleteOptionImage(index) {
        const setPicture = new ImageUploadClass(this.formService);
        setPicture.deletePicture(this.opt[index]).subscribe((res: Image) => {
            if (res != null) {
                this.opt[index] = res;
                this.checkBox.optionList = this.opt;
                this.form.elementList[this.editingItem.index] = this.checkBox;
                this.saveOnStorage();
            }
        });
    }



    changeMinOptionsNumber(event) {
        if (event) {
            if (this.checkBox.required && event === 0) {
                this.checkBox.minItemSelectable = 1;
            }
            // if (this.checkBox.maxItemSelectable < event) {
            //   this.checkBox.minItemSelectable = this.checkBox.maxItemSelectable;
            // }
            if (event > this.opt.length) {
                this.checkBox.minItemSelectable = this.opt.length;
            }
        } else {
            // this.checkBox.minItemSelectable = 1;
        }

    }

    checkOptions() {
        let check = false;
        if (this.opt.length > 0) {
            for (const item of this.opt) {
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

    changeLabel(value) {
        this.checkBox.label = value;
    }

    changeHelpText(value) {
        this.checkBox.helpText = value;
    }

    onChangeOption(value, index) {
        this.opt[index].caption = value;
    }

    saveOnStorage() {
        this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
    }
}
