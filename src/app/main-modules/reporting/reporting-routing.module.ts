import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AssetReportingComponent} from './feature/asset-reporting/asset-reporting.component';
import {UserReportingComponent} from "./feature/user-reporting/user-reporting.component";
import {MtbfComponent} from "./feature/KPI/mtbf/mtbf.component";
import {MttrComponent} from "./feature/KPI/mttr/mttr.component";
import {KPITableComponent} from "./feature/KPI/kpi-table/kpi-table.component";
import {UsersAssessmentComponent} from "./feature/users-assessment/users-assessment.component";
import {MdtComponent} from "./feature/KPI/mdt/mdt.component";


const routes: Routes = [
    {
        path: 'asset',
        component: AssetReportingComponent
    }, {
        path: 'user',
        component: UserReportingComponent
    }, {
        path: 'mtbf',
        component: MtbfComponent
    }, {
        path: 'mttr',
        component: MttrComponent
    }, {
        path: 'mdt',
        component: MdtComponent
    }, {
        path: 'KPI-table',
        component: KPITableComponent
    }, {
        path: 'userAssessment',
        component: UsersAssessmentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportingRoutingModule {
}
