import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BillOfMaterialsGroupsComponent} from './_index/bill-of-materials-groups.component';
import {BillOfMaterialsGroupsActionComponent} from './action/bill-of-materials-groups-action.component';


const routes: Routes = [
  {path: '', component: BillOfMaterialsGroupsComponent},
  {path: 'index', component: BillOfMaterialsGroupsComponent},
  {path: 'action', component: BillOfMaterialsGroupsActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillOfMaterialsGroupsRoutingModule { }
