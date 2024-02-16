import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssetComponent} from './_index/asset.component';
import {TreeActionComponent} from './tree-action/tree-action.component';
import {TreeViewCompleteComponent} from './tree-view-complete/tree-view-complete.component';

const routes: Routes = [
  {path: '' , component: AssetComponent},
  {path: 'action' , component: TreeActionComponent},
  {path: 'view' , component: TreeViewCompleteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
