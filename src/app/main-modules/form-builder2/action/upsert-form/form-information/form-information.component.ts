import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Form} from '../../../model/form';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {FormCategory} from '../../../../formBuilder/fb-model/form/form-category';
import {FormCategoryService} from '../../../../basicInformation/formCategory/endpoint/form-category.service';
import {FormService} from '../../../service/form.service';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {Location} from '@angular/common';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

@Component({
    selector: 'app-form-information',
    templateUrl: './form-information.component.html',
    styleUrls: ['./form-information.component.scss']
})
export class FormInformationComponent implements OnInit {

    constructor(fb: FormBuilder,
                private formCategoryService: FormCategoryService,
                private formService: FormService,
                public location: Location) {

    }

    @Input() form: Form = new Form();
    @Input() mode: ActionMode;
    @Output() formIdOut = new EventEmitter<boolean>();
    actionMode = ActionMode;

    htmlForm: FormGroup;
    myPattern = MyPattern;
    submitted = false;
    categories: Array<FormCategory> = [];

    loadingSubmit = false;

    ShowFormBody = false;


    ngOnInit(): void {
        this.getFormCategory();
        this.creatForm();


    }

    creatForm() {
        this.htmlForm = new FormGroup({
            title: new FormControl({value: null}, Validators.required),
            grouping: new FormControl({value: null}),
            description: new FormControl({value: null})
        });
        if (this.mode === ActionMode.VIEW) {
            this.htmlForm.disable();
        }
        this.ShowFormBody = false;
        setTimeout(e => {
            this.ShowFormBody = true;
        }, .000000000000000000000000001);
    }

    getFormCategory() {
        this.formCategoryService.getAll().subscribe((res) => {

            if (res.data.length > 0) {
                this.categories = res.data;
                if (!this.form.formCategoryId && !this.form.id) {
                    this.form.formCategoryId = this.categories[0].id;
                }
            }
        });
    }

    onSubmit() {
        if (!this.htmlForm.dirty) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.loadingSubmit) {
            return;
        }

        this.submitted = true;
        if (this.htmlForm.invalid) {
            DefaultNotify.notifyDanger('مقادیر خواسته شده را درست وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.form.id) {

            this.loadingSubmit = true;
            this.formService.update(this.form).subscribe((res: Form) => {
                this.loadingSubmit = false;
                if (res) {
                    DefaultNotify.notifySuccess('فرم با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                    this.creatForm();

                } else {
                    DefaultNotify.notifyDanger('خطا  در ویرایش.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingSubmit = false;
            });
        } else {

            this.formService.create(this.form).subscribe((res: any) => {
                this.loadingSubmit = false;
                this.form = res;
                this.formIdOut.emit(res.id);
                DefaultNotify.notifySuccess('فرم با موفقیت ذخیره شد.', '', NotiConfig.notifyConfig);
                this.creatForm();
            }, error => {
                this.loadingSubmit = false;
            });
        }
    }

    back() {
        this.location.back();
    }
}
