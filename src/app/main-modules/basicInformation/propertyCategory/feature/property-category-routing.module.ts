import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PropertyCategoryListComponent} from "./list/property-category-list.component";
import {PropertyCategoryActionComponent} from "./action/property-category-action.component";


const routes: Routes = [
  {
    path: '', component: PropertyCategoryListComponent,
  }, {
    path: 'action', component: PropertyCategoryActionComponent,
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyCategoryRoutingModule {
}
