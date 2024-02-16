import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OneAnswerComponent} from './one-answer/one-answer.component';

const routes: Routes = [
  {path: '', component: OneAnswerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnswerDetailRoutingModule {
}
