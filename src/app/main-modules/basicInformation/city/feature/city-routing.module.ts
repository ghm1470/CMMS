import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CityComponent} from './_index/city.component';
import {CityActionComponent} from './action/city-action.component';

const routes: Routes = [
  {path: '' , component: CityComponent},
  {path: 'action' , component: CityActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
