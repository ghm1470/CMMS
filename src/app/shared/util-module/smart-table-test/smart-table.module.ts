import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmartTableTestComponent} from './smart-table-test.component';
import {ProTableComponent} from './pro-table/pro-table.component';
import {CsvDownloaderComponent} from './csv-downloader/csv-downloader.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SmartTableTestComponent,
    ProTableComponent,
    CsvDownloaderComponent
  ],
  exports: [
    SmartTableTestComponent,
    ProTableComponent,
    CsvDownloaderComponent,
  ],
})
export class SmartTableModule { }
