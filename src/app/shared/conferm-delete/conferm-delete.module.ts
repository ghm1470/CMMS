import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfermDeleteComponent } from './conferm-delete/conferm-delete.component';
import {NbWidgetsModule} from "@angular-boot/widgets";



@NgModule({
  declarations: [ConfermDeleteComponent],
  imports: [
    CommonModule,
    NbWidgetsModule,

  ], exports: [
    ConfermDeleteComponent
  ]
})
export class ConfermDeleteModule { }
