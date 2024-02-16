import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MinToHourPipe} from './minToHour.pipe';


@NgModule({
    declarations: [MinToHourPipe],
    imports: [
        CommonModule
    ],
    exports: [
        MinToHourPipe
    ]
})
export class MinToHourModule {
}
