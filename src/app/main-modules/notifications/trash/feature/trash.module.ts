import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashRoutingModule } from './trash-routing.module';
import { TrashComponent } from './_index/trash.component';
import { TrashListComponent } from './list/trash-list.component';
import { TrashActionComponent } from './action/trash-action.component';
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
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {PersianPipesModule} from "ngx-persian-pipe";


@NgModule({
  declarations: [TrashComponent, TrashListComponent, TrashActionComponent],
    imports: [
        CommonModule,
        TrashRoutingModule,
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
        PersianPipesModule
    ]
})
export class TrashModule { }
