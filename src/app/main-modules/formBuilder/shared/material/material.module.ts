import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormField, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatTabsModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule


  ],
  declarations: [],
  exports: [
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
})
export class MaterialModule { }
