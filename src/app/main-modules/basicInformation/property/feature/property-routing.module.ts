import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PropertyComponent} from './_index/property.component';
import {PropertyActionComponent} from './action/property-action.component';

const routes: Routes = [
  {path: '' , component: PropertyComponent},
  {path: 'action' , component: PropertyActionComponent},
  {path: 'view' , component: PropertyActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
