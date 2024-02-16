
export class NumberTools {

  public static EnFaSowich(str, lang) {
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
}
