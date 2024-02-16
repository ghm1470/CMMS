import {NgModule} from '@angular/core';

import {PostRoutingModule} from './post-routing.module';
import { PostComponent } from './post.component';
import {PostService} from '../../service/post/post.service';
import {OrganizationService} from '../../service/organization/organization.service';
import {DataService} from '@angular-boot/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {SmartTableModule} from '../../../../shared/util-module/smart-table-test/smart-table.module';
import {PaginationModule} from '../../../../shared/util-module/pagination/pagination.module';


@NgModule({
  imports: [
    CommonModule,
    PostRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    PaginationModule,
    PersianPipesModule,
    SmartTableModule
  ],
  declarations: [PostComponent],
  providers: [
    PostService,
    OrganizationService,
    DataService
  ],
  exports: []
})
export class PostModule {
}
