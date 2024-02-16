import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CkeditorShowValueComponent } from './ckeditor-show-value.component';
import {UtilModule} from '@angular-boot/util';

@NgModule({
  declarations: [CkeditorShowValueComponent],
  exports: [
    CkeditorShowValueComponent
  ],
  imports: [
    CommonModule,
    UtilModule
  ]
})
export class CkeditorShowValueModule { }
