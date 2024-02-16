import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyFormsComponent} from './my-forms/my-forms.component';
import {AnswersListComponent} from './answers-list/answers-list.component';
// import {OneAnswerComponent} from './one-answer/one-answer.component';

const routes: Routes = [
  {path: '', component: MyFormsComponent},
  {path: 'answerList/:formId', component: AnswersListComponent},
  // {path: 'answerDetail/:formDataId/:formId', component: OneAnswerComponent},
  // {path: 'formAnalysis/:formId', component: OneAnswerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MyFormsRoutingModule { }
