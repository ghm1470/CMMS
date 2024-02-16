import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Form} from '../../../fb-model/form/form';
import {isNullOrUndefined} from 'util';
import {Toolkit} from '../../../shared/utility/toolkit';
import {ImageStatus} from '../../../shared/model/ImageStatus';


@Component({
  selector: 'app-form-answer-display',
  templateUrl: './form-answer-display.component.html',
  styleUrls: ['./form-answer-display.component.css']
})
export class FormAnswerDisplayComponent implements OnInit, OnChanges {

  @Input() incomingForm: Form;
  @Output() questionAnswer = new EventEmitter<any>();
  form = new Form();
  MyToolkit = Toolkit;
  MyImageStatus = ImageStatus;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.form);
    if (!isNullOrUndefined(this.incomingForm)) {
      this.form = this.incomingForm;
    }
  }

  answerDetail(question) {
    this.questionAnswer.emit(question);
  }

}
