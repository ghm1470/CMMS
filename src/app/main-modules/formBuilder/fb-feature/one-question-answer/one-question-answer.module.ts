import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneQuestionAnswerRoutingModule } from './one-question-answer-routing.module';
import { OneQuestionAnswerComponent } from './one-question-answer/one-question-answer.component';
import {FormDataService} from '../../fb-service/form-data.service';

@NgModule({
  imports: [
    CommonModule,
    OneQuestionAnswerRoutingModule
  ],
  declarations: [OneQuestionAnswerComponent],
  providers: [FormDataService],
  exports: [OneQuestionAnswerComponent]
})
export class OneQuestionAnswerModule { }
