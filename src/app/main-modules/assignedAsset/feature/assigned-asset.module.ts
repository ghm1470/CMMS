import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedAssetRoutingModule } from './assigned-asset-routing.module';
import { AssignedAssetComponent } from './_index/assigned-asset.component';
import { AssignedAssetListComponent } from './list/assigned-asset-list.component';
import { AssignedAssetActionComponent } from './action/assigned-asset-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [AssignedAssetComponent, AssignedAssetListComponent, AssignedAssetActionComponent],
    imports: [
        CommonModule,
        AssignedAssetRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        MatCheckboxModule,
        PaginatorModule,
    ]
})
export class AssignedAssetModule { }
