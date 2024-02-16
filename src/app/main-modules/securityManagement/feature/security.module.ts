import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role/role.component';
import {SecurityRoutingModule} from './security-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatChipsModule, MatIconModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';
import {AuthService} from '../../../base-modules/auth/endpoint/auth.service';
import {UserTypeService} from '../endpoint/user-type.service';
import { SecurityManagementActionComponent } from './security-management-action/security-management-action.component';
import { SecurityManagementListComponent } from './security-management-list/security-management-list.component';
import { SecurityManagementComponent } from './security-management/security-management.component';
import {NbCommonModule} from "@angular-boot/common";
import {NbValidationModule} from "@angular-boot/validation";
import {NbDirectivesModule} from "@angular-boot/util";
import { SecurityManagementViewComponent } from './security-management-view/security-management-view.component';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from "../../../shared/conferm-delete/conferm-delete.module";
import {PaginatorModule} from "../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [RoleComponent, SecurityManagementActionComponent, SecurityManagementListComponent, SecurityManagementComponent, SecurityManagementViewComponent],
    imports: [
        CommonModule,
        SecurityRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        NbCommonModule,
        NbValidationModule,
        NbDirectivesModule,
        LoadingSpinnerModule,
        ConfermDeleteModule,
        PaginatorModule
    ],
  providers: [
    AuthService,
    UserTypeService
  ]
})
export class SecurityModule { }
