import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentInventoryRoutingModule } from './current-inventory-routing.module';
import { CurrentInventoryComponent } from './_index/current-inventory.component';
import { CurrentInventoryListComponent } from './list/current-inventory-list.component';
import { CurrentInventoryActionComponent } from './action/current-inventory-action.component';
import {InventoryModule} from '../../part/inventory/feature/inventory.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {CurrentInventoryViewComponent} from './view/current-inventory-view.component';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {CustomDirectiveModule} from "../../../shared/customDirective/custom-directive.module";
import {TooltipModule} from "ngx-tooltip";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ExportFileModule} from "../../../shared/export-file/export-file.module";



@NgModule({
  declarations: [CurrentInventoryComponent, CurrentInventoryListComponent, CurrentInventoryActionComponent, CurrentInventoryViewComponent],
    imports: [
        CommonModule,
        CurrentInventoryRoutingModule,
        InventoryModule,
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
        MatCheckboxModule,
        PaginatorModule,
        CustomDirectiveModule,
        TooltipModule,
        MatTooltipModule,
        ExportFileModule,
    ]
})
export class CurrentInventoryModule { }

