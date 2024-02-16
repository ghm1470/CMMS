import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalenderRoutingModule} from './calender-routing.module';
import {ListComponent} from './list/list.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {DaySessionListComponent} from './day-session-list/day-session-list.component';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {PersianPipesModule} from "ngx-persian-pipe";
import {MatTooltipModule} from "@angular/material/tooltip";
import {WorkOrderScheduleModule} from "../work-order-schedule/work-order-schedule.module";
import {SchedulingModule} from "../scheduling/scheduling.module";


@NgModule({
    declarations: [ListComponent, DaySessionListComponent],
    imports: [
        CommonModule,
        CalenderRoutingModule,
        NgSelectModule,
        FormsModule,
        NbWidgetsModule,
        PersianPipesModule,
        MatTooltipModule,
        WorkOrderScheduleModule,
        SchedulingModule
    ]
})
export class CalenderModule {
}
