import * as moment from 'jalali-moment';
import {Toolkit2} from '@angular-boot/util';
import {DateConvert} from './date-convert';

export class Moment {
    public static getJaliliDateFromIsoOrFull2(date) {
        if (date) {
            return moment(date).format('jYYYY/jMM/jDD-HH:mm:s:ms');
        }
    }

    public static getJaliliDateFromIsoOrFullSec(date) {
        if (date) {
            return moment(date).format('HH:mm:s-jYYYY/jMM/jDD');
        }
    }

    public static getJaliliDateFromIsoOrFull(date) {
        if (date) {
            return moment(date).format('HH:mm -jYYYY/jMM/jDD');
        }
    }

    public static getHorseAndMinFromIsoOrFull(date) {
        if (date) {
            return moment(date).format('HH:mm');
        }
    }

    public static getJaliliDateFromIso(date) {
        if (date) {
            return moment(date).format('jYYYY/jMM/jDD');
        }
    }

    public static getGregorianDateFromIsoOrFull(date) {
        if (date) {
            return moment(date).format('HH:mm - YYYY/MM/DD');
        }
    }

    public static getGregorianDateFromIso(date) {
        if (date) {
            return moment(date).format('YYYY/MM/DD');
        }
    }


    public static convertJaliliToGregorian(jDate) {
        return moment(
            moment(Toolkit2.Common.Fa2En(jDate), 'jYYYY/jMM/jDD').toISOString()
        ).format('YYYY/MM/DD');
    }

    public static convertJaliliToGregorianWithTime(jDate) {
        return moment(
            moment(Toolkit2.Common.Fa2En(jDate), 'HH:mm - jYYYY/jMM/jDD').toISOString()
        ).format('HH:mm - YYYY/MM/DD');
    }

    public static convertGregorianToJalili(date) {
        return moment(
            moment(Toolkit2.Common.Fa2En(date), 'YYYY/MM/DD').toISOString()
        ).format('YYYY/MM/DD');
    }

    public static convertGregorianToJaliliWithTime(date) {
        return moment(
            moment(Toolkit2.Common.Fa2En(date), 'HH:mm - YYYY/MM/DD').toISOString()
        ).format('HH:mm - YYYY/MM/DD');
    }

