import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkTableScheduleRoutingModule } from './work-table-schedule-routing.module';
import { ListComponent } from './feature/list/list.component';
import { ActionComponent } from './feature/action/action.component';
import {PaginatorModule} from '../../shared/paginator/paginator.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {NbWidgetsModule} from "@angular-boot/widgets";
import {PartWithUsageCountModule} from "../workOrder/feature/part-with-usage-count/part-with-usage-count.module";
import {NbDirectivesModule} from "@angular-boot/util";
import {CustomDirectiveModule} from "../../shared/customDirective/custom-directive.module";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [ListComponent, ActionComponent],
    imports: [
        CommonModule,
        WorkTableScheduleRoutingModule,
        PaginatorModule,
        NgSelectModule,
        FormsModule,
        PersianPipesModule,
        ReactiveFormsModule,
        NbWidgetsModule,
        PartWithUsageCountModule,
        NbDirectivesModule,
        CustomDirectiveModule,
        MatTooltipModule,
    ]
})
export class WorkTableScheduleModule { }
