import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTemplateComponent } from './_index/asset-template.component';
import { AssetTemplateActionComponent } from './action/asset-template-action.component';
import { AssetTemplateListComponent } from './list/asset-template-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {AssetTemplateRoutingModule} from './asset-template-routing.module';
import {AssetTemplateService} from '../endpoint/asset-template.service';
import {CategoryService} from '../../category/endpoint/category.service';
import {PropertyService} from '../../basicInformation/property/endpoint/property.service';
import {UploadService} from '../../../shared/service/upload.service';
import {UserService} from '../../user/endpoint/user.service';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {MatRadioModule} from "@angular/material/radio";



@NgModule({
  declarations: [
    AssetTemplateComponent,
    AssetTemplateActionComponent,
    AssetTemplateListComponent,
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
    AssetTemplateRoutingModule,
    LoadingSpinnerModule,
    NgSelectModule,

    ConfermDeleteModule,
    PaginatorModule,
    MatRadioModule,

  ],
  providers: [
    AssetTemplateService,
    CategoryService,
    PropertyService,
    UserService,
    UploadService
  ]
})
export class AssetTemplateModule { }
