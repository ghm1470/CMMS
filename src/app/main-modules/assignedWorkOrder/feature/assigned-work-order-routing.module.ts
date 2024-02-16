import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignedWorkOrderComponent} from './_index/assigned-work-order.component';
import {AssignedWorkOrderActionComponent} from './action/assigned-work-order-action.component';
import {AssignedWorkOrderListComponent} from "./list/assigned-work-order-list.component";


const routes: Routes = [
  {path: '', component: AssignedWorkOrderListComponent},
  {path: 'action', component: AssignedWorkOrderActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedWorkOrderRoutingModule { }
