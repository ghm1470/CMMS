import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedWorkOrderRoutingModule } from './assigned-work-order-routing.module';
import { AssignedWorkOrderComponent } from './_index/assigned-work-order.component';
import { AssignedWorkOrderListComponent } from './list/assigned-work-order-list.component';
import { AssignedWorkOrderActionComponent } from './action/assigned-work-order-action.component';
import { AssignedWorkOrderViewComponent } from './view/assigned-work-order-view/assigned-work-order-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {MatCheckboxModule} from '@angular/material';
import {TaskGroupModule} from '../../taskGroup/feature/task-group.module';
import {WorkOrderRoutingModule} from '../../workOrder/feature/work-order-routing.module';
import {TaskModule} from '../../taskGroup/feature/task/feature/task.module';
import {PartWithUsageCountModule} from '../../workOrder/feature/part-with-usage-count/part-with-usage-count.module';
import {NotifyModule} from '../../workOrder/feature/notify/notify.module';
import {WorkOrderModule} from '../../workOrder/feature/work-order.module';
import {InventoryActionComponent} from '../../part/inventory/feature/action/inventory-action.component';
import {InventoryListComponent} from '../../part/inventory/feature/list/inventory-list.component';
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";
import {PersianPipesModule} from "ngx-persian-pipe";


@NgModule({
  declarations: [AssignedWorkOrderComponent, AssignedWorkOrderListComponent, AssignedWorkOrderActionComponent, AssignedWorkOrderViewComponent],
    imports: [
        CommonModule,
        AssignedWorkOrderRoutingModule,
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
        TaskModule,
        PartWithUsageCountModule,
        NotifyModule,
        WorkOrderModule,
        LoadingSpinnerModule,
        PaginatorModule,
        PersianPipesModule
    ]
})
export class AssignedWorkOrderModule { }
