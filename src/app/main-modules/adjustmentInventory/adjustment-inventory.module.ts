import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdjustmentInventoryRoutingModule } from './adjustment-inventory-routing.module';
import {AdjustmentInventoryComponent} from './adjustment-inventory.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {CurrentComponent} from './current/current.component';
import {LoadingSpinnerModule} from '../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../shared/paginator/paginator.module";


@NgModule({
  declarations: [AdjustmentInventoryComponent, CurrentComponent],
    imports: [
        FormsModule,
        CommonModule,
        AdjustmentInventoryRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        LoadingSpinnerModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        PaginatorModule,
    ]
})
export class AdjustmentInventoryModule { }
