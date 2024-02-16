import {Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../../fb-model/form/form-data';
import {ElementType} from '../../../../fb-model/enumeration/element-type';
import {CacheService} from '../../../../shared/cache-service/cache.service';
import {LanguageService} from '../../../../shared/language-data-service/language.service';
import {CacheType} from '../../../../shared/cache-service/cache-type.enum';
import {Matrix} from '../../../../fb-model/element/matrix';
import {NumberTools} from '../../../../shared/language-data-service/numberTools';
import {Form} from '../../../../fb-model/form/form';
import {FORM} from '../../../../fb-model/constants/storage-keys';
import {isNullOrUndefined} from 'util';
import {FormService} from '../../../../fb-service/form.service';
import {ImageStatus} from "../../../../shared/model/ImageStatus";
import {Toolkit} from "../../../../shared/utility/toolkit";
import {SurveyDataService} from "../../surveyData.service";


declare var $: any;

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css']
})
export class FormPreviewComponent implements OnInit, OnChanges {

  @Input() incomingForm: string;
  @Input() resetForm: boolean;

  formData = new FormData();
  listDisplay: Array<any> = []; // لیست سوالاتی که باید نمایش داده شود. (حذف زیر سوالات از سوالات)
  form = new Form();
  list: Array<any> = []; // لیست سوالات فرم
  formId: string;
  check: Array<any> = []; // جواب سوالات چک باکس در این آرایه ریخته می شود. به دلیل اینکه ممکن است چند سوال چک باکس داشته باشیم
  combo: Array<any> = []; // برای گرفتن مقادیر کمبوباکس استفاده می شود دلیل استفاده هم این است که کمبو باکس چند انتخابی داریم.
  matrix: Array<any> = []; //  برای نگهداشتن جواب های سوالات ماتریس. جواب سوال i ام در خانه i ام این ماتریس
  slider: Array<any> = []; // کتابخانه ای که استفاده کرده ایم مقدار را فقط با ngModel میگیرد. بخاطر همین مجبوریم آرایه بگیریم
  errorMessages: Array<string> = [];  // برای نشان دادن پیغام های خطا
  selectedLanguage: string;
  data: any = null;
  MyImageStatus = ImageStatus;
  MyToolkit = Toolkit;
  image = new Image();
  public mask = [/\d/, /\d/, ':', /\d/, /\d/];

  constructor(private cacheService: CacheService,
              private languageDataService: LanguageService,
              private formService: FormService,
              private dataService: SurveyDataService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
  }

  ngOnInit(): void {
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      if (res != null) {
        this.form = res;
        this.list = [];
        this.listDisplay = [];
        this.list = this.form.elementList;
        this.prepareVariables();
      }
    });
    this.dataService.gettingViewDetail.subscribe((res: boolean) => {
      if (res) {
        this.ngOnChanges();
      }
    });
  }

  ngOnChanges() {
    if (!isNullOrUndefined(this.incomingForm)) {
      this.getForm();
    }
    if (this.resetForm) {
      this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
        if (res != null) {
          this.form = res;
          this.list = [];
          this.listDisplay = [];
          this.list = this.form.elementList;
          this.prepareVariables();
        }
      });
    }
  }

  getForm() {
    this.formService.getOneForm(this.incomingForm).subscribe((res: Form) => {
      this.form = res;
      this.list = [];
      this.listDisplay = [];
      this.list = this.form.elementList;
      this.prepareVariables();
      // this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
    });
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

      if (this.list[i].elementType === ElementType.MATRIX) {
        let matrixElement = new Matrix();
        matrixElement = <Matrix> this.list[i];
        const matrixValues2: Array<any> = [];
        for (let j = 0; j < matrixElement.matrixQuestionList.length; j++) {
          matrixValues2[j] = new MatrixAnswer();
        }
        this.matrix[i] = matrixValues2;
      }
    }
  }

  showDate(i) {
    $(document).ready(function () {
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
    $(document).ready(function () {
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

  onChangeCheck(event: string, item, i) {
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

  onChangeRadio(event, item, i) {
    const answer = new QuestionAnswer();
    answer.questionId = item.id;
    answer.questionElementType = item.elementType;
    answer.answerIdList[0] = event.target.value;
    this.formData.answerList[i] = answer;
    this.errorMessages[i] = '';
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

  EnFaSwitch(str) {
    let value: string;
    this.languageDataService.getSelectedLanguage().subscribe(res => {
      if (res === null) {
        value = NumberTools.EnFaSowich(str, 'FA');
      } else {
        value = NumberTools.EnFaSowich(str, res);
      }
    });
    return value;
  }
}
