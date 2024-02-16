import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './_index/dashboard.component';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {FormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {AssetModalComponent} from './asset-modal/asset-modal.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {WorkOrderModalComponent} from './work-order-modal/work-order-modal.component';
@NgModule({
  declarations: [DashboardComponent, AssetModalComponent , WorkOrderModalComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PersianPipesModule,
    NbWidgetsModule,
    FormsModule,
    MatSlideToggleModule,
    MatCardModule,
    LoadingSpinnerModule,
    NgScrollbarModule,
  ]
})
export class DashboardModule {
}
