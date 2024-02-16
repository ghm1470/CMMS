import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PartWithUsageCountComponent} from './part-with-usage-count.component';

const routes: Routes = [
  {path: '' , component: PartWithUsageCountComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartWithUsageCountRoutingModule { }
