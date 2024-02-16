import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryListComponent } from './list/inventory-list.component';
import { InventoryActionComponent } from './action/inventory-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import { InventoryViewComponent } from './view/inventory-view.component';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';
import {CustomDirectiveModule} from "../../../../shared/customDirective/custom-directive.module";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryActionComponent,
    InventoryViewComponent
  ],
    imports: [
        CommonModule,
        InventoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        PersianPipesModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule,
        CustomDirectiveModule,
        MatTooltipModule
    ],
    exports: [
        InventoryActionComponent, InventoryListComponent, InventoryViewComponent
    ]
})
export class InventoryModule { }
