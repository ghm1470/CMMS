import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Directive({
  selector: '[Persian2English]'
})
export class Persian2EnglishDirective {

  @Input() ngModel: string;
  constructor(private el: ElementRef) {
    (el.nativeElement as HTMLInputElement).value = '';
  }

  @HostListener('keyup')
  onChange() {
    (this.el.nativeElement as HTMLInputElement).value = this.persian2English((this.el.nativeElement as HTMLInputElement).value);
  }
  public  persian2English(value: any): any {
    const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
    if (!isNullOrUndefined(value)) {
      for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
        value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
      }
    }
    return value;
  }
}
