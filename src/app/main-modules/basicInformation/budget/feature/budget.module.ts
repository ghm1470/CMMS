import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './_index/budget.component';
import { BudgetActionComponent } from './action/budget-action.component';
import { BudgetListComponent } from './list/budget-list.component';
import {BudgetRoutingModule} from './budget-routing.module';
import {BudgetService} from '../endpoint/budget.service';
import {NbValidationModule} from '@angular-boot/validation';
import {UtilModule} from '@angular-boot/util';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {CurrencyService} from '../../currency/endpoint/currency.service';
import {LoadingSpinnerModule} from "../../../../shared/shared/loading-spinner/loading-spinner.module";
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxCurrencyModule} from 'ngx-currency';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [BudgetComponent, BudgetActionComponent, BudgetListComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        BudgetRoutingModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        NgSelectModule,
        NgxCurrencyModule,
        PaginatorModule
    ],
  providers: [
    BudgetService,
    CurrencyService
  ]
})
export class BudgetModule { }
