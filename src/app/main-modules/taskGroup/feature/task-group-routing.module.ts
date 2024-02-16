import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TaskGroupComponent} from './_index/task-group.component';
import {TaskGroupActionComponent} from './action/task-group-action.component';

const routes: Routes = [
  {path: 'main' , component: TaskGroupComponent},
  {path: 'main/action' , component: TaskGroupActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskGroupRoutingModule { }
