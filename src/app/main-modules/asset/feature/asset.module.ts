import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssetComponent} from './_index/asset.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {AssetTemplateService} from '../../assetTemplate/endpoint/asset-template.service';
import {PropertyService} from '../../basicInformation/property/endpoint/property.service';
import {AssetRoutingModule} from './asset-routing.module';
import {NbValidationModule} from '@angular-boot/validation';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from '../../category/endpoint/category.service';
import {UserService} from '../../user/endpoint/user.service';
import {UploadService} from '../../../shared/service/upload.service';
import {AssetService} from '../endpoint/asset.service';
import {Persian2EnglishDirective} from '../../../shared/directives/persian2English.directive';
import {AssetBasicInformationComponent} from './asset-basic-information/asset-basic-information.component';
import {ProvinceService} from '../../basicInformation/province/endpoint/province.service';
import {CityService} from '../../basicInformation/city/endpoint/city.service';
import {DownloadService} from '../../../shared/service/download.service';
import {ChargeDepartmentService} from '../../basicInformation/chargeDepartment/endpoint/charge-department.service';
import {BudgetService} from '../../basicInformation/budget/endpoint/budget.service';
import {AgmCoreModule} from '@agm/core';
import {PartListForAssetComponent} from './part-list-for-asset/part-list-for-asset.component';
import {PartService} from '../../part/endpoint/part.service';
import {CompanyListForAssetComponent} from './company-list-for-asset/company-list-for-asset.component';
import {CompanyService} from '../../company/endpoint/company.service';
import {DocumentListForAssetComponent} from './document-list-for-asset/document-list-for-asset.component';
import {UserListForAssetComponent} from './user-list-for-asset/user-list-for-asset.component';
import {PropertyListForAssetComponent} from './property-list-for-asset/property-list-for-asset.component';
import {MeteringModule} from '../../part/feature/metering/metering.module';
import {WarrantyModule} from '../../part/warranty/feature/warranty.module';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {TreeListComponent} from './tree-list/tree-list.component';
import {TreeActionComponent} from './tree-action/tree-action.component';
import {TreeViewComponent} from './tree-view/tree-view.component';
import {TreeViewCompleteComponent} from './tree-view-complete/tree-view-complete.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {UploadDocumentModule} from '../../upload-file/upload-document/upload-document.module';
import {MatRadioModule} from '@angular/material';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {EnToFaModule} from '../../../shared/pipe/en-to-fa/en-to-fa.module';
import {AssetCategoryService} from "../../basicInformation/asset-category/endpoint/asset-category.service";
import {CustomDirectiveModule} from "../../../shared/customDirective/custom-directive.module";
import { ConsumedResourcesComponent } from './tree-action/consumed-resources/consumed-resources.component';
import { TechnicalInformationComponent } from './tree-action/technical-information/technical-information.component';
import { ManufacturerComponent } from './tree-action/manufacturer/manufacturer.component';
import { LubricantTabComponent } from './tree-action/lubricant-tab/lubricant-tab.component';
import { WarrantyTabComponent } from './tree-action/warranty-tab/warranty-tab.component';
import {ExportFileModule} from "../../../shared/export-file/export-file.module";


@NgModule({
    declarations: [
        AssetComponent,
        Persian2EnglishDirective,
        AssetBasicInformationComponent,
        PartListForAssetComponent,
        CompanyListForAssetComponent,
        DocumentListForAssetComponent,
        UserListForAssetComponent,
        PropertyListForAssetComponent,
        TreeListComponent,
        TreeActionComponent,
        TreeViewComponent,
        TreeViewCompleteComponent,
        ConsumedResourcesComponent,
        TechnicalInformationComponent,
        ManufacturerComponent,
        LubricantTabComponent,
        WarrantyTabComponent,
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
        AssetRoutingModule,
        MeteringModule,
        WarrantyModule,
        DocumentModule,
        LoadingSpinnerModule,
        MatRadioModule,
        NgSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB_Q6aCTXoJwoWIY8dKN30p4ZibPNqzEPw',
            language: 'fa',
            region: 'IR',
            libraries: ['places', 'visualization', 'places', 'drawing']
        }),
        ConfermDeleteModule,
        UploadDocumentModule,
        PaginatorModule,
        EnToFaModule,
        CustomDirectiveModule,
        ExportFileModule,

    ],
    providers: [
        ChargeDepartmentService,
        AssetTemplateService,
        DownloadService,
        CategoryService,
        PropertyService,
        ProvinceService,
        CompanyService,
        BudgetService,
        UploadService,
        AssetService,
        PartService,
        CityService,
        UserService,
        AssetCategoryService
    ],
    exports: [
        DocumentListForAssetComponent,
        UserListForAssetComponent,
        TreeViewComponent,
        Persian2EnglishDirective
    ]
})
export class AssetModule {
}
