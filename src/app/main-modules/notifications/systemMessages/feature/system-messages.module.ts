import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemMessagesRoutingModule } from './system-messages-routing.module';
import { SystemMessagesComponent } from './_index/system-messages.component';
import { SystemMessagesListComponent } from './list/system-messages-list.component';
import { SystemMessagesActionComponent } from './action/system-messages-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InboxRoutingModule} from '../../inbox/feature/inbox-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {DocumentModule} from '../../../../shared/util-module/document/document.module';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingBarModule} from '../../../../shared/loading-bar/loading-bar.module';
import {InboxModule} from '../../inbox/feature/inbox.module';
import { ViewComponent } from './view/view.component';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';


@NgModule({
  declarations: [SystemMessagesComponent, SystemMessagesListComponent, SystemMessagesActionComponent, ViewComponent],
  imports: [
    CommonModule,
    SystemMessagesRoutingModule,
    FormsModule,
    InboxRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbWidgetsModule,
    NbCommonModule,
    UtilModule,
    DocumentModule,
    NbValidationModule,
    NgSelectModule,
    LoadingBarModule,
    InboxModule,
    ConfermDeleteModule,
    LoadingSpinnerModule,
  ]
})
export class SystemMessagesModule { }
