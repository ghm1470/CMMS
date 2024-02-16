import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadingRoutingModule } from './reading-routing.module';
import { ReadingComponent } from './_index/reading.component';
import { ReadingListComponent } from './list/reading-list.component';
import { ReadingActionComponent } from './action/reading-action.component';
import { AssetViewComponent } from './asset-view/asset-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {MeteringRoutingModule} from '../../part/feature/metering/metering-routing.module';
import {LoadingBarModule} from '../../../shared/loading-bar/loading-bar.module';
import { ReadingViewComponent } from './reading-view/reading-view.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';


@NgModule({
  declarations: [ReadingComponent, ReadingListComponent, ReadingActionComponent, AssetViewComponent, ReadingViewComponent],
    imports: [
        ReadingRoutingModule,
        CommonModule,
        LoadingSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        MeteringRoutingModule,
        LoadingBarModule,
        PaginatorModule,
        ConfermDeleteModule
    ]
})
export class ReadingModule { }
