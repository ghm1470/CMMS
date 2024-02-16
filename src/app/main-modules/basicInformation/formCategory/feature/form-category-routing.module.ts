import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormCategoryComponent} from './_index/form-category.component';
import {FormCategoryActionComponent} from './action/form-category-action.component';


const routes: Routes = [
  {path: '' , component: FormCategoryComponent},
  {path: 'action' , component: FormCategoryActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCategoryRoutingModule { }
