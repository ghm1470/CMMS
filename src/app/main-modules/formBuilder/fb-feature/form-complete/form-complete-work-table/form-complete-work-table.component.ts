import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../fb-model/form/form-data';
import {Form, FormAndFormData} from '../../../fb-model/form/form';
import {ElementType} from '../../../fb-model/enumeration/element-type';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {Attachment} from '../../../shared/model/file/Attachment';
import {Toolkit} from '../../../shared/utility/toolkit';
import {DefaultNotify, Toolkit2} from '@angular-boot/util';
import {FormService} from '../../../fb-service/form.service';
import {CacheService} from '../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {FormDataService} from '../../../fb-service/form-data.service';
import {DataService} from '../../../../../shared/service/data.service';
import {Router} from '@angular/router';
import {ActivityService} from '../../../../activity/service/activity.service';
import {WorkOrderRepositoryService} from '../../../../workOrder/endpoint/work-order-repository.service';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Matrix} from '../../../fb-model/element/matrix';
import {TimeModel} from '../../../fb-model/element/time';
import * as moment from 'jalali-moment';
import {NumberTools} from '../../../shared/language-data-service/numberTools';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
import {WorkTableDto} from '../../../../worktable/model/workTable';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyPattern} from "../../../../../shared/shared/tools/myPattern";

declare var $: any;

@Component({
    selector: 'app-form-complete-work-table',
    templateUrl: './form-complete-work-table.component.html',
    styleUrls: ['./form-complete-work-table.component.scss']
})
export class FormCompleteWorkTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    user: UserDto.Create = new UserDto.Create();

    @Input() nextItem: boolean;
    @Input() activitySampleForm: any;
    @Input() formId: string;
    @Input() formStatus: string;
    @Input() activityLevelId: string;
    @Input() isView: boolean;
    @Input() activityInstanceId: string;
    @Input() instanceId: string;
    @Input() numberOfParticipation: number;
    @Input() incomingFormId: string;
    @Input() formDataId: string;
    @Input() hasWorkOrder: boolean;
    @Input() showSaveButton: boolean;
    @Output() nextCarousel = new EventEmitter<boolean>();
    @Output() sendFormTitle = new EventEmitter<string>();
    // @Output() receiveFormData = new EventEmitter<boolean>();
    @Input() formData = new FormData();
    existedAlreadySaveForWAR: boolean;
    answer = new QuestionAnswer();
    workOrderAndFormRepository = new WorkTableDto.ActivitySampleWorkOrderAndFormRepository();
    finalLevel = true;
    listDisplay: Array<any> = []; // لیست سوالاتی که باید نمایش داده شود. (حذف زیر سوالات از سوالات)
    form = new Form();
    list: Array<any> = []; // لیست سوالات فرم
    check: Array<any> = []; // جواب سوالات چک باکس در این آرایه ریخته می شود. به دلیل اینکه ممکن است چند سوال چک باکس داشته باشیم
    combo: Array<any> = []; // برای گرفتن مقادیر کمبوباکس استفاده می شود دلیل استفاده هم این است که کمبو باکس چند انتخابی داریم.
    matrix: Array<any> = []; //  برای نگهداشتن جواب های سوالات ماتریس. جواب سوال i ام در خانه i ام این ماتریس
    slider: Array<any> = []; // کتابخانه ای که استفاده کرده ایم مقدار را فقط با ngModel میگیرد. بخاطر همین مجبوریم آرایه بگیریم
    errorMessages: Array<string> = [];  // برای نشان دادن پیغام های خطا
    MyElementType = ElementType;
    selectedLanguage: string;
    isRtl = true;
    data: any = null;
    url: string;
    MyImageStatus = ImageStatus;
    public mask = [/\d/, /\d/, ':', /\d/, /\d/];
    image = new Image();
    attachmentList: Array<Attachment> = [];
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;
    loading = false;
    incomingFormData: FormData;
    formAndformData = new FormAndFormData();

    limit = true;
    formComplete: FormGroup;
    myPattern = MyPattern;

    constructor(private formService: FormService,
                private cacheService: CacheService,
                private languageDataService: LanguageService,
                private formDataService: FormDataService,
                private dataService: DataService,
                private router: Router,
                fb: FormBuilder,
                private activityService: ActivityService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                renderer: Renderer2) {
        languageDataService.renderer = renderer;
        this.url = this.formService._ServiceConfig.getUrl();
        this.user = JSON.parse(sessionStorage.getItem('user'));

        this.formComplete = fb.group({
            textField: [null],
            email: [null],
            number: [null],
            password: [null],
            radio: [null],
            textArea: [null],
            combo: [null],
            checkBox: [null],
            content: [null],
            date: [null],
            time: [null],
            slider: [null]
        });
    }

    enableItems = false;

    ngOnInit() {
        if (this.formId === this.activitySampleForm.form.id) {
            this.enableItems = true;
        }
        console.log(' this.enableItems', this.enableItems)
        console.log(' this.activitySampleForm.form.title', this.activitySampleForm.form.title)
        console.log(' this.formData', this.formData)
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        this.form.elementList = [];
        // this.formData.answerList = [];
        // this.formData.formId = this.incomingFormId;

        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
        });
        this.languageDataService.getLanguageData().subscribe(res => {
            this.data = res;
        });
        this.setForm();
// ====================فقط از ای سرویس به صورت گت استفاده شده وجایی ست نشده است ===

        this.dataService.gettingFormRegister.subscribe((res: boolean) => {
            if (res) {
                // this.register();
            }
        });
        // ========================
    }

    ngAfterViewInit(): void {
        if (this.formStatus !== 'pending') {
            $('input').attr('disabled', 'disabled');
            $('select').attr('disabled', 'disabled');
        }
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.formData.formId = this.incomingFormId;
        if (changes.hasOwnProperty('incomingFormId')) {
            // this.getForm();
            // this.setForm();
        }
    }

    test() {
        console.log(' this.formData', this.formData)
        console.log(' this.list', this.list)
        console.log(' this.listDisplay', this.listDisplay)
    }

    setForm() {
        if (this.activitySampleForm) {
            this.loading = false;
            this.form = new Form();
            this.form = this.activitySampleForm.form;
            this.formData = this.activitySampleForm.formData;
            // if (this.activitySampleForm.form) {
            //     if (this.activitySampleForm.form.title) {
            //         this.sendFormTitle.emit(this.activitySampleForm.form.title);
            //     }
            // }
            // =================پر کردن this.incomingFormData======
            if (!isNullOrUndefined(this.formData)) {
                this.incomingFormData = JSON.parse(JSON.stringify(this.formData));
                const h = this.incomingFormData.answerList.length;
                for (let i = 0; i < h; i++) {
                    this.answer = new QuestionAnswer();
                    this.answer = JSON.parse(JSON.stringify(this.formData.answerList[i]));
                    this.incomingFormData.answerList[i] = JSON.parse(JSON.stringify(this.answer));
                }
            }
            console.log('  this.incomingFormData', this.incomingFormData)
            // ========================================
            this.list = [];
            this.listDisplay = [];
            if (this.form) {
                if (this.form.elementList) {
                    this.list = this.form.elementList;
                }
            }
            if (this.incomingFormData != null && this.incomingFormId !== this.incomingFormData.formId) {
                this.incomingFormData = null;
            }
            this.prepareVariables();
            if (this.incomingFormData != null && this.incomingFormId === this.incomingFormData.formId) {
                console.log(this.incomingFormData);
                // this.formData = JSON.parse(JSON.stringify(this.incomingFormData));
            }
            // this.formData.formId = this.incomingFormId;
            // this.workOrderAndFormRepository.form = this.form;
            // this.workOrderAndFormRepository.formData = this.formData;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            setTimeout(() => {
                for (let i = 0; i < this.listDisplay.length; i++) {
                    if (this.listDisplay[i].elementType === 'DATE') {
                        $(document).ready(() => {
                            $('#inputDate' + i).azPersianDateTimePicker({
                                Placement: 'right',
                                Trigger: 'click',
                                EnableTimePicker: false,
                                TargetSelector: '#inputDate' + i,
                                GroupId: '',
                                ToDate: false,
                                FromDate: false,
                                DisableBeforeToday: false,
                                Disabled: false,
                                Format: 'yyyy/MM/dd',
                                IsGregorian: false,
                            });

                            $('#inputDateMiladi' + i).azPersianDateTimePicker({
                                Placement: 'right',
                                Trigger: 'click',
                                EnableTimePicker: false,
                                TargetSelector: '#inputDateMiladi' + i,
                                GroupId: '',
                                ToDate: false,
                                FromDate: false,
                                DisableBeforeToday: false,
                                Disabled: false,
                                Format: 'yyyy/MM/dd',
                                IsGregorian: true,
                            });
                        });

                    }
                }

            }, 1000);
        }
    }

    getForm() {
        console.log(this.formStatus, 'sssww');
        this.loading = true;
        this.activityService.getFormByActivityLevelIdAndInstanceId(
            {
                instanceId: this.instanceId,
                activityLevelId: this.activityLevelId,
            }).pipe(takeUntilDestroyed(this))
            .subscribe((res: GetFormDate) => {
                if (res) {
                    this.loading = false;
                    this.form = new Form();
                    this.form = res.form;
                    if (res.form) {
                        if (res.form.title) {
                            this.sendFormTitle.emit(res.form.title);
                        }
                    }
                    // =================پر کردن this.incomingFormData======
                    if (!isNullOrUndefined(res.formData)) {
                        this.incomingFormData = JSON.parse(JSON.stringify(res.formData));
                        const h = res.formData.answerList.length;
                        for (let i = 0; i < h; i++) {
                            this.answer = new QuestionAnswer();
                            this.answer = JSON.parse(JSON.stringify(res.formData.answerList[i]));
                            this.incomingFormData.answerList[i] = JSON.parse(JSON.stringify(this.answer));
                        }
                    }
                    // ========================================
                    this.list = [];
                    this.listDisplay = [];
                    if (this.form) {
                        if (this.form.elementList) {
                            this.list = this.form.elementList;
                        }
                    }
                    if (this.incomingFormData != null && this.incomingFormId !== this.incomingFormData.formId) {
                        this.incomingFormData = null;
                    }
                    this.prepareVariables();
                    if (this.incomingFormData != null && this.incomingFormId === this.incomingFormData.formId) {
                        console.log(this.incomingFormData);
                        // this.formData = JSON.parse(JSON.stringify(this.incomingFormData));
                    }
                    // this.formData.formId = this.incomingFormId;
                    // this.workOrderAndFormRepository.form = this.form;
                    // this.workOrderAndFormRepository.formData = this.formData;
                    // DataService.setWAFRepository(this.workOrderAndFormRepository);
                    setTimeout(() => {
                        for (let i = 0; i < this.listDisplay.length; i++) {
                            if (this.listDisplay[i].elementType === 'DATE') {
                                $(document).ready(() => {
                                    $('#inputDate' + i).azPersianDateTimePicker({
                                        Placement: 'right',
                                        Trigger: 'click',
                                        EnableTimePicker: false,
                                        TargetSelector: '#inputDate' + i,
                                        GroupId: '',
                                        ToDate: false,
                                        FromDate: false,
                                        DisableBeforeToday: false,
                                        Disabled: false,
                                        Format: 'yyyy/MM/dd',
                                        IsGregorian: false,
                                    });

                                    $('#inputDateMiladi' + i).azPersianDateTimePicker({
                                        Placement: 'right',
                                        Trigger: 'click',
                                        EnableTimePicker: false,
                                        TargetSelector: '#inputDateMiladi' + i,
                                        GroupId: '',
                                        ToDate: false,
                                        FromDate: false,
                                        DisableBeforeToday: false,
                                        Disabled: false,
                                        Format: 'yyyy/MM/dd',
                                        IsGregorian: true,
                                    });
                                });

                            }
                        }

                    }, 1000);
                } else {
                    this.loading = false;
                }
            });
    }


    prepareVariables() {
        if (!this.formData) {
            console.log('incomingFormData*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', this.incomingFormData)
            this.formData = new FormData();

            for (let i = 0; i < this.list.length; i++) {
                console.log('this.list', this.list[i])
                this.check[i] = [];
                this.combo[i] = [];
                this.slider[i] = '';
                this.errorMessages[i] = '';
                this.formData.answerList[i] = null;
                if (this.list[i].elementType === 'TEXT_FIELD') {
                    this.formData.answerList[i] = new QuestionAnswer();
                    // this.formData.answerList[i].answerIdList = [''];
                }
                // TODO item.textFieldType==='EMAIL'" hز سرور نمیاد

                console.log('this.list', this.list[i])
                console.log('this.formData.answerList', this.formData.answerList[i])

                if (this.list[i].parentElement.elementId === '0') {
                    this.list[i].index = i;
                    if (!this.listDisplay.some(e => e.id === this.list[i].id)) {
                        this.listDisplay.push(this.list[i]);
                    }
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.CHECK_BOX) {
                    this.check[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.COMBO_BOX) {
                    this.check[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.NUMERICAL) {
                    this.slider[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.MATRIX) {
                    this.matrix[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData == null && this.list[i].elementType === ElementType.MATRIX) {
                    let matrixElement = new Matrix();
                    matrixElement = this.list[i] as Matrix;
                    const matrixValues2: Array<any> = [];
                    for (let j = 0; j < matrixElement.matrixQuestionList.length; j++) {
                        matrixValues2[j] = new MatrixAnswer();
                    }
                    this.matrix[i] = matrixValues2;
                }
            }

        } else if (this.formData) {

            for (let i = 0; i < this.list.length; i++) {
                // $('#dateInput').val(item.propertyCategoryId).trigger('change');
                console.log('formData.answerList[i]', this.formData.answerList[i])
                // if (this.formData.answerList[i].questionElementType === 'TIME') {
                //     if (this.formData.answerList[i].answerIdList.length>0) {
                //         const val = this.formData.answerList[i].answerIdList[0].hour + ':' + this.formData.answerList[i].answerIdList[0].minute;
                //         $('.dateInput').val(val).trigger('change');
                //     }
                // }
                this.check[i] = [];
                this.combo[i] = [];
                this.slider[i] = '';
                this.errorMessages[i] = '';
                // this.formData.answerList[i] = null;

                if (this.list[i].parentElement.elementId === '0') {
                    this.list[i].index = i;
                    if (!this.listDisplay.some(e => e.id === this.list[i].id)) {
                        console.log('this.list[i]', this.list[i])

                        this.listDisplay.push(this.list[i]);
                    }
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.CHECK_BOX) {
                    this.check[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.COMBO_BOX) {
                    this.check[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.NUMERICAL) {
                    this.slider[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData != null && this.list[i].elementType === ElementType.MATRIX) {
                    this.matrix[i] = this.incomingFormData.answerList[i].answerIdList;
                }

                if (this.incomingFormData == null && this.list[i].elementType === ElementType.MATRIX) {
                    let matrixElement = new Matrix();
                    matrixElement = this.list[i] as Matrix;
                    const matrixValues2: Array<any> = [];
                    for (let j = 0; j < matrixElement.matrixQuestionList.length; j++) {
                        matrixValues2[j] = new MatrixAnswer();
                    }
                    this.matrix[i] = matrixValues2;
                }
            }


        }
    }


    showDate(i) {
        $(document).ready(() => {
            $('#date' + i).azPersianDateTimePicker({
                Placement: 'left',
                Trigger: 'click',
                EnableTimePicker: false,
                TargetSelector: '#inputDate' + i,
                GroupId: '',
                ToDate: false,
                FromDate: false,
                DisableBeforeToday: false,
                Disabled: false,
                Format: 'yyyy/MM/dd',
                IsGregorian: false,
            });
        });
    }

    showDateGregorian(i) {
        $(document).ready(() => {
            $('#dateMiladi' + i).azPersianDateTimePicker({
                Placement: 'left',
                Trigger: 'click',
                EnableTimePicker: false,
                TargetSelector: '#inputDateMiladi' + i,
                GroupId: '',
                ToDate: false,
                FromDate: false,
                DisableBeforeToday: false,
                Disabled: false,
                Format: 'yyyy/MM/dd',
                IsGregorian: true,
            });
        });
    }

    onChangeElementAnswer(event, item, i, elementType, q?) {
        const answer = new QuestionAnswer();
        console.log('elementType', elementType)
        console.log('q', q)
        // if (elementType === ElementType.RADIO_BUTTON) {
        //     $('#' + q).addClass('show');
        // }
        switch (elementType) {
            case ElementType.NUMERICAL:
                answer.answerIdList[0] = this.slider[i];
                break;
            case ElementType.TIME:
                const splitTime = event.split(':');
                const getTime = new TimeModel();
                getTime.hour = parseInt(splitTime[0]);
                getTime.minute = parseInt(splitTime[1]);
                answer.answerIdList[0] = getTime;
                break;
            case ElementType.DATE:
                if (this.isRtl) {
                    const date = moment(Toolkit.Fa2En(event + '-00:00'), 'jYYYY/jMM/jDD-HH:mm');
                    const dateAnswer = date.toISOString();
                    answer.answerIdList[0] = dateAnswer;
                } else {
                    answer.answerIdList[0] = event + '00:00';
                }
                break;
            case 'COMBO_MULTIPLE':
                answer.answerIdList = this.combo[i];
                break;
            default:
                answer.answerIdList[0] = event.target.value;
                break;
        }
        answer.questionId = item.id;
        answer.questionElementType = item.elementType;
        this.formData.answerList[i] = answer;
        this.errorMessages[i] = '';
    }

    onChangeCheck(event, id, index, item) {
        if (!this.formData.answerList[index]) {
            this.formData.answerList[index] = new QuestionAnswer();
            this.formData.answerList[index].questionId = item.id;
            this.formData.answerList[index].questionElementType = item.elementType;
        }
        // if (!isNullOrUndefined(this.formData.answerList[index])) {
        //     this.incomingFormData = JSON.parse(JSON.stringify(this.formData));
        //     const h = this.incomingFormData.answerList.length;
        //     for (let i = 0; i < h; i++) {
        //         this.answer = new QuestionAnswer();
        //         this.answer = JSON.parse(JSON.stringify(this.formData.answerList[i]));
        //         this.incomingFormData.answerList[i] = JSON.parse(JSON.stringify(this.answer));
        //     }
        // }
        if (event) {
            if (!this.formData.answerList[index].answerIdList.some(e => e === id)) {
                this.formData.answerList[index].answerIdList.push(id);
            }
        } else {
            const index2 = this.formData.answerList[index].answerIdList.findIndex(e => e === id);
            if (index2 !== -1) {
                this.formData.answerList[index].answerIdList.splice(index2, 1);
            }
        }
        console.log(event);
        console.log(this.formData.answerList);
        console.log(id);

    }

    onChangeCheck1(event: string, item, i) {
        console.log(event);
        console.log(this.formData.answerList);
        console.log(i);

        console.log(this.formData.answerList[i]);
        const answerCheck = new QuestionAnswer();
        answerCheck.questionId = item.id;
        answerCheck.questionElementType = item.elementType;
        const index = this.check[i].indexOf(event);
        // Is currently selected
        if (index !== -1) {
            this.check[i].push(event);
        } else {
            this.check[i].splice(index, 1);
        }
        answerCheck.answerIdList = this.check[i];
        this.formData.answerList[i] = answerCheck;
        this.errorMessages[i] = '';
    }

    getChecked(item, ch) {

        // console.log('-----------------------------------------------------------')
        // console.log('item', item)
        // console.log('item.index', item.index)
        // console.log('ch', ch)
        // console.log('this.formData', this.formData)
        // console.log('-----------------------------------------------------------')
        if (this.formData.answerList[item.index]) {
            return this.formData.answerList[item.index].answerIdList.some(e => e === ch.id);
        }

    }


    // onChangeMatrix(value, item, itemIndex, qIndex, multiSelect, question) {
    //   const answerMatrix = new QuestionAnswer();
    //   answerMatrix.questionId = item.id;
    //   answerMatrix.questionElementType = item.elementType;
    //   let array: Array<any> = [];
    //   for (let j = 0; j < item.matrixQuestionList.length; j++) {
    //     array[j] = new MatrixAnswer();
    //   }
    //   console.log(this.matrix[itemIndex]);
    //   array = this.matrix[itemIndex];
    //   let array2: Array<string> = [];
    //   array2 = array[qIndex].matrixValueList;
    //   if (multiSelect === true) {
    //     array[qIndex].question = question;
    //     const index = array2.indexOf(value);
    //     // Is currently selected
    //     if (index > -1) {
    //       // let array2 = array[qIndex];
    //       array2.splice(index, 1);
    //       array[qIndex].matrixValues = array2;
    //     } else {
    //       array2.push(value);
    //       array[qIndex].matrixValues = array2;
    //     }
    //   } else {
    //     array[qIndex].question = question;
    //     array[qIndex].matrixValueList[0] = value;
    //   }
    //   this.matrix[itemIndex] = array;
    //   answerMatrix.answerIdList = this.matrix[itemIndex];
    //   this.formData.answerList[itemIndex] = answerMatrix;
    //   this.errorMessages[itemIndex] = '';
    // }

    // onChangeStarRating = ($event: IStarRatingOnRatingChangeEven, item, index) => {
    //   const answerStar = new QuestionAnswer();
    //   answerStar.questionId = item.id;
    //   answerStar.questionElementType = item.elementType;
    //   answerStar.answerIdList[0] = $event.rating;
    //   this.formData.answerList[index] = answerStar;
    //   this.errorMessages[index] = '';
    // }

    setAttachments(event, item, index, limit) {
        const answerAttach = new QuestionAnswer();
        answerAttach.questionId = item.id;
        answerAttach.questionElementType = item.elementType;
        answerAttach.answerIdList = event;
        this.formData.answerList[index] = answerAttach;
        this.errorMessages[index] = '';
    }

    setImage(event, item, index) {
        const answerImage = new QuestionAnswer();
        answerImage.questionId = item.id;
        answerImage.questionElementType = item.elementType;
        console.log(item.fileCountLimitation);
        if (item.fileCountLimitation === 1) {
            answerImage.answerIdList[0] = event;
        } else {
            answerImage.answerIdList = event;

        }
        this.formData.answerList[index] = answerImage;
        this.errorMessages[index] = '';
    }

    checkAnswersFilled(index) {
        if (!isNullOrUndefined(this.formData.answerList[index])) {
        }
        console.log(this.formData.answerList[index]);
    }

    fillAnswer(event) {
        const andis: number = event.index;
        const javab = new QuestionAnswer();
        javab.answerIdList = event.returnAnswer.answerIdList;
        javab.questionElementType = event.returnAnswer.questionElementType;
        javab.questionId = event.returnAnswer.questionId;
        this.formData.answerList[andis] = javab;
    }

    hideCollapse(questionIndex, option, q) {
        let found = false;

        if (this.formData.answerList[questionIndex] !== null) {
            if (this.formData.answerList[questionIndex].answerIdList !== null) {
                for (const item of this.formData.answerList[questionIndex].answerIdList) {

                    if (item === option.id) {
                        // return true;
                        found = true;
                        break;
                    } else {
                        found = false;
                    }
                }
                // if (found === true) {
                //     return true;
                // }
                // if (found === false) {
                //     return false;
                // }
                if (found === true) {
                    $('#' + q).addClass('show');
                }
                return found;

            } else {
                return false;
            }
        } else {
            return false;

        }
    }

    findPlace(questionId) {
        let k;
        for (k = 0; k < this.list.length; k++) {
            if (this.list[k].id === questionId) {
                break;
            }
        }
        return k;
    }

    deleteUnselectedAnswers(question) {
        // console.log(question);
        let found = false;
        if (question.parentElement.elementId !== '0') {
            const k = this.findPlace(question.parentElement.elementId);
            if (this.formData.answerList[k] != null) {
                for (const selected of this.formData.answerList[k].answerIdList) {
                    if (selected === question.parentElement.optionId) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    const j = this.findPlace(question.id);
                    this.formData.answerList[j] = null;
                }
                if (found === true) {
                    return this.deleteUnselectedAnswers(this.list[k]);
                }
            }
            if (this.formData.answerList[k] === null) {
                const j = this.findPlace(question.id);
                this.formData.answerList[j] = null;
            }
        }
    }

    checkAnswersAreValid() {
        console.log(this.formData);
        let result = true;
        for (let i = 0; i < this.list.length; i++) {
            if (this.errorMessages[i] !== '') {
                this.errorMessages[i] = '';
            }
            if (this.list[i].required && this.formData.answerList[i].answerIdList.length === 0) {
                this.errorMessages[i] = this.data.errorMessages.answerRequired;
                result = false;
            }
            if (this.formData.answerList[i].answerIdList.length > 0) {
                switch (this.list[i].elementType) {
                    case ElementType.TEXT_FIELD:
                        if (this.formData.answerList[i].answerIdList[0] === '') {
                            this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.wordsOnly;
                            result = false;
                        }
                        if (this.formData.answerList[i].answerIdList[0]) {
                            if (this.list[i].minLength > this.formData.answerList[i].answerIdList[0].length) {
                                this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.minimumCharacter + this.list[i].minLength
                                    + '   -   ' + this.data.errorMessages.maximumCharacter + this.list[i].maxLength;
                                result = false;
                            }
                        }
                        break;
                    case ElementType.TEXT_AREA:
                        if (this.formData.answerList[i].answerIdList[0] === '') {
                            this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.wordsOnly;
                            result = false;
                        }
                        break;
                    case ElementType.CHECK_BOX:
                        if (this.list[i].maxItemSelectable < this.formData.answerList[i].answerIdList.length
                            || this.list[i].minItemSelectable > this.formData.answerList[i].answerIdList.length) {
                            this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.minimumOption + this.list[i].minItemSelectable
                                + '    -    ' + this.data.errorMessages.maximumOption + this.list[i].maxItemSelectable;
                            result = false;
                        }
                        break;
                    case ElementType.DATE:
                        if (!isNullOrUndefined(this.list[i].startDate) && !isNullOrUndefined(this.formData.answerList[i].answerIdList[0])) {
                            const startStr = Toolkit2.Moment.getJaliliDateFromIsoOrFull(this.list[i].startDate);
                            const end = Toolkit2.Moment.getJaliliDateFromIsoOrFull(this.formData.answerList[i].answerIdList[0]);
                            const compareResult = Toolkit.compareMomentDate(startStr, end);
                            if (compareResult[4]) {
                                this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.startDateShould + startStr.slice(0, 10) +
                                    this.data.errorMessages.greaterThan;
                                result = false;
                            }
                        }
                        if (!isNullOrUndefined(this.list[i].endDate) && !isNullOrUndefined(this.formData.answerList[i].answerIdList[0])) {
                            const compareResult = Toolkit.CompareDate(this.list[i].endDate, this.formData.answerList[i].answerIdList[0]);
                            if (compareResult[4]) {
                                const endStr = Toolkit2.Moment.getJaliliDateFromIsoOrFull(this.list[i].endDate);
                                this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.endDateShould +
                                    endStr + this.data.errorMessages.lessThan;
                                result = false;
                            }
                        }
                        break;
                    case ElementType.TIME:
                        if (!Toolkit.CheckTime(this.formData.answerList[i].answerIdList[0])) {
                            this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.timeError;
                            result = false;
                        }
                        break;
                    case ElementType.COMBO_BOX:
                        if (this.formData.answerList[i].answerIdList[0] === this.list[i].comboOptionList[0]) {
                            this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.selectOption;
                            result = false;
                        }
                        break;
                }
            }
        }
        console.log(this.errorMessages);
        // return result;
        return true;
    }

    EnFaSwitch(str) {
        let value: string;
        this.languageDataService.getSelectedLanguage().subscribe(res => {
            value = NumberTools.EnFaSowich(str, res);
        });
        return value;
    }

    // =============
//   DataService.getTotal.subscribe((res: any) => {
//   if (res) {
//     this.count = res;
//   }
// });
    // =============
    // DataService.setTotal(  this.count);
    // =============

    loadingRegister = false;

    register() {
        console.log('bbbcccccc');
        console.log('formComplete', this.formComplete);
        if (this.formComplete.invalid) {
            DefaultNotify.notifyDanger('اطلاعات وارد شده صحیح نیست.');
            return;
        }
        const length = this.list.length;
        if (this.loadingRegister) {
            return;
        }
        for (let i = 0; i < length; i++) {
            this.deleteUnselectedAnswers(this.list[i]);
        }
        this.formData.formId = this.form.id;
        for (let i = 0; i < this.formData.answerList.length; i++) {
            if (this.formData.answerList[i] == null) {
                const javab = new QuestionAnswer();
                javab.questionId = this.list[i].id;
                javab.answerIdList = [];
                javab.questionElementType = this.list[i].elementType;
                this.formData.answerList[i] = javab;
            }
        }
        console.log(this.formData);
        const errorResult = this.checkAnswersAreValid();

        if (errorResult) {
            this.formData.formTitle = this.form.title;
            this.formData.creatorId = this.user.id;
            // ==========================
            // this.workOrderAndFormRepository.formData = this.formData;
            // this.workOrderAndFormRepository.form = this.form;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // console.log('this.workOrderAndFormRepository=====>', this.workOrderAndFormRepository);
            // ==========================
            this.loadingRegister = true;

            this.activityService.saveFormDataAndPutInAssociatedActivityLevel({
                activityInstanceId: this.instanceId,
                activityLevelId: this.activityLevelId
            }, this.formData).subscribe((res: any) => {
                this.loadingRegister = false;


                if (res != null) {
                    DefaultNotify.notifySuccess('ثبت با موفقیت انجام شد');
                    // =================================================================
                    this.formAndformData.form = this.form;
                    this.formAndformData.formData = this.formData;
                    if ((!this.existedAlreadySaveForWAR)) {
                        this.workOrderRepositoryService.createFormAndFormData(this.formAndformData, {
                            activityInstanceId: this.instanceId, activityLevelId: this.activityLevelId,
                            numberOfParticipation: this.numberOfParticipation
                        })
                            .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                            if (resOne) {
                                console.log('resOne', resOne);
                                DataService.setExistedAlreadySaveForWAR(true);
                                this.workOrderAndFormRepository.id = resOne;
                            }
                        });
                    } else if (this.existedAlreadySaveForWAR) {
                        this.workOrderRepositoryService.updateFormAndFormData(this.formAndformData, {
                            activityInstanceId: this.instanceId, activityLevelId: this.activityLevelId,
                            numberOfParticipation: this.numberOfParticipation
                        })
                            .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                            if (resTow) {
                                console.log('res==>', resTow);
                            }
                        });
                    }
                    // =================================================================
                    this.cacheService.removeCompletelyItem('form', CacheType.SESSION_STORAGE);
                }
            }, error => {
                this.loadingRegister = false;
            });
        }
    }


}

export class GetFormDate {
    // answerList: any[] = [];
    // creatorId: string;
    // formId: string;
    // formTitle: string;
    // id: string;
    // systemCreationDate: Date;
    form: Form = new Form();
    formData: FormData = new FormData();
}

