import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from './paginator.component';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {TestPaginationComponent} from './test-pagination/test-pagination.component';
import {Service} from './test-pagination/service';
import {MatPaginatorIntlGerman} from './matPaginatorIntlGerman';

@NgModule({
  declarations: [PaginatorComponent, TestPaginationComponent],
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  exports: [
    PaginatorComponent
  ],
  providers: [
    Service,
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlGerman
    }
  ]
})
export class PaginatorModule {
}
