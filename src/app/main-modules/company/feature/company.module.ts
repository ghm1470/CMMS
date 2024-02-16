import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './_index/company.component';
import { CompanyActionComponent } from './action/company-action.component';
import { CompanyListComponent } from './list/company-list.component';
import {CompanyService} from '../endpoint/company.service';
import {CityService} from '../../basicInformation/city/endpoint/city.service';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {CompanyRoutingModule} from './company-routing.module';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {CurrencyService} from '../../basicInformation/currency/endpoint/currency.service';
import {UploadService} from '../../../shared/service/upload.service';
import {ProvinceService} from '../../basicInformation/province/endpoint/province.service';
import {DownloadService} from '../../../shared/service/download.service';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [
    CompanyComponent,
    CompanyActionComponent,
    CompanyListComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        LoadingSpinnerModule,
        UtilModule,
        NbValidationModule,
        CompanyRoutingModule,
        NgSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB_Q6aCTXoJwoWIY8dKN30p4ZibPNqzEPw',
            language: 'fa',
            region: 'IR',
            libraries: ['places', 'visualization', 'places', 'drawing']
        }),
        ConfermDeleteModule,
        PaginatorModule
    ],
  providers: [
    UploadService,
    DownloadService,
    ProvinceService,
    CurrencyService,
    CompanyService,
    CityService
  ]
})
export class CompanyModule { }
