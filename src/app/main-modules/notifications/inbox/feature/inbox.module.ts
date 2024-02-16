import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InboxRoutingModule} from './inbox-routing.module';
import {InboxComponent} from './_index/inbox.component';
import {InboxListComponent} from './list/inbox-list.component';
import {InboxActionComponent} from './action/inbox-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {DocumentModule} from '../../../../shared/util-module/document/document.module';
import {NbValidationModule} from '@angular-boot/validation';
import {LoadingBarModule} from '../../../../shared/loading-bar/loading-bar.module';
import {InboxViewComponent} from './view/inbox-view.component';
import {ConfermDeleteModule} from '../../../../shared/conferm-delete/conferm-delete.module';
import {CKEditorModule} from 'ckeditor4-angular';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {UploadDocumentModule} from '../../../upload-file/upload-document/upload-document.module';
import {CkeditorShowValueModule} from '../../../../shared/ckeditor-show-value/ckeditor-show-value.module';
import {PersianPipesModule} from "ngx-persian-pipe";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [InboxComponent, InboxListComponent, InboxActionComponent, InboxViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        InboxRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        DocumentModule,
        NbValidationModule,
        LoadingBarModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        UploadDocumentModule,
        CkeditorShowValueModule,
        CKEditorModule,
        PersianPipesModule,
        NgSelectModule,

    ],
  exports: [
    InboxActionComponent, InboxViewComponent
  ]
})
export class InboxModule {
}
