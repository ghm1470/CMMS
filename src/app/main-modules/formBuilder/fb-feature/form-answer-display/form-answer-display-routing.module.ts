import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormAnswerDisplayComponent} from './form-answer-display/form-answer-display.component';

const routes: Routes = [
  {path: '', component: FormAnswerDisplayComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormAnswerDisplayRoutingModule { }
