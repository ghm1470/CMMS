import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PurchaseComponent} from './_index/purchase.component';
import {PurchaseActionComponent} from './action/purchase-action.component';

const routes: Routes = [
  {path: '' , component: PurchaseComponent},
  {path: 'action' , component: PurchaseActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
