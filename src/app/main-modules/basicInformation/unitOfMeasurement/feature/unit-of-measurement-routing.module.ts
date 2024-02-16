import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UnitOfMeasurementComponent} from './_index/unit-of-measurement.component';
import {UnitOfMeasurementActionComponent} from './action/unit-of-measurement-action.component';

const routes: Routes = [
  {path: '' , component: UnitOfMeasurementComponent},
  {path: 'action' , component: UnitOfMeasurementActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitOfMeasurementRoutingModule { }
