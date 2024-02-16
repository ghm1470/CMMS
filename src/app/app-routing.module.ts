import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './shared/service/auth-guard.service';


const routes: Routes = [
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {
    path: 'auth',
    loadChildren: './base-modules/auth/feature/auth.module#AuthModule'
  }, {
    path: 'calender',
    loadChildren: './main-modules/calender/calender.module#CalenderModule'
  },
  {
    path: 'panel',
    loadChildren: './base-modules/panel/panel.module#PanelModule',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
