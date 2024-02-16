import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {Form} from '../model/form';
import {ElementType} from '../model/enum/element-type';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Element} from '../model/element';
import {DateInputObject, FormData, QuestionAnswer} from '../model/formData';
import {DefaultNotify} from '@angular-boot/util';
import {isNullOrUndefined} from 'util';
import {ActivityService} from '../../activity/service/activity.service';
import {DeleteModel} from '../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from "../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-form-answer',
    templateUrl: './form-answer.component.html',
    styleUrls: ['./form-answer.component.scss']
})
export class FormAnswerComponent implements OnInit, AfterViewInit, OnChanges {


    constructor(private activityService: ActivityService) {
    }

    @Input() form: Form = new Form();
    @Input() formData: FormData;
    @Input() disabledFiled: boolean;
    @Input() instanceId: string;
    @Input() activityLevelId: string;
    @Input() isView: boolean;
    @Input() back: boolean;
    @Output() backOut = new EventEmitter<boolean>();

    htmlForm: FormGroup;

    dateInputObjectList: DateInputObject[] = [];
    dateInputObjectListCopy: DateInputObject[] = [];

    loadingSubmit = false;

    selectedItemForOnDestroy = new DeleteModel();

    ngOnInit(): void {


        this.creatForm();
        this.selectedItemForOnDestroy.id = this.form.id;
        this.selectedItemForOnDestroy.title = ' آیا تغییرات     ' + this.form.title + ' ذخیره   شود؟ ';
    }

    creatForm() {
        this.htmlForm = new FormGroup({});
        let isFormData = false;
        if (this.formData) {
            isFormData = true;
        } else {
            this.formData = new FormData();
            isFormData = false;
        }
        for (const element of this.form.newElementList) {

            this.creatFormByElement(element, isFormData);
        }
    }

    creatFormByElement(element: Element, isFormData) {
        console.log(element);

        if (isFormData) {
            if (element.newElementType === ElementType.TIME) {
                const hour = this.formData.answerList.find(answer => answer.questionId === element.id).answerIdList[0].hour;
                const min = this.formData.answerList.find(answer => answer.questionId === element.id).answerIdList[0].min;
                const name = element.newElementType + '*' + element.id + '*';
                if (element.required) {
                    this.htmlForm.addControl(name + 'min', new FormControl(min, Validators.required));
                    this.htmlForm.addControl(name + 'hour', new FormControl(hour, Validators.required));
                } else {
                    this.htmlForm.addControl(name + 'min', new FormControl(min));
                    this.htmlForm.addControl(name + 'hour', new FormControl(hour));

                }
            } else if (element.newElementType === ElementType.CHECK_BOX) {
                for (const option of element.newOptionList) {
                    const value = this.formData.answerList.find(answer =>
                        answer.questionId === element.id).answerIdList.some(id => id === option.id);
                    const name = element.newElementType + '*' + element.id + '*' + option.id;

                    this.htmlForm.addControl(name, new FormControl(value));
                }

            } else {
                const value = this.formData.answerList.find(answer => answer.questionId === element.id).answerIdList[0];
                const name = element.newElementType + '*' + element.id;

                if (element.required) {
                    this.htmlForm.addControl(name, new FormControl(value, Validators.required));
                } else {
                    this.htmlForm.addControl(name, new FormControl(value));

                }
                if (element.newElementType === ElementType.DATE) {
                    const newDateInputObject = new DateInputObject();
                    newDateInputObject.id = element.id;
                    newDateInputObject.date = value;
                    if (!this.dateInputObjectList.some(e => e.id === newDateInputObject.id)) {
                        this.dateInputObjectList.push(newDateInputObject);
                    }
                }
            }
        } else {
            if (element.newElementType === ElementType.TIME) {
                const name = element.newElementType + '*' + element.id + '*';

                if (element.required) {
                    this.htmlForm.addControl(name + 'min', new FormControl(null, Validators.required));
                    this.htmlForm.addControl(name + 'hour', new FormControl(null, Validators.required));
                } else {
                    this.htmlForm.addControl(name + 'min', new FormControl(null));
                    this.htmlForm.addControl(name + 'hour', new FormControl(null));

                }
            } else if (element.newElementType === ElementType.CHECK_BOX) {
                for (const option of element.newOptionList) {
                    const name = element.newElementType + '*' + element.id + '*' + option.id;
                    this.htmlForm.addControl(name, new FormControl(false));
                }

            } else {
                const name = element.newElementType + '*' + element.id;

                if (element.required) {
                    this.htmlForm.addControl(name, new FormControl(null, Validators.required));
                } else {
                    this.htmlForm.addControl(name, new FormControl(null));

                }

            }

        }
        this.dateInputObjectListCopy = JSON.parse(JSON.stringify(this.dateInputObjectList));
        if (this.disabledFiled || this.isView) {
            this.htmlForm.disable();
        }


    }


    ngAfterViewInit(): void {

        for (const element of this.form.newElementList) {
            if (element.newElementType === ElementType.DATE) {
                const newDateInputObject = new DateInputObject();
                newDateInputObject.id = element.id;
                newDateInputObject.date = null;
                if (!this.dateInputObjectList.some(e => e.id === newDateInputObject.id)) {
                    this.dateInputObjectList.push(newDateInputObject);
                }
                this.setDateJquery(element);

            }
        }
        this.dateInputObjectListCopy = JSON.parse(JSON.stringify(this.dateInputObjectList));

    }

    setDateJquery(element: Element) {
        setTimeout(e1 => {
            $('#inputDate' + element.id + this.form.id).azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector:$( '#inputDate' + element.id + this.form.id),
            }).on('change', (e) => {
                const val = $(e.currentTarget).val();
                const index = this.dateInputObjectList.findIndex(d => d.id === element.id);
                if (index !== -1) {
                    this.dateInputObjectList[index].date = val;
                }
                // $('#inputDate' + element.id).val(val).trigger('change');
                console.log(e);
            });

        }, 100);

    }

    onSubmitForm() {

        if (!this.htmlForm.dirty && JSON.stringify(this.dateInputObjectList) === JSON.stringify(this.dateInputObjectListCopy)) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.loadingSubmit) {
            return;
        }
        this.loadingSubmit = true;

        const formData = new FormData();
        formData.formId = this.form.id;
        formData.answerList = [];
        for (const element of this.form.newElementList) {
            const questionAnswer = new QuestionAnswer();
            questionAnswer.questionId = element.id;
            questionAnswer.questionElementType = element.newElementType;
            questionAnswer.answerIdList = [];
            if (element.newElementType === ElementType.TIME) {
                const hour = this.htmlForm.controls[element.newElementType + '*' + element.id + '*' + 'hour'].value;
                const min = this.htmlForm.controls[element.newElementType + '*' + element.id + '*' + 'min'].value;
                if (element.required) {
                    if (!hour) {
                        DefaultNotify.notifyDanger(' ساعت برای ' + element.questionTitle + ' وارد شود.  ', '', NotiConfig.notifyConfig);
                        this.loadingSubmit = false;
                        return;
                    }
                    if (!min) {
                        DefaultNotify.notifyDanger(' دقیقه برای  ' + element.questionTitle + 'وارد شود. ', '', NotiConfig.notifyConfig);
                        this.loadingSubmit = false;
                        return;
                    }
                }
                const answerTime = {
                    hour,
                    min
                };
                if (answerTime.hour > 23 || answerTime.hour < 0) {
                    DefaultNotify.notifyDanger(' ساعت برای ' + element.questionTitle + ' صحیح وارد شود.  ', '', NotiConfig.notifyConfig);
                    this.loadingSubmit = false;
                    return;

                }
                if (answerTime.min > 59 || answerTime.min < 0) {
                    DefaultNotify.notifyDanger(' دقیقه برای ' + element.questionTitle + ' صحیح وارد شود.  ', '', NotiConfig.notifyConfig);
                    this.loadingSubmit = false;
                    return;

                }
                questionAnswer.answerIdList.push(answerTime);
            } else if (element.newElementType === ElementType.CHECK_BOX) {
                const selectedList = [];
                for (const option of element.newOptionList) {
                    const value = this.htmlForm.controls[element.newElementType + '*' + element.id + '*' + option.id].value;
                    if (value === true) {
                        selectedList.push(option.id);
                    }
                }
                if (element.required && selectedList.length === 0) {
                    DefaultNotify.notifyDanger(' گزینه ای  برای ' + element.questionTitle + ' انتخاب  شود. ', '', NotiConfig.notifyConfig);

                    this.loadingSubmit = false;
                    return;
                }
                if (element.maxItemSelectable < selectedList.length) {
                    DefaultNotify.notifyDanger('   گزینه های انتخاب شده  برای ' + element.questionTitle + '  بیشتر از حد مجاز است.', '', NotiConfig.notifyConfig);

                    this.loadingSubmit = false;
                    return;
                }
                if (element.minItemSelectable > selectedList.length) {
                    DefaultNotify.notifyDanger('  گزینه های انتخاب شده  برای ' + element.questionTitle + '  کمتر از حد مجاز است. ', '', NotiConfig.notifyConfig);

                    this.loadingSubmit = false;
                    return;
                }

                questionAnswer.answerIdList = selectedList;
                // if (element.required) {
                //     this.htmlForm.addControl(element.newElementType +'_ +element.id, new FormControl(null, Validators.required));
                // } else {
                //
                // }
            } else if (element.newElementType === ElementType.DATE) {
                const value = this.dateInputObjectList.find(d => d.id === element.id).date;
                if (element.required) {
                    if (!value) {
                        DefaultNotify.notifyDanger(' تاریخ برای   ' + element.questionTitle + ' وارد شود. ', '', NotiConfig.notifyConfig);
                        this.loadingSubmit = false;
                        return;
                    }
                }
                if (value) {
                    questionAnswer.answerIdList.push(value);
                }

            } else {
                const value = this.htmlForm.controls[element.newElementType + '*' + element.id].value;
                if (element.required) {
                    if (isNullOrUndefined(value)) {
                        DefaultNotify.notifyDanger('   مقدار برای ' + element.questionTitle + ' وارد شود.  ', '', NotiConfig.notifyConfig);
                        this.loadingSubmit = false;
                        return;
                    }
                }
                if (value) {
                    questionAnswer.answerIdList.push(value);
                }


            }
            formData.answerList.push(questionAnswer);

        }

        this.activityService.saveFormDataAndPutInAssociatedActivityLevel({
            activityInstanceId: this.instanceId,
            activityLevelId: this.activityLevelId
        }, formData).subscribe((res: any) => {
            this.loadingSubmit = false;


            if (res != null) {
                DefaultNotify.notifySuccess('با موفقیت ذخیره شد.', '', NotiConfig.notifyConfig);
                this.formData = JSON.parse(JSON.stringify(formData));
                this.creatForm();

                //     // =================================================================
                //     if ((!this.existedAlreadySaveForWAR)) {
                //         this.workOrderRepositoryService.createFormAndFormData(this.formAndformData, {
                //             activityInstanceId: this.instanceId, activityLevelId: this.activityLevelId,
                //             numberOfParticipation: this.numberOfParticipation
                //         })
                //             .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                //             if (resOne) {
                //                 console.log('resOne', resOne);
                //                 DataService.setExistedAlreadySaveForWAR(true);
                //                 this.workOrderAndFormRepository.id = resOne;
                //             }
                //         });
                //     } else if (this.existedAlreadySaveForWAR) {
                //         this.workOrderRepositoryService.updateFormAndFormData(this.formAndformData, {
                //             activityInstanceId: this.instanceId, activityLevelId: this.activityLevelId,
                //             numberOfParticipation: this.numberOfParticipation
                //         })
                //             .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                //             if (resTow) {
                //                 console.log('res==>', resTow);
                //             }
                //         });
                //     }
                // =================================================================
            }
        }, error => {
            this.loadingSubmit = false;
        });

        //
        // setTimeout(e => {
        //     this.loadingSubmit = false;
        //
        //     console.log('formData', formData);
        //     sessionStorage.setItem('formData', JSON.stringify(formData));
        //     this.formDataCopy = JSON.parse(JSON.stringify(formData));
        //
        //     console.log(this.htmlForm);
        //     DefaultNotify.notifySuccess('با موفقیت ذخیره شد.');
        // }, 2000);

    }

    confirm(event) {
        if (event) {
            this.onSubmitForm();
        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForOnDestroy.id);
        }
        setTimeout(e => {
            this.backOut.emit(true);
        }, 500);
    }

    test() {
        ModalUtil.showModal('modalId' + this.selectedItemForOnDestroy.id);

    }

    ngOnChanges(): void {
        console.log(this.back);
        if (this.back && !this.disabledFiled) {
            if (this.htmlForm.dirty) {
                ModalUtil.showModal('modalId' + this.selectedItemForOnDestroy.id);
            } else {
                this.backOut.emit(true);
            }
        }
    }

    // ngOnDestroy(): void {
    //     if (this.htmlForm.dirty) {
    //         ModalUtil.showModal('modalId' + this.selectedItemForOnDestroy.id);
    //     }
    // }
}
