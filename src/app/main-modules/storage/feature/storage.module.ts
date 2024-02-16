import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageComponent } from './_index/storage.component';
import { StorageActionComponent } from './action/storage-action.component';
import { StorageListComponent } from './list/storage-list.component';
import {StorageRoutingModule} from './storage-routing.module';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {NbValidationModule} from '@angular-boot/validation';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilModule} from '@angular-boot/util';
import {NgSelectModule} from '@ng-select/ng-select';
import {AgmCoreModule} from '@agm/core';
import {AssetModule} from '../../asset/feature/asset.module';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";



@NgModule({
  declarations: [StorageComponent, StorageActionComponent, StorageListComponent],
    imports: [
        CommonModule,
        StorageRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        LoadingSpinnerModule,
        AssetModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB_Q6aCTXoJwoWIY8dKN30p4ZibPNqzEPw',
            language: 'fa',
            region: 'IR',
            libraries: ['places', 'visualization', 'places', 'drawing']
        }),
        ConfermDeleteModule,
        PaginatorModule
    ]
})
export class StorageModule { }
