import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ActivityActionComponent} from './action/activity-action.component';
import {ActivityListComponent} from './list/activity-list.component';
import {ViewActivityComponent} from './view-activity/view-activity.component';
import {ViewComponent} from "./view/view.component";


const routes: Routes = [
    {path: 'create', component: ActivityActionComponent},
    {path: 'edit/:id', component: ActivityActionComponent},
    // {path: 'view/:id', component: ViewActivityComponent},
    {path: 'view/:id', component: ViewComponent},
    {path: 'list', component: ActivityListComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityRoutingModule {
}
