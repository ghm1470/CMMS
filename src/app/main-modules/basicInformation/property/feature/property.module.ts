import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyComponent } from './_index/property.component';
import { PropertyListComponent } from './list/property-list.component';
import {PropertyRoutingModule} from './property-routing.module';
import {PropertyService} from '../endpoint/property.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {PropertyActionComponent} from './action/property-action.component';
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [
    PropertyComponent,
    PropertyActionComponent,
    PropertyListComponent
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
        PropertyRoutingModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        NgSelectModule,
        PaginatorModule
    ],
  providers: [
    PropertyService
  ]
})
export class PropertyModule { }
