import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './_index/organization.component';
import { OrganizationActionComponent } from './action/organization-action.component';
import { OrganizationListComponent } from './list/organization-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {OrganizationService} from '../endpoint/organization.service';
import {OrganizationRoutingModule} from './organization-routing.module';
import { AgmCoreModule } from '@agm/core';
import {CityService} from '../../city/endpoint/city.service';
import {ProvinceService} from '../../province/endpoint/province.service';
import {LoadingSpinnerModule} from "../../../../shared/shared/loading-spinner/loading-spinner.module";
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";


@NgModule({
  declarations: [OrganizationComponent, OrganizationActionComponent, OrganizationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbWidgetsModule,
    NbCommonModule,
    UtilModule,
    NbValidationModule,
    OrganizationRoutingModule,
    NgSelectModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_Q6aCTXoJwoWIY8dKN30p4ZibPNqzEPw',
      language: 'fa',
      region: 'IR',
      libraries: ['places', 'visualization', 'places', 'drawing']
    }),
    LoadingSpinnerModule,
    ConfermDeleteModule
  ],
  providers: [
    OrganizationService,
    ProvinceService,
    CityService
  ]
})
export class OrganizationModule { }
