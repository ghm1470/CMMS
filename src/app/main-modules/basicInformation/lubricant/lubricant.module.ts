import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LubricantRoutingModule } from './lubricant-routing.module';
import { ActionComponent } from './action/action.component';
import { ListComponent } from './list/list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";


@NgModule({
  declarations: [ActionComponent, ListComponent],
    imports: [
        CommonModule,
        LubricantRoutingModule,
        FormsModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ConfermDeleteModule,
        ReactiveFormsModule
    ]
})
export class LubricantModule { }
