import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {PersianNumericDirective} from './persian-numeric.directive';


@NgModule({
    declarations: [PersianNumericDirective],
    exports: [
        PersianNumericDirective
    ],
    imports: [
        CommonModule,

    ],

    providers: [
    DecimalPipe
]

})
export class CustomDirectiveModule {
}
