import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskGroupComponent } from './_index/task-group.component';
import { TaskGroupActionComponent } from './action/task-group-action.component';
import { TaskGroupListComponent } from './list/task-group-list.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbValidationModule} from '@angular-boot/validation';
import {UtilModule} from '@angular-boot/util';
import {NbCommonModule} from '@angular-boot/common';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TaskModule} from './task/feature/task.module';
import {TaskGroupRoutingModule} from './task-group-routing.module';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';



@NgModule({
    declarations: [
        TaskGroupComponent,
        TaskGroupActionComponent,
        TaskGroupListComponent,
    ],
    exports: [
        TaskGroupActionComponent
    ],
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
        TaskModule,
        TaskGroupRoutingModule,
        DocumentModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
    ]
})
export class TaskGroupModule { }
