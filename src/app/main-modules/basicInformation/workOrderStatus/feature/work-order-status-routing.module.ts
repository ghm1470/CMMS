import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkOrderStatusComponent} from './_index/work-order-status.component';
import {WorkOrderStatusActionComponent} from './action/work-order-status-action.component';

const routes: Routes = [
  {path: '' , component: WorkOrderStatusComponent},
  {path: 'action' , component: WorkOrderStatusActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderStatusRoutingModule { }
