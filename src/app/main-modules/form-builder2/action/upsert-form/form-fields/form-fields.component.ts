import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Form} from '../../../model/form';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Element} from '../../../model/element';
import {ElementType} from '../../../model/enum/element-type';
import {Option} from '../../../model/option';
import {FormService} from '../../../service/form.service';
import {Location} from '@angular/common';
import {isNullOrUndefined} from 'util';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-form-fields',
    templateUrl: './form-fields.component.html',
    styleUrls: ['./form-fields.component.scss']
})
export class FormFieldsComponent implements OnInit, AfterViewInit {

    constructor(private formService: FormService,
                public location: Location,
    ) {
    }

    @Input() form: Form = new Form();
    @Input() mode: ActionMode;
    actionMode = ActionMode;
    inputTextArea: string;
    MyModalSize = ModalSize;
    myPattern = MyPattern;
    htmlForm: FormGroup;
    newElement = new Element();
    newOption = new Option();
    submitted = false;
    newElementType = ElementType;
    newElementListCopy: Element[];
    loadingSubmit = false;

    ngOnInit(): void {
        if (this.form.newElementList) {
            this.newElementListCopy = JSON.parse(JSON.stringify(this.form.newElementList));
        }
        this.creatForm();
    }

    creatForm() {
        this.htmlForm = new FormGroup({
            questionTitle: new FormControl({value: null}, Validators.required),
            guide: new FormControl({value: null}), // راهنما
            placeHolder: new FormControl({value: null}), // متن جانما
            newElementType: new FormControl({value: null}, Validators.required), //  نوع
            required: new FormControl({value: null}), // اجباری
            maxLength: new FormControl({value: null}), //  حداکثر طول
            minLength: new FormControl({value: null}), //  حداقل طول
            maxItemSelectable: new FormControl({value: null}), //  حداکثر گزینه  قابل انتخاب
            minItemSelectable: new FormControl({value: null}), //  حداقل گزینه  قابل انتخاب
            newOptionList: new FormControl({value: null}), //  گزینه ها
            optionTitle: new FormControl({value: null}) //  گزینه هاعنوان
        });
        if (this.mode === ActionMode.VIEW) {
            this.htmlForm.disable();

        }
    }


    onSubmit() {
        // return;
        this.submitted = true;
        if (!this.newElement.questionTitle) {
            DefaultNotify.notifyDanger('عنوان وازد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.newElement.questionTitle) {
            DefaultNotify.notifyDanger('نوع انتخاب شود.', '', NotiConfig.notifyConfig);
            return;
        }


        if (this.newElement.newElementType === ElementType.TEXT_FIELD ||
            this.newElement.newElementType === ElementType.TEXT_AREA ||
            this.newElement.newElementType === ElementType.DATE ||
            this.newElement.newElementType === ElementType.TIME
        ) {
            this.newElement.newOptionList = [];
            this.newElement.maxItemSelectable = null;
            this.newElement.minItemSelectable = null;
        }
        if (this.newElement.newElementType === ElementType.DATE ||
            this.newElement.newElementType === ElementType.TIME
        ) {
            this.newElement.maxLength = null;
            this.newElement.minLength = null;
        }
        if (this.newElement.newElementType === ElementType.COMBO_BOX ||
            this.newElement.newElementType === ElementType.RADIO_BUTTON ||
            this.newElement.newElementType === ElementType.CHECK_BOX) {

            if (this.newElement.newOptionList.length === 0) {
                DefaultNotify.notifyDanger('حداقل یک گزینه انتخاب شود.', '', NotiConfig.notifyConfig);
                return;
            }

        }
        if (this.newElement.newElementType === ElementType.CHECK_BOX) {

            if (isNullOrUndefined(this.newElement.minItemSelectable)) {
                DefaultNotify.notifyDanger('حداقل گزینه  قابل انتخاب  وارد شود.', '', NotiConfig.notifyConfig);
                return;
            }
            if (isNullOrUndefined(this.newElement.maxItemSelectable)) {
                DefaultNotify.notifyDanger('حداکثر گزینه  قابل انتخاب  وارد شود.', '', NotiConfig.notifyConfig);
                return;
            }
            if (this.newElement.minItemSelectable > this.newElement.newOptionList.length) {
                DefaultNotify.notifyDanger('حداقل گزینه  قابل انتخاب نباید بیشتر از تعداد گزینه ها باشد.', '', NotiConfig.notifyConfig);
                return;
            }
            if (this.newElement.maxItemSelectable > this.newElement.newOptionList.length) {
                DefaultNotify.notifyDanger('حداکثر گزینه  قابل انتخاب نباید بیشتر از تعداد گزینه ها باشد.', '', NotiConfig.notifyConfig);
                return;
            }

        }
        if (this.newElement.maxLength < this.newElement.minLength) {
            DefaultNotify.notifyDanger('حداکثر طول نباید کوچکتر از حداقل طول باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.newElement.maxItemSelectable < this.newElement.minItemSelectable) {
            DefaultNotify.notifyDanger('حداکثر گزینه  قابل انتخاب نباید کوچکتر از حداقل گزینه  قابل انتخاب باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.newElement.questionTitle) {
            DefaultNotify.notifyDanger('نوع انتخاب شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.newElement.id) {
            const indexElement = this.form.newElementList.findIndex(e => e.id === this.newElement.id);
            if (indexElement !== -1) {
                this.form.newElementList[indexElement] = JSON.parse(JSON.stringify(this.newElement));
            }

        } else {
            this.newElement.id = Toolkit2.Common.create().uuidv4();
            this.form.newElementList.push(JSON.parse(JSON.stringify(this.newElement)));

        }
        if (this.newElement.newElementType === ElementType.DATE) {
            this.setDateJquery(this.newElement.id);

        }
        this.newElement = new Element();

        ModalUtil.hideModal('insertFieldsModal');

    }


    showModal() {

        ModalUtil.showModal('insertFieldsModal');
    }

    addOption() {
        if (!this.newOption.value) {
            DefaultNotify.notifyDanger('عنوان گزینه باید وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.newOption.id) {
            const index = this.newElement.newOptionList.findIndex(option => option.id === this.newOption.id);
            if (index !== -1) {
                this.newElement.newOptionList[index] = JSON.parse(JSON.stringify(this.newOption));
            }
        } else {
            this.newOption.id = Toolkit2.Common.create().uuidv4();
            this.newElement.newOptionList.push(JSON.parse(JSON.stringify(this.newOption)));
        }
        this.newOption = new Option();

    }

    selectOptionForEdit(option: Option) {
        this.newOption = JSON.parse(JSON.stringify(option));
    }

    selectElementForEdit(element: Element) {
        this.newElement = JSON.parse(JSON.stringify(element));
        this.showModal();

    }

    updateForm() {
        if (this.loadingSubmit) {
            return;
        }

        this.submitted = true;

        if (this.form.newElementList.length === 0) {
            DefaultNotify.notifyDanger(' حداقل یک سوال وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.newElementListCopy) === JSON.stringify(this.form.newElementList)) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        this.loadingSubmit = true;
        this.formService.update(this.form).subscribe((res: Form) => {
            this.loadingSubmit = false;
            if (res) {
                this.newElementListCopy = JSON.parse(JSON.stringify(this.form.newElementList));
                DefaultNotify.notifySuccess('فرم با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                this.back();
            } else {
                DefaultNotify.notifyDanger('خطا  در ویرایش.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingSubmit = false;
        });

    }

    ngAfterViewInit(): void {
        for (const element of this.form.newElementList) {
            if (element.newElementType === ElementType.DATE) {
                this.setDateJquery(element.id);
            }
        }
    }

    setDateJquery(id) {
        setTimeout(e1 => {
            $('#inputDate' + id).azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputDate' + id),
            }).on('change', (e) => {

            });

        }, 100);

    }

    back() {
        this.location.back();
    }


    onCloseModal() {
        this.newElement = new Element();
        this.newOption = new Option();
    }

    elementMove(type: string, elementIndex: number) {
        const thisElement = JSON.parse(JSON.stringify(this.form.newElementList[elementIndex]));
        if (type === 'up') {
            this.form.newElementList[elementIndex] = JSON.parse(JSON.stringify(this.form.newElementList[elementIndex - 1]));
            this.form.newElementList[elementIndex - 1] = thisElement;
        } else if (type === 'down') {
            this.form.newElementList[elementIndex] = JSON.parse(JSON.stringify(this.form.newElementList[elementIndex + 1]));
            this.form.newElementList[elementIndex + 1] = thisElement;
        }

    }


}
