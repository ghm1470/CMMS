import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportFileComponent } from './export-file/export-file.component';
import {PersianPipesModule} from "ngx-persian-pipe";
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
    declarations: [ExportFileComponent],
    exports: [
        ExportFileComponent
    ],
    imports: [
        CommonModule,
        PersianPipesModule,
        MatTooltipModule
    ]
})
export class ExportFileModule { }
