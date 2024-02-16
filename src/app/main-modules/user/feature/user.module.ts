import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './_index/user.component';
import { UserActionComponent } from './action/user-action.component';
import { UserListComponent } from './list/user-list.component';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {UserRoutingModule} from './user-routing.module';
import {UserTypeService} from '../../securityManagement/endpoint/user-type.service';
import {UserService} from '../endpoint/user.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {OrganizationService} from '../../basicInformation/organization/endpoint/organization.service';
import { ChildUsersComponent } from './child-users/child-users.component';
import { UserSecondaryInformationComponent } from './user-secondary-information/user-secondary-information.component';
import { CertificationComponent } from './certification/certification.component';
import { FileDocumentComponent } from './file-document/file-document.component';
import { MessagingComponent } from './messaging/messaging.component';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {TooltipModule} from 'ngx-tooltip';
import { UserViewComponent } from './user-view/user-view.component';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import {PersianPipesModule} from "ngx-persian-pipe";



@NgModule({
  declarations: [UserComponent, UserActionComponent, UserListComponent,
    ChildUsersComponent, UserSecondaryInformationComponent, CertificationComponent,
    FileDocumentComponent, MessagingComponent, UserViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        UserRoutingModule,
        NgSelectModule,
        DocumentModule,
        TooltipModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
        ImageCropperModule,
        PersianPipesModule
    ],
  providers: [
    OrganizationService,
    UserTypeService,
    UserService
  ]

})
export class UserModule { }
