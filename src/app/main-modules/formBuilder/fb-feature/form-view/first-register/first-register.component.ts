import {Component, Input, OnChanges, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ResourceRequest} from '../../../shared/model/rest/request/resource-request.model';
import {CacheService} from '../../../shared/cache-service/cache.service';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {Form} from '../../../fb-model/form/form';
import {FormCategory} from '../../../fb-model/form/form-category';
import {FORM} from '../../../fb-model/constants/storage-keys';
import {FormService} from '../../../fb-service/form.service';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {ActionMode} from '@angular-boot/util';
import {FormCategoryService} from '../../../../basicInformation/formCategory/endpoint/form-category.service';

@Component({
    selector: 'app-first-register',
    templateUrl: './first-register.component.html',
    styleUrls: ['./first-register.component.scss']
})

export class FirstRegisterComponent implements OnInit, OnChanges {

    data: any = null;
    title = '';
    htmlForm: FormGroup;
    form = new Form();
    templateForms: Array<Form> = [];
    categories: Array<FormCategory> = [];
    display = true;
    selectedLanguage: any;
    pictures: Array<string> = ['form5.png', 'form8.png', 'form6.png', 'form4.png', 'form3.png', 'form2.png', 'form1.png', 'form7.png'];
    MyImageStatus = ImageStatus;
    @Input() resetForm: boolean;
    @Input() mode: ActionMode;

    constructor(fb: FormBuilder,
                private formService: FormService,
                private formCategoryService: FormCategoryService,
                private languageDataService: LanguageService,
                private cacheService: CacheService,
                renderer: Renderer2) {
        languageDataService.renderer = renderer;
        this.htmlForm = fb.group({
            title: new FormControl(null, Validators.required),
            grouping: false,
            description: false
        });
    }

    ngOnInit() {
        // get data for selected language
        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
            //تو main هم بود
        });

        // get template forms
        const tempRequest = new ResourceRequest();
        tempRequest.addQuery('isTemplate', true);
        tempRequest.queryFieldFlag = true;


        // get form from cache
        this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
            if (res != null) {
                this.form = res;
                this.getFormCategory();
                // this.htmlForm.reset();

            }
        });
    }

    getFormCategory() {
        this.formCategoryService.getAll().subscribe((res) => {
            this.languageDataService.getSelectedLanguage().subscribe(resLang => {
                this.selectedLanguage = resLang;
            });
            if (res.data.length > 0) {
                this.categories = res.data;
                if (!this.form.formCategoryId && !this.form.id) {
                    this.form.formCategoryId = this.categories[0].id;
                }
            }
        });
    }

    ngOnChanges() {
        // بعد هر تغییرات دوباره از کش گرفته میشه.
        if (this.resetForm) {
            this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
                if (res != null) {
                    this.form = res;
                }
            });
        }
    }


    templateSelection(formId) {
        this.form.id = formId;
    }

    // settingImage(event) {
    //     const setPicture = new ImageUploadClass(this.formService);
    //     setPicture.setPicture(event, this.form.picture).subscribe((res: Image) => {
    //         if (res != null) {
    //             this.form.picture = res;
    //             this.saveOnStorage();
    //         }
    //     });
    // }
    //
    // deleteImage() {
    //     const setPicture = new ImageUploadClass(this.formService);
    //     setPicture.deletePicture(this.form.picture).subscribe((res: Image) => {
    //         if (res != null) {
    //             this.form.picture = res;
    //             this.saveOnStorage();
    //         }
    //     });
    // }

    saveOnStorage() {
        // بعد از هر پر شدن اینپوت اطلاعات به کش ست میشه
        this.cacheService.setItem('form', this.form, CacheType.SESSION_STORAGE);
    }

    saveOnServer() {
        // this.formService.create(this.form).subscribe((res: any) => {
        //
        // });
    }

}
