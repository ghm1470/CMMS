import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeOfActivityRoutingModule } from './type-of-activity-routing.module';
import { TypeOfActivityListComponent } from './feature/type-of-activity-list/type-of-activity-list.component';
import { TypeOfActivityActionComponent } from './feature/type-of-activity-action/type-of-activity-action.component';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [TypeOfActivityListComponent, TypeOfActivityActionComponent],
    imports: [
        CommonModule,
        TypeOfActivityRoutingModule,
        ConfermDeleteModule,
        FormsModule,
        NgSelectModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ReactiveFormsModule
    ]
})
export class TypeOfActivityModule { }
