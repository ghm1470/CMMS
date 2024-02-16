import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './_index/profile.component';
import { ProfileListComponent } from './list/profile-list.component';
import { ProfileActionComponent } from './action/profile-action.component';


@NgModule({
  declarations: [ProfileComponent, ProfileListComponent, ProfileActionComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
