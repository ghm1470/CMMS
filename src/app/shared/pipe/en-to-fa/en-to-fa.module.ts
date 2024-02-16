import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EnToFaPipe} from './EnToFa.pipe';



@NgModule({
  declarations: [EnToFaPipe],
  exports: [EnToFaPipe],
  imports: [
    CommonModule
  ]
})
export class EnToFaModule { }
