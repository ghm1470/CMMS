import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CurrencyComponent} from './_index/currency.component';
import {CurrencyActionComponent} from './action/currency-action.component';

const routes: Routes = [
  {path: '' , component: CurrencyComponent},
  {path: 'action' , component: CurrencyActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
