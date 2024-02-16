import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges} from '@angular/core';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {WorkTableDto} from '../../../../worktable/model/workTable';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../fb-model/form/form-data';
import {Form} from '../../../fb-model/form/form';
import {ElementType} from '../../../fb-model/enumeration/element-type';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {Attachment} from '../../../shared/model/file/Attachment';
import {Toolkit} from '../../../shared/utility/toolkit';
import {DefaultNotify, Toolkit2} from '@angular-boot/util';
import {ActionType} from '../../../fb-model/enumeration/enum/ActionType';
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
import {FormStatus} from '../../../fb-model/enumeration/form-status';
import {TimeModel} from '../../../fb-model/element/time';
import * as moment from 'jalali-moment';
import {NumberTools} from '../../../shared/language-data-service/numberTools';
import {CacheType} from '../../../shared/cache-service/cache-type.enum';
declare var $: any;
@Component({
  selector: 'app-form-complet-for-history',
  templateUrl: './form-complet-for-history.component.html',
  styleUrls: ['./form-complet-for-history.component.scss']
})
export class FormCompletForHistoryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  user: UserDto.Create = new UserDto.Create();

  @Input() formStatus: string;
  @Input() activityLevelId: string;
  @Input() instanceId: string;
  @Input() formDataId: string;
  @Input() formId: string;
  @Output() workOrderAndFormRepositoryId = new EventEmitter<string>();

  @Input() incomingFormId: string;
  @Input() workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  @Input() numberOfParticipation: number;
  @Input() incomingFormTitle: string;
  @Input() requestId: string;
  @Input() cancelPermission: string;
  @Input() incomingFormData: FormData;
  @Input() showSaveButton: boolean;
  @Input() registerForm: boolean;
  @Output() formDataOutput = new EventEmitter();
  @Output() formDataIdOutput = new EventEmitter<string>();
  formData = new FormData();
  finalLevel = true;
  listDisplay: Array<any> = []; // لیست سوالاتی که باید نمایش داده شود. (حذف زیر سوالات از سوالات)
  form = new Form();
  list: Array<any> = []; // لیست سوالات فرم
  check: Array<any> = []; // جواب سوالات چک باکس در این آرایه ریخته می شود. به دلیل اینکه ممکن است چند سوال چک باکس داشته باشیم
  combo: Array<any> = []; // برای گرفتن مقادیر کمبوباکس استفاده می شود دلیل استفاده هم این است که کمبو باکس چند انتخابی داریم.
  matrix: Array<any> = []; //  برای نگهداشتن جواب های سوالات ماتریس. جواب سوال i ام در خانه i ام این ماتریس
  slider: Array<any> = []; // کتابخانه ای که استفاده کرده ایم مقدار را فقط با ngModel میگیرد. بخاطر همین مجبوریم آرایه بگیریم
  errorMessages: Array<string> = [];  // برای نشان دادن پیغام های خطا
  registerOk = false;
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
  actionType = ActionType;
  loading = false;

  limit = true;

  constructor(private formService: FormService,
              private cacheService: CacheService,
              private languageDataService: LanguageService,
              private formDataService: FormDataService,
              private dataService: DataService,
              private router: Router,
              private activityService: ActivityService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
    this.url = this.formService._ServiceConfig.getUrl();
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.form.elementList = [];
    this.formData.answerList = [];
    this.formData.formTitle = this.incomingFormTitle;
    this.formData.formId = this.incomingFormId;

    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
// ====================فقط از ای سرویس به صورت گت استفاده شده وجایی ست نشده است ===
    this.dataService.gettingFormRegister.subscribe((res: boolean) => {
      if (res) {
        this.register(res);
      }
    });
    // ========================================================================
  }

  ngAfterViewInit(): void {
    if (this.formStatus !== 'pending') {
      // $('.form-control').attr('disabled', 'disabled');
      $('input').attr('disabled', 'disabled');
      $('select').attr('disabled', 'disabled');
      // $('select').attr('disabled', 'disabled');
    }
  }

  ngOnDestroy(): void {
  }

  getFormAndFormDataTow() {
    console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{');
    this.loading = true;
    setTimeout(() => {
      DataService.getWAFRepository.subscribe((res: any) => {
        if (res) {
          this.workOrderAndFormRepository = res;
        }
      });
      if (!isNullOrUndefined(this.workOrderAndFormRepository)) {
        if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
          console.log(this.workOrderAndFormRepository, '999999999999workOrderAndFormRepository');
          this.numberOfParticipation = this.workOrderAndFormRepository.numberOfParticipation;
          console.log(this.numberOfParticipation, 'bbbbbbbbbbbmmm');
          this.workOrderRepositoryService.getOne(
            {
              activityInstanceId: this.instanceId,
              activityLevelId: this.activityLevelId,
              numberOfParticipation: this.numberOfParticipation
            }).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
              if (res) {
                console.log(res, 'res');
                this.loading = false;
                this.form = new Form();
                this.form = res.form;
                // this.formData = res.formData;
                console.log(this.formData, 'this.formData');
                this.incomingFormData = res.formData;
                this.list = [];
                this.listDisplay = [];
                this.list = this.form.elementList;
                if (this.incomingFormData != null && this.incomingFormId !== this.incomingFormData.formId) {
                  this.incomingFormData = null;
                }
                this.prepareVariables();

                if (this.incomingFormData != null && this.incomingFormId === this.incomingFormData.formId) {
                  console.log(this.incomingFormData);
                  this.formData = JSON.parse(JSON.stringify(this.incomingFormData));
                }
                this.formData.formId = this.incomingFormId;

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
            });
        } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
          this.getForm();
        }
      } else {
        this.getFormAndFormDataTow();
      }
    }, 500);
  }

  getForm() {
    console.log('[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]');
    this.loading = true;
    this.activityService.getFormByActivityLevelIdAndInstanceId(
      {
        instanceId: this.instanceId,
        activityLevelId: this.activityLevelId,
      }).pipe(takeUntilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          this.loading = false;
          this.form = new Form();
          this.form = res;
          this.list = [];
          this.listDisplay = [];
          this.list = this.form.elementList;
          if (this.incomingFormData != null && this.incomingFormId !== this.incomingFormData.formId) {
            this.incomingFormData = null;
          }
          this.prepareVariables();
          if (this.incomingFormData != null && this.incomingFormId === this.incomingFormData.formId) {
            console.log(this.incomingFormData);
            this.formData = JSON.parse(JSON.stringify(this.incomingFormData));
          }
          this.formData.formId = this.incomingFormId;

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

  getFormAndFormData() {
    this.activityService.getFormAndFormDataByActivityLevelIdAndInstanceId(
      {
        formDataId: this.formDataId,
        formId: this.formId,
      }).pipe(takeUntilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          this.form = new Form();
          this.form = res.form;
          this.incomingFormData = res.formData;
          this.list = [];
          this.listDisplay = [];
          this.list = this.form.elementList;
          if (this.incomingFormData != null && this.incomingFormId !== this.incomingFormData.formId) {
            this.incomingFormData = null;
          }
          this.prepareVariables();

          if (this.incomingFormData != null && this.incomingFormId === this.incomingFormData.formId) {
            console.log(this.incomingFormData);
            this.formData = JSON.parse(JSON.stringify(this.incomingFormData));
          }
          this.formData.formId = this.incomingFormId;

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
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.formstatus)) {
      if (changes.formStatus.currentValue !== 'pending') {
        this.finalLevel = false;
      } else {
        this.finalLevel = true;
      }
    }
    this.formData.formId = this.incomingFormId;
    // this.getElementsAuthenticated();
    if (this.registerForm) {
      this.register(true);
    }
    console.log(this.incomingFormData);
    console.log(changes.hasOwnProperty('incomingFormId'));
    console.log(changes.hasOwnProperty('incomingFormId'));
    console.log(this.formDataId);
    if (changes.hasOwnProperty('incomingFormId')) {
      if (this.formDataId) {
        this.getFormAndFormDataTow();
      } else {
        this.getForm();
      }
    }
  }


  prepareVariables() {
    for (let i = 0; i < this.list.length; i++) {
      this.check[i] = [];
      this.combo[i] = [];
      this.slider[i] = '';
      this.errorMessages[i] = '';
      this.formData.answerList[i] = null;

      if (this.list[i].parentElement.elementId === '0') {
        this.list[i].index = i;
        this.listDisplay.push(this.list[i]);
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
    // $('input').attr('disabled', 'disabled');
    // $('select').attr('disabled', 'disabled');
  }

  notRunningError() {
    let message = '';
    if (this.form.formStatus === FormStatus.FINISH) {
      message = this.data.errorMessages.formStatusFinish;
    }
    if (this.form.formStatus === FormStatus.EDITING) {
      message = this.data.errorMessages.formStatusNotRunning;
    }
    DefaultNotify.notifyDanger(message);
    this.router.navigateByUrl('');
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

  onChangeElementAnswer(event, item, i, elementType) {
    const answer = new QuestionAnswer();
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

  onChangeCheck(event: string, item, i) {
    console.log(this.formData.answerList[i]);
    const answerCheck = new QuestionAnswer();
    answerCheck.questionId = item.id;
    answerCheck.questionElementType = item.elementType;
    const index = this.check[i].indexOf(event);
    // Is currently selected
    if (index > -1) {
      this.check[i].splice(index, 1);
    } else {
      this.check[i].push(event);
    }
    answerCheck.answerIdList = this.check[i];
    this.formData.answerList[i] = answerCheck;
    this.errorMessages[i] = '';
  }

  onChangeMatrix(value, item, itemIndex, qIndex, multiSelect, question) {
    const answerMatrix = new QuestionAnswer();
    answerMatrix.questionId = item.id;
    answerMatrix.questionElementType = item.elementType;
    let array: Array<any> = [];
    for (let j = 0; j < item.matrixQuestionList.length; j++) {
      array[j] = new MatrixAnswer();
    }
    console.log(this.matrix[itemIndex]);
    array = this.matrix[itemIndex];
    let array2: Array<string> = [];
    array2 = array[qIndex].matrixValueList;
    if (multiSelect === true) {
      array[qIndex].question = question;
      const index = array2.indexOf(value);
      // Is currently selected
      if (index > -1) {
        // let array2 = array[qIndex];
        array2.splice(index, 1);
        array[qIndex].matrixValues = array2;
      } else {
        array2.push(value);
        array[qIndex].matrixValues = array2;
      }
    } else {
      array[qIndex].question = question;
      array[qIndex].matrixValueList[0] = value;
    }
    this.matrix[itemIndex] = array;
    answerMatrix.answerIdList = this.matrix[itemIndex];
    this.formData.answerList[itemIndex] = answerMatrix;
    this.errorMessages[itemIndex] = '';
  }

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

  hideCollapse(questionIndex, option) {
    let found = false;
    if (this.formData.answerList[questionIndex] != null) {
      if (this.formData.answerList[questionIndex].answerIdList != null) {
        for (const item of this.formData.answerList[questionIndex].answerIdList) {
          if (item === option.id) {
            found = true;
            break;
          } else {
            found = false;
          }
        }
        if (found === true) {
          return true;
        }
        if (found === false) {
          return false;
        }
      } else {
        return false;
      }
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
            if (this.list[i].minLength > this.formData.answerList[i].answerIdList[0].length) {
              this.errorMessages[i] = this.errorMessages[i] + ' ' + this.data.errorMessages.minimumCharacter + this.list[i].minLength
                + '   -   ' + this.data.errorMessages.maximumCharacter + this.list[i].maxLength;
              result = false;
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
    return result;
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

  register(status) {
    DataService.getWAFRepository.subscribe((res: any) => {
      if (res) {
        this.workOrderAndFormRepository = res;
        console.log('this.workOrderAndFormRepository=====>', this.workOrderAndFormRepository);
      }
      console.log('this.workOrderAndFormRepository.id2=====>', this.workOrderAndFormRepository.id);
    });
    const length = this.list.length;
    for (let i = 0; i < length; i++) {
      this.deleteUnselectedAnswers(this.list[i]);
    }
    for (let i = 0; i < this.formData.answerList.length; i++) {
      if (this.formData.answerList[i] == null) {
        const javab = new QuestionAnswer();
        javab.questionId = this.list[i].id;
        javab.answerIdList = [];
        javab.questionElementType = this.list[i].elementType;
        this.formData.answerList[i] = javab;
        this.formData.formId = this.form.id;
      }
    }
    const errorResult = this.checkAnswersAreValid();
    if (errorResult) {
      this.formData.formTitle = this.form.title;
      this.formData.creatorId = this.user.id;
      // ==========================
      this.workOrderAndFormRepository.formData = this.formData;
      // this.workOrderAndFormRepository.form = this.form;
      console.log('this.workOrderAndFormRepository=====>', this.workOrderAndFormRepository);
      if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
        this.workOrderRepositoryService.create(this.workOrderAndFormRepository).subscribe((RES: any) => {
          console.log('RES.id===>', RES);
          if (RES) {
            this.workOrderAndFormRepository.id = RES;
            console.log('RES.id===>', this.workOrderAndFormRepository.id);
            // this.workOrderAndFormRepositoryId.emit(RES);
            DataService.setWAFRepository(this.workOrderAndFormRepository);
            // this.sendWorkOrderAndFormRepository.emit(this.workOrderAndFormRepository);
            console.log('this.workOrderAndFormRepository=====>', this.workOrderAndFormRepository);
          }
        });
      } else if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
        this.workOrderRepositoryService.update(this.workOrderAndFormRepository).subscribe((RES: any) => {
          DataService.setWAFRepository(this.workOrderAndFormRepository);
          // this.sendWorkOrderAndFormRepository.emit(this.workOrderAndFormRepository);
          console.log('this.workOrderAndFormRepository2=====>', this.workOrderAndFormRepository);
        });
      }
      // ==========================
      this.activityService.saveFormDataAndPutInAssociatedActivityLevel({
        activityInstanceId: this.instanceId,
        activityLevelId: this.activityLevelId
      }, this.formData).subscribe((res: any) => {

        if (res != null) {
          console.log(res.activityLevelList[parseInt(this.activityLevelId, 0)].formDataId);
          console.log(parseInt(this.activityLevelId, 0));
          this.formDataIdOutput.emit(res.activityLevelList[parseInt(this.activityLevelId, 0)].formDataId);
          if (this.registerForm) {
            this.formDataOutput.emit(this.formData);
            console.log('55555555555555555555');
          }
          this.cacheService.removeCompletelyItem('form', CacheType.SESSION_STORAGE);


          DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        }
      });
    }
  }


  cancelProcess() {
    this.formData.formTitle = this.form.title;
    this.formData.formId = this.form.id;
    this.formData.creatorId = this.user.id;
    const establishmentProcessDto = {
      actionType: ActionType.CANCEL,
      companyId: this.requestId
    };
    this.activityService.rejectForm({
      instanceId: this.instanceId,
      activityLevelId: this.activityLevelId
    }, this.formData).subscribe((r: any) => {
      if (r === true) {
        DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
        this.router.navigateByUrl('/panel');
      } else {
        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
      }
    });
  }

  //
  // cancelProcess() {
  //   const establishmentProcessDto = {
  //     actionType: ActionType.CANCEL,
  //     companyId: this.requestId
  //   };
  //   this.activityService.establishment(establishmentProcessDto).subscribe((r: any) => {
  //     if (r === true) {
  //       DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
  //       this.router.navigateByUrl('/panel');
  //     } else {
  //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
  //     }
  //   });
  // }

}
