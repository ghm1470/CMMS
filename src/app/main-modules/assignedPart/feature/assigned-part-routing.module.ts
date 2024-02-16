import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignedPartComponent} from './_index/assigned-part.component';
import {AssignedPartListComponent} from './list/assigned-part-list.component';


const routes: Routes = [
  {path: '', component: AssignedPartListComponent},
  {path: 'actionPart',
    loadChildren: '../../part/feature/part.module#PartModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedPartRoutingModule { }
