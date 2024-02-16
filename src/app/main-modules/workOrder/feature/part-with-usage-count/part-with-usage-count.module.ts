import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import { PartWithUsageCountComponent } from './part-with-usage-count.component';
import {PartWithUsageCountRoutingModule} from './part-with-usage-count-routing.module';
import { ViewPartModalComponent } from './view-part-modal/view-part-modal.component';
import {PaginatorModule} from '../../../../shared/paginator/paginator.module';

@NgModule({
  declarations: [PartWithUsageCountComponent, ViewPartModalComponent],
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
        PartWithUsageCountRoutingModule,
        PaginatorModule
    ],
  exports: [
    PartWithUsageCountComponent,
    ViewPartModalComponent]
})
export class PartWithUsageCountModule { }
