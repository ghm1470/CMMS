import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SchedulingComponent } from './scheduling/scheduling.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PartWithUsageCountModule} from "../workOrder/feature/part-with-usage-count/part-with-usage-count.module";
import {CustomDirectiveModule} from "../../shared/customDirective/custom-directive.module";
import {NbDirectivesModule} from "@angular-boot/util";
import {MatRadioModule} from "@angular/material/radio";
import { SchedulingListComponent } from './scheduling-list/scheduling-list.component';
import {PaginatorModule} from "../../shared/paginator/paginator.module";
import {ConfermDeleteModule} from "../../shared/conferm-delete/conferm-delete.module";
import {NbWidgetsModule} from "@angular-boot/widgets";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
    declarations: [SchedulingComponent, SchedulingListComponent],
    exports: [
        SchedulingComponent
    ],
    imports: [
        CommonModule,
        SchedulingRoutingModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        PartWithUsageCountModule,
        CustomDirectiveModule,
        NbDirectivesModule,
        MatRadioModule,
        PaginatorModule,
        ConfermDeleteModule,
        NbWidgetsModule,
        MatTooltipModule
    ]
})
export class SchedulingModule { }
