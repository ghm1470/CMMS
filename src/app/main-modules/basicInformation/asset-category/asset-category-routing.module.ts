import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AssetCategoryListComponent} from './feature/asset-category-list/asset-category-list.component';
import {AssetCategoryActionComponent} from './feature/asset-category-action/asset-category-action.component';


const routes: Routes = [
    {
        path: '',
        component: AssetCategoryListComponent
    }, {
        path: 'action',
        component: AssetCategoryActionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetCategoryRoutingModule {
}
