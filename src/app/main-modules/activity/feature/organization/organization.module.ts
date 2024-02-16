import {NgModule} from '@angular/core';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrganizationComponent } from './organization.component';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {OrganizationService} from '../../service/organization/organization.service';
import {PostService} from '../../service/post/post.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SmartTableModule} from '../../../../shared/util-module/smart-table-test/smart-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    PersianPipesModule,
    SmartTableModule,
    OrganizationRoutingModule
  ],
  declarations: [OrganizationComponent],
  providers: [OrganizationService, PostService]
})
export class OrganizationModule {
}
