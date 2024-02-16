import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderStatusComponent } from './_index/work-order-status.component';
import { WorkOrderStatusListComponent } from './list/work-order-status-list.component';
import {WorkOrderStatusActionComponent} from './action/work-order-status-action.component';
import {WorkOrderStatusService} from '../endpoint/work-order-status.service';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbValidationModule} from '@angular-boot/validation';
import {WorkOrderStatusRoutingModule} from './work-order-status-routing.module';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [
    WorkOrderStatusComponent,
    WorkOrderStatusActionComponent,
    WorkOrderStatusListComponent
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
    WorkOrderStatusRoutingModule,
    LoadingSpinnerModule,
    ConfermDeleteModule,
    NgSelectModule,
    PaginatorModule
  ],
  providers: [
    WorkOrderStatusService
  ]
})
export class WorkOrderStatusModule { }
