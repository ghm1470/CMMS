import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShowProcessStepsComponent} from './show-process-steps.component';
import {AcceptationProcessComponent} from '../../../submitWorkRequest/feature/acceptation-process/acceptation-process.component';
import {NbWidgetsModule} from "@angular-boot/widgets";
import {LoadingSpinnerModule} from "../../../../shared/shared/loading-spinner/loading-spinner.module";


@NgModule({
    declarations: [ShowProcessStepsComponent,
        AcceptationProcessComponent],
    imports: [
        CommonModule,
        NbWidgetsModule,
        LoadingSpinnerModule,

    ],
    exports: [
        ShowProcessStepsComponent,
        AcceptationProcessComponent
    ]
})
export class ShowProcessStepsModule {
}
