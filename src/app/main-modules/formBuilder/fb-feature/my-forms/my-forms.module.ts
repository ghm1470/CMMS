import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyFormsRoutingModule} from './my-forms-routing.module';
// import {AccountService} from '../../shared/account-service/account.service';
import {LanguageService} from '../../shared/language-data-service/language.service';
import {FormService} from '../../fb-service/form.service';
import {FormDataService} from '../../fb-service/form-data.service';
import {UploadService} from '../../shared/services/upload-service/upload.service';
import {ChartComponent} from './chart/chart.component';
import {FormAnalysisComponent} from './form-analysis/form-analysis.component';
import {AnswersListComponent} from './answers-list/answers-list.component';
import {MyFormsComponent} from './my-forms/my-forms.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MyFormsRoutingModule
  ],
  declarations: [
    MyFormsComponent,
    AnswersListComponent,
    // OneAnswerComponent,
    ChartComponent,
    FormAnalysisComponent
  ],
  providers: [
    // AccountService,
    LanguageService,
    FormService,
    FormDataService,
    UploadService,
  ],
  exports: [MyFormsComponent]
})
export class MyFormsModule { }
