import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder2RoutingModule } from './form-builder2-routing.module';
import {LoadingSpinnerModule} from '../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../shared/conferm-delete/conferm-delete.module';
import {PaginatorModule} from '../../shared/paginator/paginator.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import { FormListComponent } from './form-list/form-list.component';
import { UpsertFormComponent } from './action/upsert-form/upsert-form.component';
import { FormInformationComponent } from './action/upsert-form/form-information/form-information.component';
import { FormFieldsComponent } from './action/upsert-form/form-fields/form-fields.component';
import {NbValidationModule} from "@angular-boot/validation";
import {AlertErrorModule} from "../../shared/alert-error/alert-error.module";
import {NbWidgetsModule} from "@angular-boot/widgets";
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormAnswerComponent } from './form-answer/form-answer.component';


@NgModule({
    declarations: [FormListComponent, UpsertFormComponent, FormInformationComponent, FormFieldsComponent, FormAnswerComponent],
    exports: [
        FormAnswerComponent,
        FormAnswerComponent
    ],
    imports: [
        CommonModule,
        FormBuilder2RoutingModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbValidationModule,
        AlertErrorModule,
        NbWidgetsModule,
        MatTooltipModule
    ],

})
export class FormBuilder2Module { }
