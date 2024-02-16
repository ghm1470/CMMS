import {NgModule} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatDatepickerModulePersian} from '@angular-persian/material-date-picker';
import {MatInputModule} from '@angular/material/input';
import 'hammerjs';
import {MatCardModule, MatChipsModule, MatIconModule, MatPaginatorIntl, MatRadioModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatPaginatorIntlGerman} from './matPaginatorIntlGerman';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';


@NgModule({
  imports: [MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatRadioModule,
    // MatDatepickerModulePersian,
    MatSelectModule,
    MatDialogModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule],
  declarations: [],
  exports: [MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatRadioModule,
    // MatDatepickerModulePersian,
    MatPaginatorModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlGerman
    }
  ]
})
export class MaterialModule {

}
