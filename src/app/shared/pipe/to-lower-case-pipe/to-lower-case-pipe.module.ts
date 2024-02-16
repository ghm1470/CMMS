import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToLowerCasePipe} from './toLowerCase.pipe';


@NgModule({
  declarations: [ToLowerCasePipe],
  imports: [
    CommonModule
  ],
  exports: [
    ToLowerCasePipe
  ]
})
export class ToLowerCasePipeModule {
}
