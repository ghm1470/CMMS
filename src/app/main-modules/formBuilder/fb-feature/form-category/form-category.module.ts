import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormCategoryRoutingModule} from './form-category-routing.module';
import {AddFormCategoryComponent} from './add-form-category/add-form-category.component';
import {FormCategoryListComponent} from './form-category-list/form-category-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormCategoryService} from '../../fb-service/formCategory.service';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from '../../../../shared/service/data.service';
import {LoadingBarModule} from '../../../../shared/loading-bar/loading-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormCategoryRoutingModule,
    HttpClientModule,
    FormsModule,
    LoadingBarModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  ],
  declarations: [AddFormCategoryComponent, FormCategoryListComponent],
  providers: [
    FormCategoryService,
    DataService
  ]
})
export class FormCategoryModule {
}
