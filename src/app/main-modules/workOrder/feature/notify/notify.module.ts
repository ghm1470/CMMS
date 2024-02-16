import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import { NotifyComponent } from './notify.component';
import {NotifyRoutingModule} from './notify-routing.module';
import { Notify2Component } from './notify2/notify2.component';

@NgModule({
  declarations: [NotifyComponent, Notify2Component],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbWidgetsModule,
    NbCommonModule,
    UtilModule,
    NbValidationModule,
    NgSelectModule,
    NotifyRoutingModule
  ],
  exports: [NotifyComponent]
})
export class NotifyModule { }
