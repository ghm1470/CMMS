import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarrantyRoutingModule } from './warranty-routing.module';

import { WarrantyListComponent } from './list/warranty-list.component';
import { WarrantyActionComponent } from './action/warranty-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';
import {PersianPipesModule} from "ngx-persian-pipe";


@NgModule({
  declarations: [ WarrantyListComponent, WarrantyActionComponent],
    imports: [
        CommonModule,
        FormsModule,
        WarrantyRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        NgSelectModule,
        PaginatorModule,
        PersianPipesModule
    ],
  exports: [
    WarrantyListComponent, WarrantyActionComponent
  ]
})
export class WarrantyModule { }
