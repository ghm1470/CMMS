import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InventoryActionComponent} from './action/inventory-action.component';


const routes: Routes = [
  {path: 'action' , component: InventoryActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
