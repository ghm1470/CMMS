import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserActionComponent} from './action/user-action.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UserListComponent} from './list/user-list.component';

const routes: Routes = [
  {path: '' , component: UserListComponent},
  {path: 'action' , component: UserActionComponent},
  {path: 'view' , component: UserViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
