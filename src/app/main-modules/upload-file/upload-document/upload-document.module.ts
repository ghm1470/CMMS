import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from './upload-document.component';
import {NbWidgetsModule} from "@angular-boot/widgets";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [UploadDocumentComponent],
  exports: [UploadDocumentComponent],
  imports: [
    CommonModule,
    NbWidgetsModule,
    FormsModule
  ]
})
export class UploadDocumentModule { }
