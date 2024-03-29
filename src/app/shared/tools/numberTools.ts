
export class NumberTools {

  public static EnFaSwitch(str, lang) {
    let result = str;
      if (lang === 'FA') {
        if ((str != null) && str.toString().trim() !== '') {
          result = this.englishToPersianNumber(str.toString()).toString();
        } else {
          result = '';
        }
      } else {
        result = str;
      }
    return result;

  }

  static englishToPersianNumber(number) {
    if (!number) {
      return;
    }
    const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];

    for (let i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {
      number = number.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
    }
    return number;
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
      value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return value;
  }
  // ولیدیشن کد ملی
  public static checkCodeMeli(value) {
    const code = this.Fa2En(value);
    let cont = 0;
    if (value.length >= 8) {
      const c = parseInt(code.substr(9, 1), 10);
      let s = 0;
      for (let i = 0; i < 9; i++) {
        s += parseInt(code.substr(i, 1), 10) * (10 - i);
        if (code[0] === code[i]) {
          cont++;
        }
      }
      s = s % 11;
      if (cont > 8) {
        return false;
      }
      if ((s < 2 && c === s) || (s >= 2 && c === (11 - s))) {
        return true;
      }
    }
    return false;
  }
  
}
