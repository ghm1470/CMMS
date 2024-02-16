import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';

import {PanelRoutingModule} from './panel-routing.module';
import {PanelComponent} from './_index/panel.component';
import {CoreModule} from '../core/core.module';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {HttpClientModule} from '@angular/common/http';
import {FormViewModule} from '../../main-modules/formBuilder/fb-feature/form-view/form-view.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBuilderComponent} from '../../main-modules/formBuilder/form-builder.component';
import {SmartTableModule} from '../../shared/util-module/smart-table-test/smart-table.module';
import {PersianPipesModule} from 'ngx-persian-pipe';
import {NbDirectivesModule} from '@angular-boot/util';
import {LoadingSpinnerModule} from '../../shared/shared/loading-spinner/loading-spinner.module';
import {ConfermDeleteModule} from '../../shared/conferm-delete/conferm-delete.module';
import {NbCommonModule} from '@angular-boot/common';
import {PaginatorModule} from '../../shared/paginator/paginator.module';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
    declarations: [PanelComponent, FormBuilderComponent],
    imports: [
        CommonModule,
        PanelRoutingModule,
        CoreModule,
        ReactiveFormsModule,
        FormsModule,
        NgScrollbarModule,
        HttpClientModule,
        FormViewModule,
        SmartTableModule,
        PersianPipesModule,
        LoadingSpinnerModule,
        NbDirectivesModule,
        NbCommonModule,
        ConfermDeleteModule,
        PaginatorModule,
        NgSelectModule,
    ]
})
export class PanelModule {
}
