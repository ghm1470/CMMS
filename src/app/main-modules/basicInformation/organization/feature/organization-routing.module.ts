import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrganizationComponent} from './_index/organization.component';
import {OrganizationActionComponent} from './action/organization-action.component';

const routes: Routes = [
  {path: '' , component: OrganizationComponent},
  {path: 'action' , component: OrganizationActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
