import { NgModule } from '@angular/core';
import {AttachmentComponent} from './attachment.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    AttachmentComponent
  ],
  imports: [
    CommonModule

  ],
  providers: [
      // AttachmentService
  ],
  exports: [
    AttachmentComponent
  ]
})
export class AttachmentModule { }
