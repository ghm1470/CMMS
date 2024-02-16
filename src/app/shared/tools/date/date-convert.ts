export class DateConvert {
  public static GREGORIAN_EPOCH = 1721425.5;
  public static PERSIAN_EPOCH = 1948320.5;

  public static convertPToG(year, month, day) {
    var date, j;
    j = DateConvert.persian_to_jd(year, month, day);
    date = DateConvert.jd_to_gregorian(j);
    var weekday = DateConvert.jwday(j);
    return new Array(date[0], date[1], date[2], weekday);
  }


  public static jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
      yindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - DateConvert.GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = DateConvert.mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = DateConvert.mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = DateConvert.mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
      year++;
    }
    yearday = wjd - DateConvert.gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < DateConvert.gregorian_to_jd(year, 3, 1)) ? 0
        :
        (DateConvert.leap_gregorian(year) ? 1 : 2)
    );
    var month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    var day = (wjd - DateConvert.gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
  }


  public static convertGToP(year, month, day) {
    month--;
    var j, weekday;
    //  Update Julian day
    j = DateConvert.gregorian_to_jd(year, month + 1, day) +
      (Math.floor(0 + 60 * (0 + 60 * 0) + 0.5) / 86400.0);
    //  Update Persian Calendar
    var perscal = DateConvert.jd_to_persian(j);
    weekday = DateConvert.jwday(j);
    return new Array(perscal[0], perscal[1], perscal[2], weekday);
  }

  public static gregorian_to_jd(year, month, day) {
    DateConvert.GREGORIAN_EPOCH = 1721425.5;
    return (DateConvert.GREGORIAN_EPOCH - 1) +
      (365 * (year - 1)) +
      Math.floor((year - 1) / 4) +
      (-Math.floor((year - 1) / 100)) +
      Math.floor((year - 1) / 400) +
      Math.floor((((367 * month) - 362) / 12) +
        ((month <= 2) ? 0 :
            (DateConvert.leap_gregorian(year) ? -1 : -2)
        ) +
        day);
  }

  public static leap_gregorian(year) {
    return ((year % 4) === 0) &&
      (!(((year % 100) === 0) && ((year % 400) !== 0)));
  }

  public static mod(a, b) {
    return a - (b * Math.floor(a / b));
  }

  public static jd_to_persian(jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
      aux1, aux2, yday;
    jd = Math.floor(jd) + 0.5;
    depoch = jd - DateConvert.persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = DateConvert.mod(depoch, 1029983);
    if (cyear == 1029982) {
      ycycle = 2820;
    } else {
      aux1 = Math.floor(cyear / 366);
      aux2 = DateConvert.mod(cyear, 366);
      ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) + aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
      year--;
    }
    yday = (jd - DateConvert.persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - DateConvert.persian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
  }

  public static persian_to_jd(year, month, day) {
    var epbase, epyear;
    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + DateConvert.mod(epbase, 2820);
    return day +
      ((month <= 7) ?
          ((month - 1) * 31) :
          (((month - 1) * 30) + 6)
      ) +
      Math.floor(((epyear * 682) - 110) / 2816) +
      (epyear - 1) * 365 +
      Math.floor(epbase / 2820) * 1029983 +
      (DateConvert.PERSIAN_EPOCH - 1);
  }

  public static jwday(j) {
    return DateConvert.mod(Math.floor((j + 1.5)), 7);
  }

}
