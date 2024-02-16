import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssignedAssetComponent} from './_index/assigned-asset.component';
import {AssignedAssetListComponent} from './list/assigned-asset-list.component';



const routes: Routes = [
  {path: '', component: AssignedAssetListComponent},
  {path: 'actionAsset',
  loadChildren: '../../asset/feature/asset.module#AssetModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedAssetRoutingModule { }
