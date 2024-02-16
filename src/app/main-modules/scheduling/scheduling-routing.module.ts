import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SchedulingComponent} from './scheduling/scheduling.component';
import {SchedulingListComponent} from './scheduling-list/scheduling-list.component';


const routes: Routes = [
    {
        path: '',
        component: SchedulingListComponent
    },
    {
        path: 'action',
        component: SchedulingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchedulingRoutingModule {
}
