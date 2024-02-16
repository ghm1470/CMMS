import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './_index/purchase.component';
import { PurchaseActionComponent } from './action/purchase-action.component';
import { PurchaseListComponent } from './list/purchase-list.component';
import {PurchaseRoutingModule} from './purchase-routing.module';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {NbValidationModule} from '@angular-boot/validation';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompanyService} from '../../../company/endpoint/company.service';
import {CurrencyService} from '../../currency/endpoint/currency.service';
import {PurchaseService} from '../endpoint/purchase.service';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseActionComponent,
    PurchaseListComponent
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
    LoadingSpinnerModule,
    PurchaseRoutingModule
  ],
  providers: [
    CompanyService,
    CurrencyService,
    PurchaseService
  ]
})
export class PurchaseModule { }
