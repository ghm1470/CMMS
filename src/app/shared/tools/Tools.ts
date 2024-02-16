
export class Tools {

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

  // عدد را گرفته سه رقم سه رقم جدا می کند و به صورت فارسی تحویل میدهد
  public static getPerNumber(value) {
    return this.EnToFa(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }

  // تبدیل اعداد فارسی به انگلیسی
  public static Fa2En(value: any): any {
    try {
      const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
      const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', '٫'];
      for (let i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
        value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
      }
      return value;
    } catch (e) {
      return value;
    }
  }

  // تبدیل اعداد انگلیسی به فارسی
  public static EnToFa(value: any): any {
    const persianNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '.'];
    const englishNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', '/', '٫'];
    for (let i = 0, numbersLen = persianNumbers.length - 1; i < numbersLen; i++) {
      value = value.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return value;
  }


// // محاسبه نقطه مابین دو نقطه جغرافیایی
//   public static calculateCenterOfTwoPoints(lat1, lon1, lat2, lon2) {
//     const dLon = Tools.toRadians(lon2 - lon1);
//     // convert to radians
//     lat1 = Tools.toRadians(lat1);
//     lat2 = Tools.toRadians(lat2);
//     lon1 = Tools.toRadians(lon1);
//
//     const Bx = Math.cos(lat2) * Math.cos(dLon);
//     const By = Math.cos(lat2) * Math.sin(dLon);
//     const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
//     const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
//
//     const location: GoogleMap = {
//       latitude: Tools.toDegrees(lat3),
//       longitude: Tools.toDegrees(lon3)
//     };
//     return (location);
//   }

  public static toRadians(degree) {
    return degree * (Math.PI / 180);
  }

  public static toDegrees(radian) {
    return radian * (180 / Math.PI);
  }

  // پایان محاسبه نقطه مابین دو نقطه جغرافیایی

  // باکس برای گزارشگیری
  public static showBox(color, iconClass, title, icon, firstLink, firstLinkTitle,
                        firstAmount, secondLink, secondLinkTitle, secondAmount) {
    // return '<div class="col-lg-3 col-xs-12">' +
    //   '<div class="small-box ' + color + '">' +
    //   '<div class="inner">' +
    //   '<p> ' + title + '</p>' +
    //   '<h4 class="text-center">' +
    //   amountForActive +
    //   '</h4>' +
    //   '</div>' +
    //   '<div class="">' +
    //   '<i class="ion  ' + icon + ' "></i>' +
    //   '</div>' +
    //   '<a [routerLink]="[' + LinkAddress + ']" class="small-box-footer">' +
    //   footerText + '</a>' +
    //   '</div>' +
    //   '</div>';

    return '<div class="col-md-3 col-sm-6">' +
      '<div class="' + color + '">' +
      '<div class="boxheader">' +
      '<div class="row">' +
      '<div class="col-md-8 col-sm-8 col-xs-8">' +
      '<div class="boxtitle">' +
      '<label>' + title + '</label>' +
      '</div>' +
      '</div>' +
      '<div class="col-md-4 col-sm-4 col-xs-4">' +
      '<div class="' + iconClass + ' ">' +
      '<i class="' + icon + '" aria-hidden="true"></i>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="value">' +
      '<p><a [routerLink]="[' + firstLink + ']">' + firstLinkTitle + ':</a>' + firstAmount + '</p>' +
      '<p><a [routerLink]="[' + secondLink + ']">' + secondLinkTitle + ':</a>' + secondAmount + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }
}
