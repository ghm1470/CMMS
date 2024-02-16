import {Component, Input, OnChanges} from '@angular/core';
import {FormData, MatrixAnswer, QuestionAnswer} from '../../../fb-model/form/form-data';
import {Form} from '../../../fb-model/form/form';
import {FormService} from '../../../fb-service/form.service';
import {isNullOrUndefined} from 'util';
import {Option} from '../../../fb-model/element/option';
import {ImageStatus} from '../../../shared/model/ImageStatus';
import {FormDataService} from '../../../fb-service/form-data.service';
import {Moment} from "../../../../../shared/shared/tools/date/moment";



@Component({
  selector: 'app-one-answer',
  templateUrl: './one-answer.component.html',
  styleUrls: ['./one-answer.component.css']
})
export class OneAnswerComponent implements OnChanges {

  formId: string;
  answerList: Array<QuestionAnswer> = [];
  answers: Array<any> = [];
  questions: Array<any> = [];
  form = new Form();
  formData = new FormData();
  MyImageStatus = ImageStatus;
  url;
  @Input() formDataId: string;
  @Input() newFormData: boolean;
  moment = Moment;

  // @Input() newFormData: boolean;

  constructor(private formDataService: FormDataService,
              private formService: FormService) {
    this.url = this.formService._ServiceConfig.getUrl();
  }

  ngOnChanges() {
    console.log('answer', this.newFormData);
    console.log('answerId', this.formDataId);
    if (this.newFormData) {
      console.log(this.formDataId);
      this.formDataService.getOneFormData(this.formDataId).subscribe((res: FormData) => {




        if (!isNullOrUndefined(res)) {
          this.formData = res;
          this.answerList = res.answerList;
          this.formService.getOneForm(res.formId).subscribe((resForm: Form) => {
            console.log(resForm);
            if (!isNullOrUndefined(resForm)) {
              this.questions = resForm.elementList;
              this.getFormData();
            }});
        }
      });
    }
  }

  getFormData() {
    for (let i = 0; i < this.answerList.length; i++) {
      switch (this.answerList[i].questionElementType) {
        case 'CHECK_BOX':
          this.answers[i] = [];
          for (const opt of this.answerList[i].answerIdList) {
            if (this.findOption(opt, i) !== null) {
              let option = new Image();
              option = this.findOption(opt, i);
              this.answers[i].push(option);
            }
          }
          break;
        case 'RADIO_BUTTON':
          if (this.findOption(this.answerList[i].answerIdList[0], i) !== null) {
            let option = new Image();
            option = this.findOption(this.answerList[i].answerIdList[0], i);
            this.answers[i] = option;
          }
          break;
        case 'MATRIX':
          const matrixAnswers: Array<MatrixAnswer> = [];
          for (const answer of this.answerList[i].answerIdList) {
            const matrixAnswer = new MatrixAnswer();
            matrixAnswer.questionTitle = answer.question;
            for (const opt of answer.matrixValueList) {
              if (this.findOption(opt, i) !== null) {
                let option = new Option();
                option = this.findOption(opt, i);
                matrixAnswer.matrixValueList.push(option.caption);
              }
            }
            matrixAnswers.push(matrixAnswer);
          }
          this.answers[i] = matrixAnswers;
          break;
        default:
          this.answers[i] = this.answerList[i].answerIdList[0];
          break;
      }
    }
  }

  findOption(id, qIndex) {
    let returnOption = null;
    for (const option of this.questions[qIndex].optionList) {
      if (option.id === id) {
        returnOption = new Option();
        returnOption = option;
        break;
      }
    }
    return returnOption;
  }

  returnBack() {
    // this._location.back();
  }

}
