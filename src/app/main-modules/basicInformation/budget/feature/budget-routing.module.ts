import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BudgetComponent} from './_index/budget.component';
import {BudgetActionComponent} from './action/budget-action.component';

const routes: Routes = [
  {path: '' , component: BudgetComponent},
  {path: 'action' , component: BudgetActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
