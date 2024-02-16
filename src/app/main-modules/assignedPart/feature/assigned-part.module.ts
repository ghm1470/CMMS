import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedPartRoutingModule } from './assigned-part-routing.module';
import { AssignedPartComponent } from './_index/assigned-part.component';
import { AssignedPartListComponent } from './list/assigned-part-list.component';
import { AssignedPartActionComponent } from './action/assigned-part-action.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NbWidgetsModule} from '@angular-boot/widgets';
import {NbCommonModule} from '@angular-boot/common';
import {UtilModule} from '@angular-boot/util';
import {NbValidationModule} from '@angular-boot/validation';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material';
import {PaginatorModule} from "../../../shared/paginator/paginator.module";


@NgModule({
  declarations: [AssignedPartComponent, AssignedPartListComponent, AssignedPartActionComponent],
    imports: [
        CommonModule,
        AssignedPartRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbWidgetsModule,
        NbCommonModule,
        UtilModule,
        NbValidationModule,
        NgSelectModule,
        MatCheckboxModule,
        PaginatorModule,
    ]
})
export class AssignedPartModule { }
