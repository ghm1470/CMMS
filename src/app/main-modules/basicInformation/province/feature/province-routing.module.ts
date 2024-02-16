import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProvinceActionComponent} from './action/province-action.component';
import {ProvinceComponent} from './_index/province.component';


const routes: Routes = [
  {path: '', component: ProvinceComponent},
  {path: 'action', component: ProvinceActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinceRoutingModule { }
