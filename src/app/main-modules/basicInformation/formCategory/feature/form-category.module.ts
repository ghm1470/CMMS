import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCategoryComponent } from './_index/form-category.component';
import { FormCategoryActionComponent } from './action/form-category-action.component';
import { FormCategoryListComponent } from './list/form-category-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {FormCategoryRoutingModule} from './form-category-routing.module';
import {FormCategoryService} from '../endpoint/form-category.service';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [FormCategoryComponent, FormCategoryActionComponent, FormCategoryListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbWidgetsModule,
    NbCommonModule,
    UtilModule,
    NbValidationModule,
    FormCategoryRoutingModule,
    ConfermDeleteModule,
    LoadingSpinnerModule,
    PaginatorModule,
  ],
  providers: [
    FormCategoryService
  ]
})
export class FormCategoryModule { }
