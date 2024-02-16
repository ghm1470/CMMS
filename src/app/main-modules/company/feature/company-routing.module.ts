import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompanyComponent} from './_index/company.component';
import {CompanyActionComponent} from './action/company-action.component';

const routes: Routes = [
  {path: '' , component: CompanyComponent},
  {path: 'action' , component: CompanyActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
