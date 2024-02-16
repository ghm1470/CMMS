import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkTableHistoryListComponent} from './list/work-table-history-list.component';
import {WorkTableHistoryActionComponent} from './action/work-table-history-action.component';


const routes: Routes = [
  {path: '', component: WorkTableHistoryListComponent},
  {path: 'action', component: WorkTableHistoryActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkTableHistoryRoutingModule {}
