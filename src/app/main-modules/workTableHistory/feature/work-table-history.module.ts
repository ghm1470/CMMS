import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkTableHistoryRoutingModule } from './work-table-history-routing.module';
import { WorkTableHistoryComponent } from './_index/work-table-history.component';
import { WorkTableHistoryListComponent } from './list/work-table-history-list.component';
import { WorkTableHistoryActionComponent } from './action/work-table-history-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {SmartTableModule} from '../../../shared/util-module/smart-table-test/smart-table.module';
import {AnswerDetailModule} from '../../formBuilder/fb-feature/answer-detail/answer-detail.module';
import {FormCompleteModule} from '../../formBuilder/fb-feature/form-complete/form-complete.module';
import {WorkOrderModule} from '../../workOrder/feature/work-order.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {MeteringRoutingModule} from '../../part/feature/metering/metering-routing.module';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingBarModule} from '../../../shared/loading-bar/loading-bar.module';
import {SubmitWorkRequestModule} from '../../submitWorkRequest/feature/submit-work-request.module';
import {TaskModule} from '../../taskGroup/feature/task/feature/task.module';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {WorktableModule} from '../../worktable/feature/worktable.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';

@NgModule({
  declarations: [WorkTableHistoryComponent, WorkTableHistoryListComponent, WorkTableHistoryActionComponent],
    imports: [
        CommonModule,
        WorkTableHistoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        PersianPipesModule,
        SmartTableModule,
        AnswerDetailModule,
        FormCompleteModule,
        WorkOrderModule,
        CommonModule,
        LoadingSpinnerModule,
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
        SubmitWorkRequestModule,
        TaskModule,
        DocumentModule,
        WorktableModule,
        PaginatorModule

    ]
})
export class WorkTableHistoryModule { }
