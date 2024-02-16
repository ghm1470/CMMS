import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './_index/project.component';
import { ProjectActionComponent } from './action/project-action.component';
import { ProjectListComponent } from './list/project-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectService} from '../endpoint/project.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {PersianPipesModule} from 'ngx-persian-pipe';
import { ProjectViewComponent } from './view/project-view.component';
import {DocumentModule} from '../../../shared/util-module/document/document.module';
import {ConfermDeleteModule} from '../../../shared/conferm-delete/conferm-delete.module';
import {LoadingSpinnerModule} from '../../../shared/shared/loading-spinner/loading-spinner.module';
import {PaginatorModule} from '../../../shared/paginator/paginator.module';
import {MatRadioModule} from "@angular/material/radio";



@NgModule({
  declarations: [
    ProjectComponent,
    ProjectActionComponent,
    ProjectListComponent,
    ProjectViewComponent,
    // ConvertDatePipe
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
        ProjectRoutingModule,
        PersianPipesModule,
        NgSelectModule,
        DocumentModule,
        ConfermDeleteModule,
        LoadingSpinnerModule,
        PaginatorModule,
        MatRadioModule
    ],
  providers: [
    ProjectService
  ]
})
export class ProjectModule { }
