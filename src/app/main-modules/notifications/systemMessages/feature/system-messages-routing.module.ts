import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemMessagesComponent} from './_index/system-messages.component';
import {ViewComponent} from './view/view.component';
import {SystemMessagesListComponent} from "./list/system-messages-list.component";


const routes: Routes = [
  {path: '', component: SystemMessagesListComponent},
  {path: 'inbox',
    loadChildren: '../../inbox/feature/inbox.module#InboxModule'},
  {path: 'view', component: ViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemMessagesRoutingModule { }
