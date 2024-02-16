import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitOfMeasurementComponent } from './_index/unit-of-measurement.component';
import { UnitOfMeasurementActionComponent } from './action/unit-of-measurement-action.component';
import { UnitOfMeasurementListComponent } from './list/unit-of-measurement-list.component';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbValidationModule} from '@angular-boot/validation';
import {UtilModule} from '@angular-boot/util';
import {UnitOfMeasurementRoutingModule} from './unit-of-measurement-routing.module';
import {UnitOfMeasurementService} from '../endpoint/unit-of-measurement.service';
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [
    UnitOfMeasurementComponent,
    UnitOfMeasurementActionComponent,
    UnitOfMeasurementListComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        UnitOfMeasurementRoutingModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule
    ],
  providers: [
    UnitOfMeasurementService
  ]
})
export class UnitOfMeasurementModule { }
