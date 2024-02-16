import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubmitWorkRequestRoutingModule} from './submit-work-request-routing.module';
import {SubmitWorkRequestComponent} from './_index/submit-work-request.component';
import {SubmitWorkRequestListComponent} from './list/submit-work-request-list.component';
import {SubmitWorkRequestActionComponent} from './action/submit-work-request-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormCompleteModule} from '../../formBuilder/fb-feature/form-complete/form-complete.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {AcceptationProcessComponent} from './acceptation-process/acceptation-process.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {ScheduleMaintenanceModule} from '../../scheduleMaintenance/feature/schedule-maintenance.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {WorktableModule} from '../../worktable/feature/worktable.module';
import {ShowProcessStepsModule} from '../../worktable/feature/show-process-steps/show-process-steps.module';
import {PersianPipesModule} from "ngx-persian-pipe";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [SubmitWorkRequestComponent, SubmitWorkRequestListComponent, SubmitWorkRequestActionComponent],
    imports: [
        CommonModule,
        SubmitWorkRequestRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        DocumentModule,
        NbValidationModule,
        NgSelectModule,
        FormCompleteModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ScheduleMaintenanceModule,
        ShowProcessStepsModule,
        PersianPipesModule,
        MatTooltipModule,
    ],
  exports: []
})
export class SubmitWorkRequestModule {
}
