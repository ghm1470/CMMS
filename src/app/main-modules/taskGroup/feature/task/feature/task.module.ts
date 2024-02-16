import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {TaskListComponent } from './list/task-list.component';
import {TaskActionComponent} from './action/task-action.component';
import { ActionTsComponent } from './action-ts/action-ts.component';
import { ListTsComponent } from './list-ts/list-ts.component';
import { ListWorkTableComponent } from './list-work-table/list-work-table.component';
import {ListWorkTableViewComponent} from './list-work-table-view/list-work-table-view.component';
import {LoadingSpinnerModule} from "../../../../../shared/shared/loading-spinner/loading-spinner.module";
import {ConfermDeleteModule} from '../../../../../shared/conferm-delete/conferm-delete.module';

@NgModule({
  declarations: [TaskActionComponent, TaskListComponent, ActionTsComponent, ListTsComponent, ListWorkTableComponent, ListWorkTableViewComponent],
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
    ConfermDeleteModule,
    LoadingSpinnerModule
  ],
  exports: [
    TaskListComponent,
    ActionTsComponent,
    ListTsComponent,
    ListWorkTableComponent,
    ListWorkTableViewComponent
  ]
})
export class TaskModule { }
