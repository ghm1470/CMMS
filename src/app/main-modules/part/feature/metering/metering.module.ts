import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteringRoutingModule } from './metering-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {MeteringActionComponent} from './metering-bom/action/metering-action.component';
import {MeteringListComponent} from './metering-bom/list/metering-list.component';
import {LoadingBarModule} from '../../../../shared/loading-bar/loading-bar.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';
import {PersianPipesModule} from "ngx-persian-pipe";



@NgModule({
  declarations: [
    MeteringActionComponent,
    MeteringListComponent],
    imports: [
        CommonModule,
        MeteringRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        LoadingBarModule,
        LoadingSpinnerModule,
        PaginatorModule,
        PersianPipesModule
    ],
  exports: [
    MeteringListComponent
  ]
})
export class MeteringModule { }
