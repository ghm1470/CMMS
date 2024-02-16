import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkOrderComponent} from './_index/work-order.component';
import {WorkOrderActionComponent} from './action/work-order-action.component';
import {WorkOrderListComponent} from './list/work-order-list.component';
import {WorkOrderRoutingModule} from './work-order-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {WorkOrderBasicInformationComponent} from './work-order-basic-information/work-order-basic-information.component';
import {CompletionDetailComponent} from './completion-detail/completion-detail.component';
import {MiscCostComponent} from './misc-cost/misc-cost.component';
import {WorkOrderTaskGroupComponent} from './work-order-task-group/work-order-task-group.component';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {MatCheckboxModule} from '@angular/material';
import {TaskGroupModule} from '../../taskGroup/feature/task-group.module';
import {TaskModule} from '../../taskGroup/feature/task/feature/task.module';
import {PartWithUsageCountModule} from './part-with-usage-count/part-with-usage-count.module';
import {NotifyModule} from './notify/notify.module';
import {ProjectModule} from '../../project/feature/project.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {LoadingFullModule} from '../../../shared/shared/loading-full/loading-full.module';
import {ScheduleMaintenanceModule} from '../../scheduleMaintenance/feature/schedule-maintenance.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import { CompletionDetailWorkTableComponent } from './completion-detail-work-table/completion-detail-work-table.component';
import { MiscCostWorkTableComponent } from './misc-cost-work-table/misc-cost-work-table.component';
import { NotifyWorkTableComponent } from './notify-work-table/notify-work-table.component';
import { PartWithUsageCountWorkTableComponent } from './part-with-usage-count-work-table/part-with-usage-count-work-table.component';
import { WorkOrderBasicInformationWorkTableComponent } from './work-order-basic-information-work-table/work-order-basic-information-work-table.component';
import { WorkOrderTaskGroupWorkTableComponent } from './work-order-task-group-work-table/work-order-task-group-work-table.component';
import {FormCompleteModule} from '../../formBuilder/fb-feature/form-complete/form-complete.module';
import {WorkOrderCarouselComponent} from './work-order-carousel/work-order-carousel.component';
import { CompletionDetailWorkTViewComponent } from './completion-detail-work-t-view/completion-detail-work-t-view.component';
import { WorkOrderTaskGroupWorkTViewComponent } from './work-order-task-group-work-tview/work-order-task-group-work-tview.component';
import { PartWithUsageCountWorkTViewComponent } from './part-with-usage-count-work-tview/part-with-usage-count-work-tview.component';
import { MiscCostWorkTViewComponent } from './misc-cost-work-tview/misc-cost-work-tview.component';
import { NotifyWorkTViewComponent } from './notify-work-tview/notify-work-tview.component';
import {WorkOrderBasicInfoWorkTViewComponent} from './work-order-basic-info-work-tview/work-order-basic-info-work-tview.component';
import { WorkOrderCarsouselViewComponent } from './work-order-carsousel-view/work-order-carsousel-view.component';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import { NewFormWorkOrderKhalesComponent } from './new-form-work-order-khales/new-form-work-order-khales.component';
import {CustomDirectiveModule} from '../../../shared/customDirective/custom-directive.module';
import {PersianPipesModule} from "ngx-persian-pipe";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AssetModule} from "../../asset/feature/asset.module";

@NgModule({
  declarations: [
    WorkOrderComponent,
    WorkOrderActionComponent,
    WorkOrderListComponent,
    WorkOrderBasicInformationComponent,
    CompletionDetailComponent,
    MiscCostComponent,
    WorkOrderTaskGroupComponent,
    WorkOrderCarouselComponent,
    CompletionDetailWorkTableComponent,
    MiscCostWorkTableComponent,
    NotifyWorkTableComponent,
    PartWithUsageCountWorkTableComponent,
    WorkOrderBasicInformationWorkTableComponent,
    WorkOrderTaskGroupWorkTableComponent,
    CompletionDetailWorkTViewComponent,
    WorkOrderTaskGroupWorkTViewComponent,
    PartWithUsageCountWorkTViewComponent,
    MiscCostWorkTViewComponent,
    NotifyWorkTViewComponent,
    WorkOrderBasicInfoWorkTViewComponent,
    WorkOrderCarsouselViewComponent,
    NewFormWorkOrderKhalesComponent,
  ],
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
        DocumentModule,
        MatCheckboxModule,
        TaskGroupModule,
        WorkOrderRoutingModule,
        TaskModule,
        PartWithUsageCountModule,
        NotifyModule,
        ProjectModule,
        LoadingFullModule,
        LoadingSpinnerModule,
        ScheduleMaintenanceModule,
        ConfermDeleteModule,
        FormCompleteModule,
        PaginatorModule,
        CustomDirectiveModule,
        PersianPipesModule,
        MatTooltipModule,
        AssetModule,


    ],
    exports: [
        WorkOrderComponent,
        WorkOrderCarsouselViewComponent,
        WorkOrderCarouselComponent,
        WorkOrderBasicInformationWorkTableComponent,
        CompletionDetailWorkTableComponent,
        NotifyWorkTableComponent,
        MiscCostWorkTableComponent,
        PartWithUsageCountWorkTableComponent,
        WorkOrderActionComponent,
        WorkOrderListComponent,
        WorkOrderBasicInformationComponent,
        CompletionDetailComponent,
        MiscCostComponent,
        WorkOrderTaskGroupComponent,
        WorkOrderTaskGroupWorkTableComponent,
        CompletionDetailWorkTViewComponent,
        WorkOrderTaskGroupWorkTViewComponent,
        PartWithUsageCountWorkTViewComponent,
        MiscCostWorkTViewComponent,
        NotifyWorkTViewComponent,
        WorkOrderBasicInfoWorkTViewComponent,
        NewFormWorkOrderKhalesComponent,
    ]
})
export class WorkOrderModule {
}
