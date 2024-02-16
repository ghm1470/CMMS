import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingFullComponent} from './loading-full.component';



@NgModule({
  declarations: [LoadingFullComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingFullComponent
  ]
})
export class LoadingFullModule { }
