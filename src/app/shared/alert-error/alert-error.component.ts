import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Tools} from './tools';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.scss']
})
export class AlertErrorComponent implements OnInit, OnChanges {
  @Input() touched: boolean | undefined;
  @Input() data: any;
  @Input() maxlengthMsg: string | undefined;
  @Input() minlengthMsg: string | undefined;
  @Input() requiredMsg: string | undefined;
  @Input() patternMsg: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.requiredMsg && this.data.errors && this.data.errors.required) {
      this.requiredMsg = 'پر کردن فیلد اجباری است';
    }
    if (!this.patternMsg && this.data.errors) {
      this.patternMsg = 'مقدار وارد شده صحیح نیست';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.data.statusChanges.subscribe((formStatus: any) => {
    //   this.touched = this.data.touched;
    //   if (formStatus === 'INVALID' && changes.data.currentValue.errors) {
    //     const error = changes.data.currentValue.errors;
    //     if (!Tools.isNullOrUndefined(error.maxlength)) {
    //       const length = error.maxlength.requiredLength;
    //       this.maxlengthMsg = 'مقدار وارد شده حداکثر باید ' + length + ' کاراکتر باشد';
    //     } else if (!Tools.isNullOrUndefined(error.minlength)) {
    //       const length = error.minlength.requiredLength;
    //       this.minlengthMsg = 'مقدار وارد شده حداقل باید ' + length + ' کاراکتر باشد';
    //     }
    //   }
    // });
  }

}
