import {Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {QuestionEmitterHelper} from '../../../../fb-model/helper/questionEmitterHelper';

@Component({
  selector: 'app-question-design',
  templateUrl: './question-design.component.html',
  styleUrls: ['./question-design.component.scss']
})
export class QuestionDesignComponent implements OnInit, OnChanges {

  @Output() onItemReturn = new EventEmitter();
  @Input() resetForm: boolean;
  formElement: number;
  editingQuestion = new QuestionEmitterHelper();

  constructor() { }

  ngOnInit() {
    this.formElement = 0;
  }

  ngOnChanges() {
    if (this.resetForm) {
      this.formElement = 0;
    }
  }

  editing(event: QuestionEmitterHelper) {
    this.editingQuestion = event;
    this.formElement = 1;
  }

  updating() {
    this.formElement = 0;
  }
}
