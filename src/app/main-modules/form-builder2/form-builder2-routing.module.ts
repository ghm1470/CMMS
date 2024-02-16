import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FormListComponent} from './form-list/form-list.component';
import {UpsertFormComponent} from './action/upsert-form/upsert-form.component';


const routes: Routes = [
    {
        path: '',
        component: FormListComponent
    },
    {
        path: 'upsert',
        component: UpsertFormComponent
    }, {

        path: 'view',
        component: UpsertFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormBuilder2RoutingModule {
}

