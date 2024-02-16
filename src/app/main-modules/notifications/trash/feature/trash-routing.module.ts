import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TrashComponent} from './_index/trash.component';
import {TrashListComponent} from "./list/trash-list.component";


const routes: Routes = [
  {path: '', component: TrashListComponent},
  {path: 'inbox',
    loadChildren: '../../inbox/feature/inbox.module#InboxModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashRoutingModule { }
