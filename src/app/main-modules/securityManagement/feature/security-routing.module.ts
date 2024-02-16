import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SecurityManagementComponent} from './security-management/security-management.component';
import {SecurityManagementActionComponent} from './security-management-action/security-management-action.component';
import {SecurityManagementViewComponent} from './security-management-view/security-management-view.component';

const routes: Routes = [
  {path: '', component: SecurityManagementComponent},
  {path: 'action', component: SecurityManagementActionComponent},
  {path: 'view', component: SecurityManagementViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule {
}
