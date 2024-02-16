import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SubmitWorkRequestComponent} from './_index/submit-work-request.component';
import {SubmitWorkRequestActionComponent} from './action/submit-work-request-action.component';


const routes: Routes = [
  {path: '', component: SubmitWorkRequestComponent},
  {path: 'action', component: SubmitWorkRequestActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitWorkRequestRoutingModule {
}
