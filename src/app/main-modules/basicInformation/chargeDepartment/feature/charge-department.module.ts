import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeDepartmentRoutingModule } from './charge-department-routing.module';
import { ChargeDepartmentComponent } from './_index/charge-department.component';
import { ChargeDepartmentListComponent } from './list/charge-department-list.component';
import { ChargeDepartmentActionComponent } from './action/charge-department-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {ChargeDepartmentService} from '../endpoint/charge-department.service';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';


@NgModule({
  declarations: [ChargeDepartmentComponent, ChargeDepartmentListComponent, ChargeDepartmentActionComponent],
    imports: [
        CommonModule,
        ChargeDepartmentRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
    ],
  providers: [
    ChargeDepartmentService
  ]
})
export class ChargeDepartmentModule { }
