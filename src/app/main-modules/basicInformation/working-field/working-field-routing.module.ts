import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WorkingFieldActionComponent} from './feature/working-field-action/working-field-action.component';
import {WorkingFieldListComponent} from './feature/working-field-list/working-field-list.component';


const routes: Routes = [
    {path: '', component: WorkingFieldListComponent},
    {path: 'upsert', component: WorkingFieldActionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkingFieldRoutingModule {
}
