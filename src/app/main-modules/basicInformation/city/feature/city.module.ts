import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityComponent } from './_index/city.component';
import { CityActionComponent } from './action/city-action.component';
import { CityListComponent } from './list/city-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {AgmCoreModule} from '@agm/core';
import {CityRoutingModule} from './city-routing.module';
import {CityService} from '../endpoint/city.service';
import {ProvinceService} from '../../province/endpoint/province.service';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {PaginatorModule} from "../../../../shared/paginator/paginator.module";

@NgModule({
  declarations: [CityComponent, CityActionComponent, CityListComponent],
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
    CityRoutingModule,
    LoadingSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_Q6aCTXoJwoWIY8dKN30p4ZibPNqzEPw',
      language: 'fa',
      region: 'IR',
      libraries: ['places', 'visualization', 'places', 'drawing']
    }),
    LoadingSpinnerModule,
    ConfermDeleteModule,
    PaginatorModule
  ],
  providers: [
    ProvinceService,
    CityService
  ]
})
export class CityModule { }
