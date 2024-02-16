import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {DaySessionListComponent} from './day-session-list/day-session-list.component';


const routes: Routes = [
    {
        path: '',
        component: ListComponent
    }, {
        path: 'day-session-list',
        component: DaySessionListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalenderRoutingModule {
}
