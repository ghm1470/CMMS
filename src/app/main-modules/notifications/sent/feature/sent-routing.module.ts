import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SentComponent} from './_index/sent.component';
import {SentListComponent} from "./list/sent-list.component";


const routes: Routes = [
  {path: '', component: SentListComponent},
  {path: 'inbox',
    loadChildren: '../../inbox/feature/inbox.module#InboxModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentRoutingModule { }
