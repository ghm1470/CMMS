import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ElementType} from '../../../fb-model/enumeration/element-type';
import {FormDataService} from '../../../fb-service/form-data.service';
import {Toolkit} from '../../../shared/utility/toolkit';
import {Toolkit2} from '@angular-boot/util';
import {OneQuestionAnswerHelper} from '../../../fb-model/oneQuestionAnswerHelper';
import {PeopleAnsweredHelper} from '../../../fb-model/peopleAnsweredHelper';
declare var $: any;

@Component({
  selector: 'app-one-question-answer',
  templateUrl: './one-question-answer.component.html',
  styleUrls: ['./one-question-answer.component.css']
})
export class OneQuestionAnswerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() question: any;
  @Input() formId: string;
  @Input() answers: Array<OneQuestionAnswerHelper>;
  MyToolkit = Toolkit;
  MyToolkit2 = Toolkit2;
  MyElementType = ElementType;
  peopleAnswered: Array<PeopleAnsweredHelper> = [];

  constructor(private formDataService: FormDataService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('one' , this.question);
    console.log('one' , this.answers);
    console.log('one' , this.formId);
    if (!isNullOrUndefined(this.question)) {
      switch (this.question.elementType) {
        case 'RADIO_BUTTON':
          this.radioCheckAnswer();
          break;
        case 'CHECK_BOX':
          this.radioCheckAnswer();
          break;
        case 'COMBO_BOX':
          this.comboAnswer();
          break;
      }
    }
  }

  radioCheckAnswer() {
    if (!isNullOrUndefined(this.answers)) {
      for (let i = 0; i < this.answers.length; i++) {
        for (const option of this.question.optionList) {
          if (option.id === this.answers[i].optionId) {
            this.answers[i].optionCaption = option.caption;
            break;
          }
        }
      }
      console.log('radio answer', this.answers);
    } else {

    }
  }

  comboAnswer() {
    if (!isNullOrUndefined(this.answers)) {
      for (let i = 0; i < this.answers.length; i++) {
        this.answers[i].optionCaption = this.answers[i].optionId;
      }
    }
  }

  getPerson(optionId) {
    this.peopleAnswered = [];
    this.formDataService.getPersonAnsweredToOption(this.formId, optionId).subscribe((res:any) => {

      if (res.length > 0) {
        this.peopleAnswered = res;
        $('.peopleModal').modal('hide');
        $('.peopleModal').appendTo('body').modal('show');
      }
    });
  }

  closeModal() {
    $('.peopleModal').modal('hide');
  }

  ngOnDestroy() {
    $('body>.peopleModal').remove();
  }

}
