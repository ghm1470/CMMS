import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnswerDetailRoutingModule } from './answer-detail-routing.module';
import {OneAnswerComponent} from './one-answer/one-answer.component';
import {FormDataService} from '../../fb-service/form-data.service';
import {FormService} from '../../fb-service/form.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AnswerDetailRoutingModule,
    HttpClientModule
  ],
  declarations: [
    OneAnswerComponent
  ],
  providers: [
    FormDataService,
    FormService,
  ],
  exports: [
    OneAnswerComponent
  ]
})
export class AnswerDetailModule { }
