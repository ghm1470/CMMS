import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartComponent } from './_index/part.component';
import { PartActionComponent } from './action/part-action.component';
import { PartListComponent } from './list/part-list.component';
import {PartRoutingModule} from './part-routing.module';
import {CategoryService} from '../../category/endpoint/category.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbValidationModule} from '@angular-boot/validation';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {PropertyService} from '../../basicInformation/property/endpoint/property.service';
import {UserService} from '../../user/endpoint/user.service';
import {UploadService} from '../../../shared/service/upload.service';

import {AssetService} from '../../asset/endpoint/asset.service';
import { PersonalBomComponent } from './personal-bom/personal-bom.component';

import { FileBomComponent } from './file-bom/file-bom.component';
import { LogBomComponent } from './log-bom/log-bom.component';
import {PartService} from '../endpoint/part.service';
import {MeteringModule} from './metering/metering.module';
import {WarrantyModule} from '../warranty/feature/warranty.module';
import {AssetModule} from '../../asset/feature/asset.module';
import {InventoryModule} from '../inventory/feature/inventory.module';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {AssetConsumingReferenceModule} from '../assetConsumingReference/feature/asset-consuming-reference.module';
import {LoadingBarModule} from '../../../shared/loading-bar/loading-bar.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {ExportFileModule} from "../../../shared/export-file/export-file.module";
import { ManufacturerPartComponent } from './manufacturer-part/manufacturer-part.component';
import {CustomDirectiveModule} from "../../../shared/customDirective/custom-directive.module";




@NgModule({
  declarations: [
    PartComponent,
    PartActionComponent,
    PartListComponent,
    PersonalBomComponent,
    FileBomComponent,
    LogBomComponent,
    ManufacturerPartComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        DocumentModule,
        NbValidationModule,
        PartRoutingModule,
        NgSelectModule,
        MeteringModule,
        WarrantyModule,
        AssetModule,
        InventoryModule,
        LoadingBarModule,
        AssetConsumingReferenceModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ExportFileModule,
        CustomDirectiveModule
    ],
  providers: [
    AssetService,
    CategoryService,
    PropertyService,
    UserService,
    UploadService,
    PartService,
    // MeteringService,
  ],
  // exports: [
  //   PartPaginationListComponent
  // ]
})
export class PartModule { }
