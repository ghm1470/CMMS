import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {ActionComponent} from './action/action.component';


const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'upsert',
        component: ActionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LubricantRoutingModule {
}
