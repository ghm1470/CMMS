import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './_index/currency.component';
import { CurrencyActionComponent } from './action/currency-action.component';
import { CurrencyListComponent } from './list/currency-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {CurrencyService} from '../endpoint/currency.service';
import {CurrencyRoutingModule} from './currency-routing.module';
import {LoadingSpinnerModule} from "../../../../shared/shared/loading-spinner/loading-spinner.module";
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [
    CurrencyComponent,
    CurrencyActionComponent,
    CurrencyListComponent
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
        CurrencyRoutingModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule
    ],
  providers: [
    CurrencyService
  ]
})
export class CurrencyModule { }
