import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InboxComponent} from './_index/inbox.component';
import {InboxActionComponent} from './action/inbox-action.component';
import {InboxViewComponent} from './view/inbox-view.component';
import {InboxListComponent} from "./list/inbox-list.component";


const routes: Routes = [
  {path: '', component: InboxListComponent},
  {path: 'action', component: InboxActionComponent},
  {path: 'view', component: InboxViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