    public static convertJaliliToIsoDate(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'jYYYY/jMM/jDD').toISOString();
    }

    public static convertJaliliToDate(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'jYYYY/jMM/jDD');
    }

    public static convertJaliliToIsoDateWithTime(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'jYYYY/jMM/jDD - h:m').toISOString();
    }

    public static convertGregorianToIsoDate(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'YYYY/MM/DD').toISOString();
    }

    public static convertGregorianToIsoDateWithTime(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'HH:mm - YYYY/MM/DD').toISOString();
    }


    public static convertJaliliToDateWithTime(jDate) {
        return moment(Toolkit2.Common.Fa2En(jDate), 'HH:mm - jYYYY/jMM/jDD').toDate();
    }

    public static convertIsoToDateWithTime(date) {
        return moment(date).toDate();

    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public static convertIsoToJDateWithTimeEnToFa(date) {
        const dateConvert = DateConvert;
        if (date) {
            // const y = date.split('-')[0];
            // const m = date.split('-')[1];
            // const d = +date.split('-')[2].split('T')[0];
            // const pDate = dateConvert.convertGToP(y, m, d);
            // // const h = new Date(date).getHours();
            // const h = date.split('-')[2].split('T')[1].split(':')[0];
            // // const min = new Date(date).getMinutes();
            // const min = date.split('-')[2].split('T')[1].split(':')[1];
            // const time = h + ':' + min;
            // return Toolkit2.Common.En2Fa((pDate[0] + '/' + pDate[1] + '/' + pDate[2] + '-' + time));


            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return Toolkit2.Common.En2Fa(res.y + '/' + res.m + '/' + res.d + '-' + res.h + ':' + res.min);


        } else {
            return ('--------');
        }
    }

    public static convertIsoToJDateEnToFa(date) {
        const dateConvert = DateConvert;
        if (date) {
            const y = date.split('-')[0];
            const m = date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const pDate = dateConvert.convertGToP(y, m, d);
            // const h = new Date(date).getHours();
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            // const min = new Date(date).getMinutes();
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const time = h + ':' + min;
            return Toolkit2.Common.En2Fa((pDate[0] + '/' + pDate[1] + '/' + pDate[2]));
        } else {
            return ('--------');
        }
    }

    public static convertIsoToJDateOnlyTimeEnToFa(date) {
        if (date) {
            // // const h = new Date(date).getHours();
            // const h = date.split('-')[2].split('T')[1].split(':')[0];
            // // const min = new Date(date).getMinutes();
            // const min = date.split('-')[2].split('T')[1].split(':')[1];
            // const time = h + ':' + min;
            // return Toolkit2.Common.En2Fa((time));


            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return Toolkit2.Common.En2Fa(res.h + ':' + res.min);

        } else {
            return ('--------');
        }
    }

    public static convertIsoToJDateWithTime(date) {

        if (date) {
            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return (res.y + '/' + res.m + '/' + res.d + '-' + res.h + ':' + res.min);
        } else {
            return ('--------');
        }
    }

    public static convertIsoToJDateFa(date) {
        const dateConvert = DateConvert;
        const myMoment = Moment;
        if (date) {
            // const y = date.split('-')[0];
            // const m = date.split('-')[1];
            // const d = +date.split('-')[2].split('T')[0];
            // const pDate = dateConvert.convertGToP(y, m, d);
            // return Toolkit2.Common.En2Fa(pDate[0] + '/' + pDate[1] + '/' + pDate[2]);


            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return Toolkit2.Common.En2Fa(res.y + '/' + res.m + '/' + res.d);

        } else {
            return ('--------');
        }

    }

    public static convertIsoToJDate(date) {
        const dateConvert = DateConvert;
        const myMoment = Moment;
        if (date) {
            const y = date.split('-')[0];
            const m = date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];

            const pDate = dateConvert.convertGToP(y, m, d);

            if (+pDate[1] < 10) {
                pDate[1] = '0' + pDate[1];
            }
            if (+pDate[2] < 10) {
                pDate[2] = '0' + pDate[2];
            }
            return (pDate[0] + '/' + pDate[1] + '/' + pDate[2]);
        } else {
            return ('--------');
        }

    }
    public static convertGToJ(date) {
        const dateConvert = DateConvert;
        if (date) {
            const y = date.split('/')[0];
            const m = date.split('/')[1];
            const d = +date.split('/')[2];

            const pDate = dateConvert.convertGToP(y, m, d);

            if (+pDate[1] < 10) {
                pDate[1] = '0' + pDate[1];
            }
            if (+pDate[2] < 10) {
                pDate[2] = '0' + pDate[2];
            }
            return (pDate[0] + '/' + pDate[1] + '/' + pDate[2]);
        } else {
            return ('--------');
        }

    }

    public static convertIsoToGDate(date) {
        if (date) {
            const y = date.split('-')[0];
            let m: any = date.split('-')[1];
            let d: any = +date.split('-')[2].split('T')[0];
            m = +m;
            d = +d;
            if (+m < 10) {
                m = '0' + m;
            }
            if (+d < 10) {
                d = '0' + d;
            }
            return (y + '/' + m + '/' + d);
        } else {
            return ('--------');
        }

    }

    public static getDayTitle(day) {
        switch (day) {
            case 0:
                return 'یکشنبه';
            case 1:
                return 'دوشنبه';
            case 2:
                return 'سه شنبه';
            case 3:
                return 'چهارشنبه';
            case 4:
                return 'پنجشنبه';
            case 5:
                return 'جمعه';
            case 6:
                return 'شنبه';
        }
    }

    public static convertDateByTimZone(y, m, d, h, min) {
        const dateConvert = DateConvert;
        const pDate = dateConvert.convertGToP(y, m, d);
        const timeZoneOffset = new Date().getTimezoneOffset();
        // const hz = +(timeZoneOffset / 60).toString().split('.')[0] * -1;// ساعت تایم زون لوکال
        const minZ = +(timeZoneOffset % 60) * -1;// دقیقه تایم زون لوکال
        let minFa: any = +min + minZ;
        let hFa: any = +JSON.parse(JSON.stringify(h));
        let yFa = +JSON.parse(JSON.stringify(pDate[0]));
        let mFa: any = +JSON.parse(JSON.stringify(pDate[1]));
        let dFa: any = +JSON.parse(JSON.stringify(pDate[2]));
        // hFa += hz;
        if (mFa > 6) {
            hFa += 3;
        } else {
            hFa += 4;
        }
        if (minFa > 59) {
            minFa = minFa - 60;
            hFa += 1;
        }
        if (hFa > 23) {
            hFa = hFa - 24;
            dFa += 1;
        }
        if (mFa === 12) {
            if (dFa > 29) {
                dFa = dFa - 29;
                mFa = 1;
                yFa += 1;
            }
        } else if (mFa < 7) {
            if (dFa > 31) {
                dFa = dFa - 31;
                mFa += 1;
            }
        } else if (mFa > 6) {
            if (dFa > 30) {
                dFa = dFa - 30;
                mFa += 1;
            }
        }
        hFa.toString().length === 1 ? hFa = '0' + hFa : '';
        minFa.toString().length === 1 ? minFa = '0' + minFa : '';
        mFa.toString().length === 1 ? mFa = '0' + mFa : '';
        dFa.toString().length === 1 ? dFa = '0' + dFa : '';
        const date = {
            y: yFa,
            m: mFa,
            d: dFa,
            h: hFa,
            min: minFa
        };
        return date;
    }

    public static getJDateFromIsoOnlyYear(date) {

        if (date) {
            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return (res.y);
        } else {
            return ('--------');
        }
    }

    public static getJDateFromIsoOnlyMonth(date) {

        if (date) {
            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return (res.m);
        } else {
            return ('--------');
        }
    }

    public static getJDateFromIsoOnlyDay(date) {

        if (date) {
            const y = +date.split('-')[0];
            const m = +date.split('-')[1];
            const d = +date.split('-')[2].split('T')[0];
            const h = date.split('-')[2].split('T')[1].split(':')[0];
            const min = date.split('-')[2].split('T')[1].split(':')[1];
            const res = this.convertDateByTimZone(y, m, d, h, min);
            return (res.d);
        } else {
            return ('--------');
        }
    }

}


// 2018-12-19T13:35:00.000Z
// 2018-12-17T13:45:51.380Z
