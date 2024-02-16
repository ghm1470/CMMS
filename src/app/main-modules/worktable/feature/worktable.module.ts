import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WorktableComponent} from './_index/worktable.component';
import {WorktableActionComponent} from './action/worktable-action.component';
import {WorktableListComponent} from './list/worktable-list.component';
import {WorktableRoutingModule} from './worktable-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {AnswerDetailModule} from '../../formBuilder/fb-feature/answer-detail/answer-detail.module';
import {FormCompleteModule} from '../../formBuilder/fb-feature/form-complete/form-complete.module';
import {SmartTableModule} from '../../../shared/util-module/smart-table-test/smart-table.module';
import {WorkOrderModule} from '../../workOrder/feature/work-order.module';
import { ShowWorkRequestModalComponent } from './show-work-request-modal/show-work-request-modal.component';
import {MeteringRoutingModule} from '../../part/feature/metering/metering-routing.module';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingBarModule} from '../../../shared/loading-bar/loading-bar.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {SubmitWorkRequestModule} from '../../submitWorkRequest/feature/submit-work-request.module';
import {ShowTheTrendHereComponent} from './show-the-trend-here/show-the-trend-here.component';
import {TaskModule} from '../../taskGroup/feature/task/feature/task.module';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import { ShowTheFormOfPreviousStepsComponent } from './show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {FormBuilder2Module} from '../../form-builder2/form-builder2.module';
import { NewFormKhalesComponent } from './new-form-khales/new-form-khales.component';
import {PartWithUsageCountModule} from '../../workOrder/feature/part-with-usage-count/part-with-usage-count.module';
import {CustomDirectiveModule} from '../../../shared/customDirective/custom-directive.module';
import {MatTooltipModule} from "@angular/material/tooltip";
import {ExportFileModule} from "../../../shared/export-file/export-file.module";



@NgModule({
  declarations: [
    WorktableComponent,
    WorktableActionComponent,
    WorktableListComponent,
    ShowWorkRequestModalComponent,
    ShowTheTrendHereComponent,
    ShowTheFormOfPreviousStepsComponent,
    NewFormKhalesComponent,
  ],
    imports: [
        CommonModule,
        WorktableRoutingModule,
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
        PaginatorModule,
        FormBuilder2Module,
        PartWithUsageCountModule,
        CustomDirectiveModule,
        MatTooltipModule,
        ExportFileModule

    ],
    exports: [
        ShowWorkRequestModalComponent,
        ShowTheFormOfPreviousStepsComponent,
        NewFormKhalesComponent,
        WorktableActionComponent
    ]
})
export class WorktableModule {
}

