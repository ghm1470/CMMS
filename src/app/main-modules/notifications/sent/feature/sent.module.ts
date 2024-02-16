import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentRoutingModule } from './sent-routing.module';
import { SentComponent } from './_index/sent.component';
import { SentListComponent } from './list/sent-list.component';
import { SentActionComponent } from './action/sent-action.component';
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
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {PersianPipesModule} from "ngx-persian-pipe";


@NgModule({
  declarations: [SentComponent, SentListComponent, SentActionComponent],
    imports: [
        CommonModule,
        SentRoutingModule,
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
        PersianPipesModule,
    ]
})
export class SentModule { }
