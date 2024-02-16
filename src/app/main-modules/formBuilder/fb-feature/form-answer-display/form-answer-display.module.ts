import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormAnswerDisplayRoutingModule} from './form-answer-display-routing.module';
import {FormAnswerDisplayComponent} from './form-answer-display/form-answer-display.component';
import {SliderModule} from 'primeng/slider';
import {MaterialModule} from '../../shared/material/material.module';
import {ImageUploadModule} from '../../../../shared/util-module/image-upload/image-upload.module';
import {AttachmentModule} from '../../../../shared/util-module/attachment/attachment.module';

@NgModule({
  imports: [
    CommonModule,
    FormAnswerDisplayRoutingModule,
    SliderModule,
    MaterialModule,
    // StarRatingModule,
    ImageUploadModule,
    AttachmentModule,
  ],
  declarations: [FormAnswerDisplayComponent],
  exports: [FormAnswerDisplayComponent]
})
export class FormAnswerDisplayModule { }
