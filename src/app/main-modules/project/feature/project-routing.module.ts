import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectComponent} from './_index/project.component';
import {ProjectActionComponent} from './action/project-action.component';
import {ProjectViewComponent} from './view/project-view.component';
import {WorkOrderActionComponent} from '../../workOrder/feature/action/work-order-action.component';
import {WorkOrderModule} from '../../workOrder/feature/work-order.module';

const routes: Routes = [
  {path: '' , component: ProjectComponent},
  {path: 'action' , component: ProjectActionComponent},
  {path: 'view' , component: ProjectViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
