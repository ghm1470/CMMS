import {Component, OnInit, Output, EventEmitter, Renderer2, OnChanges, Input} from '@angular/core';
import {CacheService} from '../../../../shared/cache-service/cache.service';
import {CacheType} from '../../../../shared/cache-service/cache-type.enum';
import {Form} from '../../../../fb-model/form/form';
import {CheckBox} from '../../../../fb-model/element/check-box';
import {QuestionEmitterHelper} from '../../../../fb-model/helper/questionEmitterHelper';
import {ElementType} from '../../../../fb-model/enumeration/element-type';
import {LanguageService} from '../../../../shared/language-data-service/language.service';
import {ComboBox} from '../../../../fb-model/element/combo-box';
import {ComboBoxType} from '../../../../fb-model/enumeration/combo-box-type';
import {Date} from '../../../../fb-model/element/date';
import {Matrix} from '../../../../fb-model/element/matrix';
import {MatrixQuestion} from '../../../../fb-model/element/matrix-question';
import {Numerical} from '../../../../fb-model/element/numerical';
import {RadioButton} from '../../../../fb-model/element/radio-button';
import {StarRating} from '../../../../fb-model/element/star-rating';
import {TextArea} from '../../../../fb-model/element/text-area';
import {TextField} from '../../../../fb-model/element/text-field';
import {TextFieldType} from '../../../../fb-model/enumeration/text-field-type';
import {Time} from '../../../../fb-model/element/time';
import {UUID} from 'angular2-uuid';
import {BasicElement, ParentElement} from '../../../../fb-model/element/basic-element';
import {FORM} from '../../../../fb-model/constants/storage-keys';
import {Image} from '../../../../shared/model/Image';
import {ImageStatus} from '../../../../shared/model/ImageStatus';
import {isNullOrUndefined} from 'util';
import {FileAttach} from '../../../../fb-model/element/fileAttach';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.css']
})
export class QuestionCreateComponent implements OnInit, OnChanges {

  @Output() editedItemReturn = new EventEmitter();
  @Input() resetForm: boolean;
  form = new Form();
  data: any = null;
  selectedLanguage: string;
  editedItem: QuestionEmitterHelper = new QuestionEmitterHelper();
  newItem: any [] = [];

  constructor(private cacheService: CacheService,
              private languageDataService: LanguageService,
              renderer: Renderer2) {
    languageDataService.renderer = renderer;
  }

  ngOnInit() {
    this.languageDataService.getSelectedLanguage().subscribe(res => {
      this.selectedLanguage = res;
    });
    this.languageDataService.getLanguageData().subscribe(res => {
      this.data = res;
    });
    this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
      console.log('read chache Q create', res);
      if (res != null) {
        this.form = res;
        console.log('forrrrrrrrrrrrm', this.form);

      }
    });
  }

  ngOnChanges() {
    if (this.resetForm) {
      this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
        if (res != null) {
          this.form = res;
        }
      });
    }
  }

  UpdateItem(index: number) {
    this.editedItem.item = this.form.elementList[index];
    this.editedItem.newElement = false;
    this.editedItem.index = index;
    this.editedItemReturn.emit(this.editedItem);
  }

  UpElement(index: number) {
    const temp = this.form.elementList[index];
    this.form.elementList[index] = null;
    this.form.elementList[index] = this.form.elementList[index - 1];
    this.form.elementList[index - 1] = null;
    this.form.elementList[index - 1] = temp;
    this.saveOnStorage();
  }

  DownElement(index: number) {
    const temp = this.form.elementList[index];
    this.form.elementList[index] = null;
    this.form.elementList[index] = this.form.elementList[index + 1];
    this.form.elementList[index + 1] = null;
    this.form.elementList[index + 1] = temp;
    this.saveOnStorage();
  }


  // Delete(index: number) {
  //   //ttt
  //   const deletedId = this.form.elementList[index].id;
  //   if (this.form.elementList[index].elementType === ElementType.CHECK_BOX
  //     || this.form.elementList[index].elementType === ElementType.RADIO_BUTTON) {
  //     for (let i = 0; i < this.form.elementList.length; i++) {
  //       if (this.form.elementList[i].parentElement.elementId === deletedId) {
  //         this.form.elementList[i].parentElement = {elementId: '0', optionId: '0'};
  //       }
  //     }
  //   }
  //   for (const item of this.form.elementList) {
  //     console.log('item.optionList', item.optionList);
  //     if (!isNullOrUndefined(item.optionList)) {
  //       this.newItem = item.optionList;
  //       for (const item2 of item.optionList) {
  //         if (item2.subQuestionList.length > 0) {
  //           if (!isNullOrUndefined(item2.subQuestionList.findIndex(e => e.id === deletedId))) {
  //             const i = item2.subQuestionList.findIndex(e => e.id === deletedId);
  //             item2.subQuestionList.splice(i, 1);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   this.form.elementList.splice(index, 1);
  //   this.saveOnStorage();
  // }


  Duplicate(index: number) {
    const array1 = this.form.elementList.slice(0, index + 1);
    const array2 = this.form.elementList.slice(index + 1, this.form.elementList.length);
    let newArray: Array<BasicElement> = [];
    newArray = array1;
    const newElement = JSON.parse(JSON.stringify(this.form.elementList[index]));
    newElement.index = newElement.index + 1;
    newElement.id = UUID.UUID();
    if (!isNullOrUndefined(newElement.optionList)) {
      if (newElement.optionList.length > 0) {
        for (let i = 0; i < newElement.optionList.length; i++) {
          newElement.optionList[i].id = UUID.UUID();
        }
      }
    }
    newArray.push(newElement);
    for (const item of array2) {
      item.index = item.index + 1;
      newArray.push(item);
    }
    this.form.elementList = [];
    this.form.elementList = newArray;
    this.saveOnStorage();
  }

  goToEditingPage(element) {
    this.editedItem.item = element;
    this.editedItem.newElement = true;
    this.editedItem.index = this.form.elementList.length - 1;
    this.editedItemReturn.emit(this.editedItem);
  }

  createCheckBox() {
    const checkBox = new CheckBox();
    checkBox.label = this.data.formQuestion.questionTitle;
    checkBox.helpText = this.data.formQuestion.questionHelpText;
    checkBox.elementType = ElementType.CHECK_BOX;
    checkBox.id = UUID.UUID();
    checkBox.required = false;
    const option1 = new Image();
    option1.caption = this.data.formQuestion.option1Caption;
    option1.id = UUID.UUID();
    option1.imageStatus = ImageStatus.WITHOUT_IMAGE;
    checkBox.optionList = [option1];
    this.form.elementList.push(checkBox);
    this.saveOnStorage();
    this.goToEditingPage(checkBox);
  }

  createComboBox() {
    const comboBox = new ComboBox();
    comboBox.elementType = ElementType.COMBO_BOX;
    comboBox.id = UUID.UUID();
    comboBox.required = false;
    comboBox.comboBoxType = ComboBoxType.SINGLE;
    comboBox.label = this.data.formQuestion.questionTitle;
    comboBox.placeHolder = this.data.formQuestion.comboPlaceholder;
    comboBox.helpText = this.data.formQuestion.questionHelpText;
    comboBox.comboOptionList = [comboBox.placeHolder, this.data.formQuestion.option1Caption];
    this.form.elementList.push(comboBox);
    this.saveOnStorage();
    this.goToEditingPage(comboBox);
  }

  createDate() {
    const date = new Date();
    date.elementType = ElementType.DATE;
    date.id = UUID.UUID();
    date.required = false;
    date.label = this.data.formQuestion.questionTitle;
    date.helpText = this.data.formQuestion.questionHelpText;
    this.form.elementList.push(date);
    this.saveOnStorage();
    this.goToEditingPage(date);
  }

  createMatrix() {
    const matrix = new Matrix();
    matrix.elementType = ElementType.MATRIX;
    matrix.id = UUID.UUID();
    matrix.required = false;
    matrix.label = this.data.formQuestion.questionTitle;
    matrix.helpText = this.data.formQuestion.questionHelpText;
    const question1 = new MatrixQuestion();
    question1.title = this.data.formQuestion.question1Title;
    question1.multipleSelect = false;
    const option1 = new Image();
    option1.id = UUID.UUID();
    option1.caption = this.data.formQuestion.option1Caption;
    option1.imageStatus = ImageStatus.WITHOUT_IMAGE;
    matrix.matrixQuestionList = [question1];
    matrix.optionList = [option1];
    this.form.elementList.push(matrix);
    this.saveOnStorage();
    this.goToEditingPage(matrix);
  }

  createNumerical() {
    const numerical = new Numerical();
    numerical.elementType = ElementType.NUMERICAL;
    numerical.id = UUID.UUID();
    numerical.required = false;
    numerical.label = this.data.formQuestion.questionTitle;
    numerical.helpText = this.data.formQuestion.questionHelpText;
    numerical.beginLabel = this.data.formQuestion.numericalStartLabel;
    numerical.endLabel = this.data.formQuestion.numericalEndLabel;
    numerical.maxLength = 11;
    numerical.minLength = 1;
    numerical.step = 1;
    this.form.elementList.push(numerical);
    this.saveOnStorage();
    this.goToEditingPage(numerical);
  }

  createRadioButton() {
    const radioButton = new RadioButton();
    radioButton.label = this.data.formQuestion.questionTitle;
    radioButton.helpText = this.data.formQuestion.questionHelpText;
    radioButton.elementType = ElementType.RADIO_BUTTON;
    radioButton.id = UUID.UUID();
    radioButton.required = false;
    const option1 = new Image();
    option1.id = UUID.UUID();
    option1.caption = this.data.formQuestion.option1Caption;
    option1.imageStatus = ImageStatus.WITHOUT_IMAGE;
    radioButton.optionList = [option1];
    this.form.elementList.push(radioButton);
    this.saveOnStorage();
    this.goToEditingPage(radioButton);
  }

  createStarRating() {
    const star = new StarRating();
    star.elementType = ElementType.STAR_RATING;
    star.id = UUID.UUID();
    star.required = false;
    star.label = this.data.formQuestion.questionTitle;
    star.helpText = this.data.formQuestion.questionHelpText;
    star.colorStatus = 'undefined';
    star.starCount = 5;
    star.direction = 'ltr';
    star.initialRate = 2;
    this.form.elementList.push(star);
    this.saveOnStorage();
    this.goToEditingPage(star);
  }

  createTextArea() {
    const textArea = new TextArea();
    textArea.elementType = ElementType.TEXT_AREA;
    textArea.id = UUID.UUID();
    textArea.required = false;
    textArea.label = this.data.formQuestion.questionTitle;
    textArea.helpText = this.data.formQuestion.questionHelpText;
    textArea.placeHolder = this.data.formQuestion.samplePlaceholder;
    this.form.elementList.push(textArea);
    this.saveOnStorage();
    this.goToEditingPage(textArea);
  }

  createTextField() {
    const textField = new TextField();
    textField.elementType = ElementType.TEXT_FIELD;
    textField.id = UUID.UUID();
    textField.required = false;
    textField.label = this.data.formQuestion.questionTitle;
    textField.helpText = this.data.formQuestion.questionHelpText;
    textField.placeHolder = this.data.formQuestion.samplePlaceholder;
    textField.textFieldType = TextFieldType.TEXT;
    this.form.elementList.push(textField);
    this.saveOnStorage();
    this.goToEditingPage(textField);
  }

  createTime() {
    const time = new Time();
    time.elementType = ElementType.TIME;
    time.id = UUID.UUID();
    time.required = false;
    time.label = this.data.formQuestion.questionTitle;
    time.helpText = this.data.formQuestion.questionHelpText;
    this.form.elementList.push(time);
    this.saveOnStorage();
    this.goToEditingPage(time);
  }

  createFileAttach() {
    const fileAttach = new FileAttach();
    fileAttach.elementType = ElementType.FILE_ATTACH;
    fileAttach.id = UUID.UUID();
    fileAttach.required = false;
    fileAttach.label = this.data.formQuestion.questionTitle;
    fileAttach.helpText = this.data.formQuestion.questionHelpText;
    fileAttach.fileCountLimitation = 0;
    this.form.elementList.push(fileAttach);
    this.saveOnStorage();
    this.goToEditingPage(fileAttach);
  }

  saveOnStorage() {
    this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
  }

  parentElementId = new ParentElement();

  Delete(index: number) {
    // myDelete
    const deletedId = this.form.elementList[index].id;
    if (this.form.elementList[index].elementType === ElementType.CHECK_BOX
      || this.form.elementList[index].elementType === ElementType.RADIO_BUTTON) {
      if (this.form.elementList[index].optionList.length > 0) {
        const item1 = this.form.elementList[index];
        for (let opti of item1.optionList) {
          if (opti.subQuestionList && opti.subQuestionList.length > 0) {
            for (let i = 0; i < opti.subQuestionList.length; i++) {
              const id = opti.subQuestionList[i].id;
              for (let j = 0; j < this.form.elementList.length; j++) {
                if (this.form.elementList[j].id === id) {
                  console.log('JSONthis.form.elementList[j])', JSON.parse(JSON.stringify(this.form.elementList[j])))
                  this.form.elementList[j].parentElement = {elementId: '0', optionId: '0'};
                  console.log('this.form.elementList[j])After', this.form.elementList[j])
                  break;

                }
              }
            }

          }
        }
      }

      if (this.form.elementList[index].parentElement) {
        if (!isNullOrUndefined(this.form.elementList[index].parentElement)) {
          this.parentElementId = this.form.elementList[index].parentElement;
          if (this.parentElementId.elementId !== '0') {
            const findParentElement = this.form.elementList.find(e => e.id === this.parentElementId.elementId);
            console.log('findParentElement', findParentElement)
            if (!isNullOrUndefined(findParentElement)) {
              if (findParentElement.optionList && findParentElement.optionList.length > 0) {
                for (let opt of findParentElement.optionList) {
                  if (opt.subQuestionList.length > 0) {
                    if (!isNullOrUndefined(opt.subQuestionList.findIndex(e => e.id === deletedId))) {
                      console.log('opt.subQuestionList', JSON.parse(JSON.stringify(opt.subQuestionList)));
                      const i = opt.subQuestionList.findIndex(e => e.id === deletedId);
                      console.log('iiiiiiiiiiii', opt.subQuestionList);
                      opt.subQuestionList.splice(i, 1);
                      console.log('opt.subQuestionList222222222', opt.subQuestionList);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }



    } else if (this.form.elementList[index].elementType !== ElementType.CHECK_BOX
      && this.form.elementList[index].elementType !== ElementType.RADIO_BUTTON) {

      if (this.form.elementList[index].parentElement) {
        // alert(1)
        if (!isNullOrUndefined(this.form.elementList[index].parentElement)) {
          console.log('************', this.form.elementList[index].parentElement)


          // const parentElement = this.form.elementList[index].parentElement.elementId;

          this.parentElementId = this.form.elementList[index].parentElement;
          if (this.parentElementId.elementId !== '0') {
          const findParentElement = this.form.elementList.find(e => e.id === this.parentElementId.elementId);
          console.log('findParentElement', findParentElement)

          if (!isNullOrUndefined(findParentElement)) {
            if (findParentElement.optionList && findParentElement.optionList.length > 0) {

              for (let opt of findParentElement.optionList) {
                if (opt.subQuestionList.length > 0) {

                  if (!isNullOrUndefined(opt.subQuestionList.findIndex(e => e.id === deletedId))) {
                    console.log('opt.subQuestionList', JSON.parse(JSON.stringify(opt.subQuestionList)));
                    const i = opt.subQuestionList.findIndex(e => e.id === deletedId);
                    console.log('iiiiiiiiiiii', opt.subQuestionList);
                    opt.subQuestionList.splice(i, 1);
                    console.log('opt.subQuestionList222222222', opt.subQuestionList);
                    break;
                  }
                }
              }
            }
          }
          }
        }
      }
    }

    this.form.elementList.splice(index, 1);
    console.log('888888888888', this.form.elementList)
    this.saveOnStorage();
  }
}
