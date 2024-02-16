import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CategoryComponent} from './_index/category.component';
import {CategoryActionComponent} from './action/category-action.component';

const routes: Routes = [
  {path: '' , component: CategoryComponent},
  {path: 'action' , component: CategoryActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
