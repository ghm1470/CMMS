import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetCategoryRoutingModule} from './asset-category-routing.module';
import {AssetCategoryListComponent} from './feature/asset-category-list/asset-category-list.component';
import {AssetCategoryActionComponent} from './feature/asset-category-action/asset-category-action.component';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {AssetCategoryService} from './endpoint/asset-category.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingSpinnerModule} from "../../../shared/shared/loading-spinner/loading-spinner.module";


@NgModule({
    declarations: [AssetCategoryListComponent, AssetCategoryActionComponent],
    imports: [
        CommonModule,
        AssetCategoryRoutingModule,
        PaginatorModule,
        ConfermDeleteModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormsModule
    ],
    providers: [
        AssetCategoryService
    ]
})
export class AssetCategoryModule {
}
