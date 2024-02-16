import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinceRoutingModule } from './province-routing.module';
import { ProvinceComponent } from './_index/province.component';
import { ProvinceListComponent } from './list/province-list.component';
import { ProvinceActionComponent } from './action/province-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {AgmCoreModule} from '@agm/core';
import {ProvinceService} from '../endpoint/province.service';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';
import {ConfermDeleteModule} from "../../../../shared/conferm-delete/conferm-delete.module";

@NgModule({
  declarations: [ProvinceComponent, ProvinceListComponent, ProvinceActionComponent],
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBB7YgTJG5HnVG1WLe51VI38Jb_YwYxDOM',
            libraries: ['places']
        }),
        ProvinceRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ConfermDeleteModule,
    ],
  providers: [
    ProvinceService
  ]
})
export class ProvinceModule { }
