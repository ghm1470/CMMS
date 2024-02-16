import {Component, OnInit, Output, EventEmitter, OnChanges, Input, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
import {CacheService} from '../../../shared/cache-service/cache.service';
import {isNullOrUndefined} from 'util';
import {Toolkit} from '../../../shared/utility/toolkit';
import {Form} from '../../../fb-model/form/form';
import {FormService} from '../../../fb-service/form.service';
import {FORM} from '../../../fb-model/constants/storage-keys';
import {DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";


@Component({
    selector: 'app-final-register',
    templateUrl: './final-register.component.html',
    styleUrls: ['./final-register.component.scss']
})
export class FinalRegisterComponent implements OnInit, OnChanges {
    @Output() edit = new EventEmitter<boolean>();
    @Output() onSubmit = new EventEmitter();
    @Output() sendApproveTheRules = new EventEmitter<boolean>();
    finalForm: FormGroup;
    checkOk = false;
    data: any = null;
    form = new Form();
    elementList: Array<any> = [];
    MyToolkit = Toolkit;
    @Input() resetForm: boolean;
    @Input() end: boolean;
    actionButton = false;
    approveTheRules = new ApproveTheRules();

    constructor(fb: FormBuilder,
                private languageDataService: LanguageService,
                private cacheService: CacheService,
                private formService: FormService) {
        this.finalForm = fb.group({
            // checkOk: new FormControl(null, Validators.required),
            responder: new FormControl(null, Validators.required),
        });
    }

    ngOnInit() {
        const user: any = JSON.parse(sessionStorage.getItem('user'));
        this.form.companyId = user.orgId;
        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
        });
        this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
            if (res != null) {
                this.form = new Form();
                this.elementList = [];
                this.form = res;
                this.elementList = this.form.elementList;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.resetForm) {
            this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
                if (res != null) {
                    this.form = res;
                    this.elementList = [];
                    this.elementList = this.form.elementList;
                    this.checkOk = false;
                }
            });
        }
        if (changes.end.currentValue === true) {
            this.register();
        }
    }


    checkNecessaryItems() {
        const message: Array<string> = [];
        if (this.form.elementList.length === 0) {
            message.push(this.data.formSubmitMessages.noElement);
        }
        // if (isNullOrUndefined(this.form.totalResponder)) {
        //     message.push(this.data.formSubmitMessages.noResponder);
        // }
        if (isNullOrUndefined(this.form.title) || this.form.title === '') {
            message.push(this.data.formSubmitMessages.noTitle);

        }
        // if (isNullOrUndefined(this.form.formCategoryId)) {
        //   message.push(this.data.formSubmitMessages.noCategory);
        // }
        return message;
    }



    register() {
        this.checkOk = true;
        // this.form.isTemplate = false;
        this.actionButton = true;
        const message: Array<string> = this.checkNecessaryItems();
        if (message.length === 0 && this.checkOk) {
            this.sendApproveTheRules.emit(false);

            this.formService.create(this.form).subscribe((resForm: Form) => {
                this.sendApproveTheRules.emit(true);

                this.swalDisplay(resForm);
                this.actionButton = false;
                this.cancelCreateForm();

                this.cacheService.removeCompletelyItem('form', CacheType.SESSION_STORAGE);
                this.onSubmit.emit(resForm);
            }, error => {
                this.sendApproveTheRules.emit(true);
                this.actionButton = false;
            });
        } else {
            let displayMessage = '';
            this.actionButton = false;

            if (message.length > 0) {
                for (const m of message) {
                    if (!isNullOrUndefined(m)) {
                        displayMessage = displayMessage + '<br>' + m;
                    }
                }
            }
            if (!this.checkOk) {
                displayMessage = displayMessage + '<br>' + 'لطفا قوانین را مطالعه نموده و موافقت خود را اعلام نمایید.';
                this.actionButton = false;

            }
            DefaultNotify.notifyDanger('لطفا قوانین را مطالعه نموده و موافقت خود را اعلام نمایید.', '', NotiConfig.notifyConfig);
        }
    }

    swalDisplay(form) {
        // DefaultNotify.notifyDanger(form);
        if (form.flag) {
            DefaultNotify.notifySuccess(this.data.successfulMessages.formSubmitted, '', NotiConfig.notifyConfig);
        } else {
            DefaultNotify.notifyDanger('این فرم در فرآیند ها استفاده شده است و قابل تغییر نمی باشد.', '', NotiConfig.notifyConfig);
            // DefaultNotify.notifyDanger('خطایی رخ داده است.');
        }
    }

    responderChange(value) {
        this.form.totalResponder = value;
        this.saveOnStorage();
    }

    saveOnStorage() {
        this.cacheService.setItem('form', this.form, CacheType.SESSION_STORAGE);
    }

    // edit = false;
    mySurveyForm: Form = new Form();

    cancelCreateForm() {
        this.mySurveyForm = new Form();
        this.edit.emit(false);
    }


    sendAR() {
        setTimeout(() => {
            // لازم نیست if (this.approveTheRules.rules1 && this.approveTheRules.rules2) {
            if (this.approveTheRules.rules1) {
                this.sendApproveTheRules.emit(true);
            }
            // if (!this.approveTheRules.rules1 || !this.approveTheRules.rules2) { لازم نیست
            if (!this.approveTheRules.rules1) {
                this.sendApproveTheRules.emit(false);
            }
        }, 50)

    }

    checkedAR1(event) {
        if (event.target.checked) {
            this.approveTheRules.rules1 = true;
        } else {
            this.approveTheRules.rules1 = false;
        }
    }

    checkedAR2(event) {
        if (event.target.checked) {
            this.approveTheRules.rules2 = true;
        } else {
            this.approveTheRules.rules2 = false;
        }
    }
}

export class ApproveTheRules {
    rules1 = false;
    rules2 = false;
}


// let link: string =  'https://' + location.hostname + ':' + location.port + '/#/formComplete/' + form.id;
// swal({
//   html: this.data.successfulMessages.formSubmitted + '<br>' + link1,
//   type: 'success',
//   confirmButtonColor: '#1EE8A8',
// });
// this.cacheService.removeCompletelyItem('form', CacheType.SESSION_STORAGE);
// this.router.navigateByUrl('');
