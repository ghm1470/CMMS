import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkOrderComponent} from './_index/work-order.component';
import {WorkOrderActionComponent} from './action/work-order-action.component';


const routes: Routes = [
  {path: '' , component: WorkOrderComponent},
  {path: 'action' , component: WorkOrderActionComponent,
  },
  {path: 'ViewWorkOrder', component: WorkOrderActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderRoutingModule { }
