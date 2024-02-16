import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShowTheTrendHereComponent} from './show-the-trend-here/show-the-trend-here.component';
import {AuthGuardService} from '../../../shared/service/auth-guard.service';
import {WorktableListComponent} from './list/worktable-list.component';
import {WorktableActionComponent} from './action/worktable-action.component';

const routes: Routes = [
  {path: '', component: WorktableListComponent},
  {path: 'action' , component: WorktableActionComponent,
    canActivate: [AuthGuardService]},
  {path: 'action/TrendHere',  component: ShowTheTrendHereComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorktableRoutingModule { }
