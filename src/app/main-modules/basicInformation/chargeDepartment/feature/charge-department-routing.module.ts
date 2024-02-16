import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChargeDepartmentComponent} from './_index/charge-department.component';
import {ChargeDepartmentActionComponent} from './action/charge-department-action.component';


const routes: Routes = [
  {path: '', component: ChargeDepartmentComponent},
  {path: 'action', component: ChargeDepartmentActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeDepartmentRoutingModule { }
