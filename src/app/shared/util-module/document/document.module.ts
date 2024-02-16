import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentComponent} from './document.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbDirectivesModule} from '@angular-boot/util';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbValidationModule} from '@angular-boot/validation';
import { DocumentWorkTableComponent } from './document-work-table/document-work-table.component';
import {ConfermDeleteModule} from '../../conferm-delete/conferm-delete.module';
import { DocumentWorkTViewComponent } from './document-work-tview/document-work-tview.component';
import {LoadingSpinnerModule} from '../../shared/loading-spinner/loading-spinner.module';


@NgModule({
  declarations: [DocumentComponent, DocumentWorkTableComponent, DocumentWorkTViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbDirectivesModule,
    NbWidgetsModule,
    NbValidationModule,
    LoadingSpinnerModule,
    ConfermDeleteModule,
  ],
  exports: [
    DocumentComponent,
    DocumentWorkTableComponent,
    DocumentWorkTViewComponent
  ]
})
export class DocumentModule {
}
