import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './_index/category.component';
import { CategoryListComponent } from './list/category-list.component';
import {CategoryActionComponent} from './action/category-action.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbValidationModule} from '@angular-boot/validation';
import {CategoryRoutingModule} from './category-routing.module';
import {CategoryService} from '../endpoint/category.service';
import {ActivityService} from '../../activity/service/activity.service';
import {PropertyService} from '../../basicInformation/property/endpoint/property.service';
import {UploadService} from '../../../shared/service/upload.service';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";

@NgModule({
  declarations: [CategoryComponent, CategoryActionComponent, CategoryListComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        CategoryRoutingModule,
        NgSelectModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule
    ],
  providers: [
    ActivityService,
    CategoryService,
    PropertyService,
    UploadService
  ]
})
export class CategoryModule { }
