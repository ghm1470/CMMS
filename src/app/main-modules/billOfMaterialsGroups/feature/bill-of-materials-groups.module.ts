import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillOfMaterialsGroupsRoutingModule } from './bill-of-materials-groups-routing.module';
import { BillOfMaterialsGroupsComponent } from './_index/bill-of-materials-groups.component';
import { BillOfMaterialsGroupsListComponent } from './list/bill-of-materials-groups-list.component';
import { BillOfMaterialsGroupsActionComponent } from './action/bill-of-materials-groups-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import { Modal1Component } from './modal1/modal1.component';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { BomPartsComponent } from './bom-parts/bom-parts.component';
import { BomAssetsComponent } from './bom-assets/bom-assets.component';
import { Modal2Component } from './modal2/modal2.component';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [BillOfMaterialsGroupsComponent, BillOfMaterialsGroupsListComponent, BillOfMaterialsGroupsActionComponent, Modal1Component, ViewModalComponent, BomPartsComponent, BomAssetsComponent, Modal2Component],
    imports: [
        CommonModule,
        BillOfMaterialsGroupsRoutingModule, FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        DocumentModule,
        NbValidationModule,
        LoadingSpinnerModule,
        NgSelectModule, ConfermDeleteModule, LoadingSpinnerModule, PaginatorModule,
    ]
})
export class BillOfMaterialsGroupsModule { }
