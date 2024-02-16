import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'EnToFa'
})
export class EnToFaPipe implements PipeTransform {

    constructor() {
    }

    transform(key: any): string {
        return En2Fa(key);

        function En2Fa(value: any): any {
            value = value.toString();
            const englishNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
            const persianNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
            for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
                value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
            }
            return value;
        }
    }
}
