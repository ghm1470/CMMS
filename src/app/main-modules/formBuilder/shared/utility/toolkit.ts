import {isNullOrUndefined} from 'util';
import * as moment from 'jalali-moment';
declare var JalaliDate: any;

export class Toolkit {

  public static checkIsNullOrUndefined(value) {
    return isNullOrUndefined(value);
  }

  // ولیدیشن کد ملی
  public static checkCodeMeli(value) {
    const code = this.Fa2En(value);
    if (value.length >= 8) {
      const c = parseInt(code.substr(9, 1), 10);
      let s = 0;
      for (let i = 0; i < 9; i++) {
        s += parseInt(code.substr(i, 1), 10) * (10 - i);
      }
      s = s % 11;
      if ((s < 2 && c === s) || (s >= 2 && c === (11 - s))) {
        return true;
      }
    }
    return false;
  }

  // تبدیل اعداد فارسی به انگلیسی
  public static Fa2En(value: any): any {
    const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
    for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
      value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return value;
  }

  // تبدیل اعداد انگلیسی به فارسی
  public static En2Fa(value: any): any {
    const englishNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
    const persianNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
      if (!isNullOrUndefined(value)) {
        value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
      }
    }
    return value;
  }

  public static addZeroToNumber(value: any): any {
    const number = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const numberWithZero = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
    for (let i = 0, numbersLen = number.length; i < numbersLen; i++) {
      value = value.replace(new RegExp(number[i], 'g'), numberWithZero[i]);
    }
    return value;
  }

  public static Min2MiliSecond(minute: number) {
    return minute * 60 * 1000;
  }

  // بررسی درستی زمان
  public static CheckTime(time) {
    if (time.hour <= 24 && time.minute <= 59) {
      return true;
    } else {
      return false;
    }
  }

  // ررسی دو تاریخ با یکدیگر
  /**
   * myDate1 is bigger than myDate2 return 1
   * myDate2 is bigger than myDate1 return 2
   * myDate1 and myDate2 are same  return 0
  **/
  public static CompareDate(myDate1, myDate2) {

      if (myDate1.year > myDate2.year) { return 1; }
      if (myDate1.year < myDate2.year) { return 2; }

      if (myDate1.month > myDate2.month) { return 1; }
      if (myDate1.month < myDate2.month) { return 2; }

      if (myDate1.day > myDate2.day) { return 1; }
      if (myDate1.day < myDate2.day) { return 2; } else { return 0; }
  }

  // جدا کردن قسمت تاریخ از زمان و برگرداندن آن به صورت آبجکت
  public static seperateDateUntilDay(dayDate) {
    let newDayDate;
    newDayDate = {
      year: dayDate.substr(6, 4),
      month: dayDate.substr(0, 2),
      day: dayDate.substr(3, 2),
    };
    return newDayDate;
  }

  // تبدیل تاریخ میلادی به شمسی
  public static gregorianToJalali(year, month, day) {
    const jalaliDate = new JalaliDate();
    return jalaliDate.gregorianToJalali(year, month, day);
  }

  // تبدیل تاریخ میلادی به آبجکتی از تاریخ شمسی
  // public static gregorianToJalaliObject(year, month, day) {
  //   var jalaliDate = new JalaliDate();
  //   let tmp = jalaliDate.gregorianToJalali(year, month, day)[0];
  //   console.log(tmp);
  //   let myDate = new Date();
  //   let dateArray = tmp.split('/');
  //   myDate.year = +dateArray[0];
  //   myDate.month = +dateArray[1];
  //   myDate.day = +dateArray[2];
  //   return myDate;
  // }

  // به صورت آرایه سال و ماه و روز را بر می  گرداند.
  public static jalaliToGregorian(year, month, day) {
    const jalaliDate = new JalaliDate();
    return jalaliDate.jalaliToGregorian(year, month, day);
  }

  //
  public static convertToDateFormat(date: Array<any>, time) {
    return date[1] + '/' + date[2] + '/' + date[0] + ' ' + time;
  }

  public static getCompleteObject(obj1, obj2) {
    for (let attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
  }

  public static compareMomentDate(start, end) {
    // 1: start valid, 2: end valid, start is more than now, end is more than now, end is more than start
    const result: boolean [] = [false, false, false, false, false] ;
    const date = new Date();

    if (!isNullOrUndefined(start) && start !== '') {
      console.log(Toolkit.Fa2En(start));
      const start1 = moment(Toolkit.Fa2En(start), 'jYYYY/jMM/jDD-HH:mm');
      console.log(start1);
      const diff1 = moment().diff(start1, 'seconds');
      if (!start1.isValid) {
        result[0] = true;
      }
      if (start1.isBefore(date) && diff1 > 300) {
        result[2] = true;
      }
    }
    if (!isNullOrUndefined(end) && end !== '') {
      if (!moment(Toolkit.Fa2En(end), 'jYYYY/jMM/jDD-HH:mm').isValid) {
        result[1] = true;
      }
      if (moment(Toolkit.Fa2En(end), 'jYYYY/jMM/jDD-HH:mm').isBefore(date)) {
        result[3] = true;
      }
    }
    if (!isNullOrUndefined(start) && start !== '' && !isNullOrUndefined(end) && end !== '') {
      if (moment(Toolkit.Fa2En(end), 'jYYYY/jMM/jDD-HH:mm').isSameOrBefore(moment(Toolkit.Fa2En(start), 'jYYYY/jMM/jDD-HH:mm'))) {
        result[4] = true;
      }
    }
    return result;
  }

  public static compareTwoValidMomentDate(start, end) {
    let result = false;
    if (!isNullOrUndefined(start) && start !== '' && !isNullOrUndefined(end) && end !== '') {
      if (moment(Toolkit.Fa2En(end), 'jYYYY/jMM/jDD-HH:mm').isSameOrBefore(moment(Toolkit.Fa2En(start), 'jYYYY/jMM/jDD-HH:mm'))) {
        result = true;
      }
    }
    return result;
  }

}
