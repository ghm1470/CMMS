import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddFormCategoryComponent} from './add-form-category/add-form-category.component';
import {FormCategoryListComponent} from './form-category-list/form-category-list.component';

const routes: Routes = [
  {
    path: 'addCategory',
    component: AddFormCategoryComponent
  },
  {
    path: 'editCategory/:categoryId',
    component: AddFormCategoryComponent
  },
  {
    path: '',
    component: FormCategoryListComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCategoryRoutingModule {
}
