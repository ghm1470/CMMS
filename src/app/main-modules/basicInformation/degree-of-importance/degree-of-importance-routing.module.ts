import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DegreeOfImportanceListComponent} from './feature/degree-of-importance-list/degree-of-importance-list.component';
import {DegreeOfImportanceActionComponent} from './feature/degree-of-importance-action/degree-of-importance-action.component';


const routes: Routes = [
    {path: '', component: DegreeOfImportanceListComponent},
    {path: 'upsert', component: DegreeOfImportanceActionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DegreeOfImportanceRoutingModule {
}
