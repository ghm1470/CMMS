import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetConsumingReferenceRoutingModule } from './asset-consuming-reference-routing.module';
import { AssetConsumingReferenceComponent } from './_index/asset-consuming-reference.component';
import { AssetConsumingReferenceListComponent } from './list/asset-consuming-reference-list.component';
import { AssetConsumingReferenceActionComponent } from './action/asset-consuming-reference-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {AssetConsumingReferenceViewComponent} from './view/asset-consuming-reference-view.component';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";
import {EnToFaModule} from "../../../../shared/pipe/en-to-fa/en-to-fa.module";


@NgModule({
  declarations: [AssetConsumingReferenceComponent, AssetConsumingReferenceListComponent, AssetConsumingReferenceActionComponent, AssetConsumingReferenceViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        LoadingSpinnerModule,
        AssetConsumingReferenceRoutingModule,
        ConfermDeleteModule,
        PaginatorModule,
        EnToFaModule

    ],
  exports: [
    AssetConsumingReferenceActionComponent, AssetConsumingReferenceListComponent
  ]
})
export class AssetConsumingReferenceModule { }
