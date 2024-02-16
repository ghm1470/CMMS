import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyCategoryRoutingModule } from './property-category-routing.module';
import { PropertyCategoryActionComponent } from './action/property-category-action.component';
import { PropertyCategoryListComponent } from './list/property-category-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NbWidgetsModule} from "@angular-boot/widgets";
import {NbCommonModule} from "@angular-boot/common";
import {UtilModule} from "@angular-boot/util";
import {NbValidationModule} from "@angular-boot/validation";
import {LoadingSpinnerModule} from "../../../../shared/shared/loading-spinner/loading-spinner.module";
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [PropertyCategoryActionComponent, PropertyCategoryListComponent],
    imports: [
        CommonModule,
        PropertyCategoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        NgSelectModule,
        PaginatorModule
    ]
})
export class PropertyCategoryModule { }
