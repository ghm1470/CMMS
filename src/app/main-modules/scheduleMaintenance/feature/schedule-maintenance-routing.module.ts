import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScheduleMaintenanceComponent} from './_index/schedule-maintenance.component';
import {ScheduleMaintenanceActionComponent} from './action/schedule-maintenance-action.component';

const routes: Routes = [
  {path: '' , component: ScheduleMaintenanceComponent},
  {path: 'action' , component: ScheduleMaintenanceActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleMaintenanceRoutingModule { }
