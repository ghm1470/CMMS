import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CurrentInventoryActionComponent} from './action/current-inventory-action.component';
import {CurrentInventoryListComponent} from "./list/current-inventory-list.component";

const routes: Routes = [
  {path: '' , component: CurrentInventoryListComponent},
  {path: 'action', component: CurrentInventoryActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentInventoryRoutingModule { }
