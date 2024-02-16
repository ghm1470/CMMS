import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssetTemplateComponent} from './_index/asset-template.component';
import {AssetTemplateActionComponent} from './action/asset-template-action.component';

const routes: Routes = [
  {path: '' , component: AssetTemplateComponent},
  {path: 'action' , component: AssetTemplateActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetTemplateRoutingModule { }
