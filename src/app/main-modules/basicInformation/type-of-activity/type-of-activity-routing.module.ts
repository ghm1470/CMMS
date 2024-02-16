import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TypeOfActivityListComponent} from './feature/type-of-activity-list/type-of-activity-list.component';
import {TypeOfActivityActionComponent} from './feature/type-of-activity-action/type-of-activity-action.component';


const routes: Routes = [
    {path: '', component: TypeOfActivityListComponent},
    {path: 'upsert', component: TypeOfActivityActionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TypeOfActivityRoutingModule {
}
