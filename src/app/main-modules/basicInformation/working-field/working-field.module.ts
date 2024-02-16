import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkingFieldRoutingModule } from './working-field-routing.module';
import { WorkingFieldActionComponent } from './feature/working-field-action/working-field-action.component';
import { WorkingFieldListComponent } from './feature/working-field-list/working-field-list.component';
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";


@NgModule({
  declarations: [WorkingFieldActionComponent, WorkingFieldListComponent],
    imports: [
        CommonModule,
        WorkingFieldRoutingModule,
        LoadingSpinnerModule,
        FormsModule,
        PaginatorModule,
        ConfermDeleteModule,
        ReactiveFormsModule
    ]
})
export class WorkingFieldModule { }
