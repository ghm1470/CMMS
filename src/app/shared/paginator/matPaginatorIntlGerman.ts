import {MatPaginatorIntl} from '@angular/material';
import {Injectable} from '@angular/core';

@Injectable()
export class MatPaginatorIntlGerman extends MatPaginatorIntl {
  itemsPerPageLabel = 'تعداد در صفحه : ';
  nextPageLabel = ' صفحه بعد';
  previousPageLabel = ' صفحه قبل';
  firstPageLabel = ' اولین صفحه ';
  lastPageLabel = ' آخرین صفحه ';


  getRangeLabel = (page: number, pageSize: number, length: number) => {
    return this.En2Fa((page * pageSize + 1).toString()) + ' - '
      + this.En2Fa((page * pageSize + pageSize).toString())
      + ' از ' + this.En2Fa(length.toString());
  }


  En2Fa(value: any): any {
    const englishNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
    const persianNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
      value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return value;
  }

}
