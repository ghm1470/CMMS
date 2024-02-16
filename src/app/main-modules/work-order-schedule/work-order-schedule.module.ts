import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkOrderScheduleRoutingModule } from './work-order-schedule-routing.module';
import { ActionComponent } from './feature/action/action.component';
import { ListComponent } from './feature/list/list.component';
import {NbWidgetsModule} from "@angular-boot/widgets";
import {PaginatorModule} from "../../shared/paginator/paginator.module";
import {PersianPipesModule} from "ngx-persian-pipe";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PartWithUsageCountModule} from "../workOrder/feature/part-with-usage-count/part-with-usage-count.module";
import {NbDirectivesModule} from "@angular-boot/util";
import {CustomDirectiveModule} from "../../shared/customDirective/custom-directive.module";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
    declarations: [ActionComponent, ListComponent],
    exports: [
        ActionComponent
    ],
    imports: [
        CommonModule,
        WorkOrderScheduleRoutingModule,
        NbWidgetsModule,
        PaginatorModule,
        PersianPipesModule,
        NgSelectModule,
        ReactiveFormsModule,
        MatTooltipModule,
        PartWithUsageCountModule,
        NbDirectivesModule,
        CustomDirectiveModule,
        MatRadioModule,
        FormsModule
    ]
})
export class WorkOrderScheduleModule { }
