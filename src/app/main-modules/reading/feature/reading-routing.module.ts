import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReadingListComponent} from './list/reading-list.component';
import {ReadingActionComponent} from './action/reading-action.component';


const routes: Routes = [
  {path: '', component: ReadingListComponent},
  {path: 'action', component: ReadingActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingRoutingModule { }
