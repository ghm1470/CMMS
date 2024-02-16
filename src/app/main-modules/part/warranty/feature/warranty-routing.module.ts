import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WarrantyActionComponent} from './action/warranty-action.component';


const routes: Routes = [
  {path: 'actionForWarranty' , component: WarrantyActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarrantyRoutingModule { }
