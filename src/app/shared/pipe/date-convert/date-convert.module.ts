import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsoToJDateWithTimePipe} from './DataConvert.pipe';



@NgModule({
  declarations: [IsoToJDateWithTimePipe],
  exports: [IsoToJDateWithTimePipe],
  imports: [
    CommonModule
  ]
})
export class DateConvertModule { }
