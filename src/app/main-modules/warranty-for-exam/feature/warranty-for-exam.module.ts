import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarrantyForExamRoutingModule } from './warranty-for-exam-routing.module';
import { WarrantyForExamComponent } from './_index/warranty-for-exam.component';
import { WarrantyForExamListComponent } from './list/warranty-for-exam-list.component';
import { WarrantyForExamActionComponent } from './action/warranty-for-exam-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [WarrantyForExamComponent, WarrantyForExamListComponent, WarrantyForExamActionComponent],
  imports: [
    CommonModule,
    FormsModule,
    WarrantyForExamRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbWidgetsModule,
    NbCommonModule,
    UtilModule,
    NbValidationModule,
    NgSelectModule,
  ]
})
export class WarrantyForExamModule { }
