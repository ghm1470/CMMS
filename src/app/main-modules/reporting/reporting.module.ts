import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {AssetReportingComponent} from './feature/asset-reporting/asset-reporting.component';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {PaginatorModule} from '../../shared/paginator/paginator.module';
import {WorkOrderModule} from '../workOrder/feature/work-order.module';
import {UserReportingComponent} from './feature/user-reporting/user-reporting.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import {MtbfComponent} from './feature/KPI/mtbf/mtbf.component';
import {MttrComponent} from './feature/KPI/mttr/mttr.component';
import {KPITableComponent} from './feature/KPI/kpi-table/kpi-table.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MinToHourModule} from '../../shared/pipe/min-to-hour/min-to-hour.module';
import {EnToFaModule} from '../../shared/pipe/en-to-fa/en-to-fa.module';
import {UsersAssessmentComponent} from './feature/users-assessment/users-assessment.component';
import { MdtComponent } from './feature/KPI/mdt/mdt.component';


@NgModule({
    declarations: [AssetReportingComponent,
        UserReportingComponent,
        MtbfComponent,
        MttrComponent,
        KPITableComponent,
        UsersAssessmentComponent,
        MdtComponent],
    imports: [
        CommonModule,
        ReportingRoutingModule,
        NbWidgetsModule,
        NgSelectModule,
        FormsModule,
        PersianPipesModule,
        PaginatorModule,
        WorkOrderModule,
        ChartsModule,
        MatTooltipModule,
        MinToHourModule,
        EnToFaModule,
    ],
    providers: [
        ThemeService
    ]

})

export class ReportingModule {
}
