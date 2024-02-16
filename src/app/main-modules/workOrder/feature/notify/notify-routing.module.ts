import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotifyComponent} from './notify.component';

const routes: Routes = [
  {path: '' , component: NotifyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifyRoutingModule { }
