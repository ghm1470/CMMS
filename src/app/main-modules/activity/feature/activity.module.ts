import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivityRoutingModule} from './activity-routing.module';
import {ActivityActionComponent} from './action/activity-action.component';
import {ActivityListComponent} from './list/activity-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {PersianPipesModule} from 'ngx-persian-pipe';
// import {ViewMemberComponent } from './view-member/view-member.component';
// import {EditPassMemberComponent} from './edit-pass-member/edit-pass-member.component';
import {OrganizationService} from '../service/organization/organization.service';
import {PostService} from '../service/post/post.service';
import {ActivityService} from '../service/activity.service';
import {FormService} from '../../formBuilder/fb-service/form.service';
import {SmartTableModule} from '../../../shared/util-module/smart-table-test/smart-table.module';
import {UserTypeService} from '../../securityManagement/endpoint/user-type.service';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {MatSlideToggleModule} from '@angular/material';
import { ViewActivityComponent } from './view-activity/view-activity.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import { OrgAndUserTypeAndUserModalComponent } from './view-activity/org-and-user-type-and-user-modal/org-and-user-type-and-user-modal.component';
import {UserService} from '../../user/endpoint/user.service';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import { ViewComponent } from './view/view.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
@NgModule({
  declarations: [
    ActivityActionComponent,
    ActivityListComponent,
    ViewActivityComponent,
    OrgAndUserTypeAndUserModalComponent,
    ViewComponent,
    // ViewMemberComponent,
    // EditPassMemberComponent
  ],
    imports: [
        CommonModule,
        ActivityRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        PersianPipesModule,
        SmartTableModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        MatSlideToggleModule,
        NbValidationModule,
        PaginatorModule,
        NgSelectModule,
        MatTooltipModule,
        MatCheckboxModule,
    ],
  exports: [
    ActivityActionComponent
  ],
  providers: [
    OrganizationService,
    UserTypeService,
    ActivityService,
    PostService,
    FormService,
    UserService
  ]
})
export class ActivityModule { }
