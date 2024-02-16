import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
    name: 'minToHour'
})
export class MinToHourPipe implements PipeTransform {

    constructor() {
    }

    transform(key: any): string {
        if (key === 0) {
            return key;
        }
        if (isNullOrUndefined(key)) {
            return '-----';
        }
        return minToHour(key);

        function minToHour(value: any): any {
            const n = Math.floor(value / 60);
            let mode: any = value % 60;
            if (mode < 10) {
                mode = '0' + mode;
            }
            value = n + ':' + mode;
            return value;
        }
    }
}
