import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdjustmentInventoryComponent} from './adjustment-inventory.component';


const routes: Routes = [
  {path: '' , component: AdjustmentInventoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentInventoryRoutingModule { }
