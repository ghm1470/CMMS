import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleMaintenanceComponent} from './_index/schedule-maintenance.component';
import {ScheduleMaintenanceActionComponent} from './action/schedule-maintenance-action.component';
import {ScheduleMaintenanceListComponent} from './list/schedule-maintenance-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {ScheduleMaintenanceRoutingModule} from './schedule-maintenance-routing.module';
import {ScheduleWithTimeComponent} from './schedule-with-time/schedule-with-time.component';
import {PartWithUsageCountModule} from '../../workOrder/feature/part-with-usage-count/part-with-usage-count.module';
import {NotifyModule} from '../../workOrder/feature/notify/notify.module';
import { ScheduleMaintenanceTaskGroupComponent } from './schedule-maintenance-task-group/schedule-maintenance-task-group.component';
import {TaskModule} from '../../taskGroup/feature/task/feature/task.module';
import { ScheduleWithMeteringComponent } from './schedule-with-metering/schedule-with-metering.component';
import { TimeModalComponent } from './schedule-with-time/time-modal/time-modal.component';
import { MeteringModalComponent } from './schedule-with-metering/metering-modal/metering-modal.component';
import { ShowScheduledTimeComponent } from './schedule-with-time/show-scheduled-time/show-scheduled-time.component';
import { ShowScheduledMeteringComponent } from './schedule-with-metering/show-scheduled-metering/show-scheduled-metering.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import {ScheduleMaintenanceBasicInformationComponent} from './schedule-maintenance-basic-information/schedule-maintenance-basic-information.component';
import {ScheduleMaintenanceCompletionDetailComponent} from './schedule-maintenance-completion-detail/schedule-maintenance-completion-detail.component';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {PersianPipesModule} from "ngx-persian-pipe";

@NgModule({
  declarations: [
    ScheduleMaintenanceComponent,
    ScheduleMaintenanceActionComponent,
    ScheduleMaintenanceListComponent,
    ScheduleMaintenanceBasicInformationComponent,
    ScheduleMaintenanceCompletionDetailComponent,
    ScheduleWithTimeComponent,
    ScheduleMaintenanceTaskGroupComponent,
    ScheduleWithMeteringComponent,
    TimeModalComponent,
    MeteringModalComponent,
    ShowScheduledTimeComponent,
    ShowScheduledMeteringComponent,
    ViewAssetComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        DocumentModule,
        NbValidationModule,
        NgSelectModule,
        ScheduleMaintenanceRoutingModule,
        PartWithUsageCountModule,
        NotifyModule,
        TaskModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
        PersianPipesModule
    ],
  exports: [
    ViewAssetComponent
  ]
})
export class ScheduleMaintenanceModule {
}
