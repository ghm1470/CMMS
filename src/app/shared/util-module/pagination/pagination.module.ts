import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import {FormsModule} from '@angular/forms';
import {PersianPipesModule} from 'ngx-persian-pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PersianPipesModule
],
  declarations: [PaginationComponent],
  exports: [PaginationComponent]
})
export class PaginationModule { }
