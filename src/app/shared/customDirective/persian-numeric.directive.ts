import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PersianNumericDirective),
    multi: true
};

@Directive({
    selector: '[appNumeric]',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CurrencyPipe]
})

export class PersianNumericDirective implements ControlValueAccessor {
    private el: HTMLInputElement;

    private onTouchedCallback: () => void = noop;

    private onChangeCallback: (a: any) => void = noop;

    constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe) {
        this.el = elementRef.nativeElement;
    }

    set value(v: any) {
        this.onChangeCallback(v);
    }

    writeValue(value: any) {
        this.setToView(value);
        //     this.el.value = this.transform(value);
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.el.setAttribute('disabled', '');
        } else {
            this.el.removeAttribute('disabled');
        }
    }

    setToModel(value) {
        this.onChangeCallback(value);
    }

    setToView(value) {
        this.el.value = value;
    }

    removeNonNumeric(str) {
        return str ? str.toString().replace(/[^0-9۰-۹]/g, '') : '';
    }

    fixPersianNumeric(str) {
        const persianNumerics = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
            arabicNumerics = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

        if (typeof str === 'string') {
            for (let i = 0; i < 10; i++) {
                str = str.replace(persianNumerics[i], i).replace(arabicNumerics[i], i);
            }
        }
        if (isNotNullOrUndefined(str)) {

            return str;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // transform(value) {
    //     return this.decimalPipe.transform(value);
    // }

    @HostListener('input', ['$event.target.value'])
    input(value) {
        value = this.fixPersianNumeric(value);
        value = this.removeNonNumeric(value);
        this.setToModel(value);
        // value = this.transform(value);
        this.setToView(value);
    }
}


