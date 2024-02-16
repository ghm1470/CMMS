import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DegreeOfImportanceRoutingModule } from './degree-of-importance-routing.module';
import { DegreeOfImportanceListComponent } from './feature/degree-of-importance-list/degree-of-importance-list.component';
import { DegreeOfImportanceActionComponent } from './feature/degree-of-importance-action/degree-of-importance-action.component';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [DegreeOfImportanceListComponent, DegreeOfImportanceActionComponent],
    imports: [
        CommonModule,
        DegreeOfImportanceRoutingModule,
        ConfermDeleteModule,
        PaginatorModule,
        LoadingSpinnerModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DegreeOfImportanceModule { }
