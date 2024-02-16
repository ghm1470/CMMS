import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StorageComponent} from './_index/storage.component';
import {StorageActionComponent} from './action/storage-action.component';

const routes: Routes = [
  {path: '' , component: StorageComponent},
  {path: 'action' , component: StorageActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
