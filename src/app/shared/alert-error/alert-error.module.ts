import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertErrorComponent} from './alert-error.component';


@NgModule({
  declarations: [AlertErrorComponent],
  exports: [AlertErrorComponent],
  imports: [
    CommonModule
  ]
})
export class AlertErrorModule {
}
