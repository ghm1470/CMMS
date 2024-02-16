// Created by ghasem on 2020/1/19.
export namespace MeetingDto {
  export class Year {
    year: number;
    kabiseh: boolean;
  }

  export class Month {
    number: number;
    title: string;

  }

  export class SessionDay {
    id: string;
    day: number;
    month: Month;
    year: number;
    sessionList: Session[] = [];

  }

  export class Session {
    // creatorId: string;
    // date: string;
    // description: string;
    // id: string;
    // ownerId: string;
    // startDate: string;
    // systemCreationDate: string;

    id: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }

  export class SessionGetOn {
    creatorId: string;
    date: string;
    title: string;
    description: string;
    id: string;
    ownerId: string;
    startDate: any;
    systemCreationDate: any;
  }

  export function CreateMonthList(): Month[] {
    const monthList: Month[] = [];
    for (let i = 1; i < 13; i++) {
      const newMonth = new Month();
      newMonth.number = i;

      switch (i) {
        case 1:
          newMonth.title = 'فروردین';
          break;
        case 2:
          newMonth.title = 'اردیبهشت';
          break;
        case 3:
          newMonth.title = 'خرداد';
          break;
        case 4:
          newMonth.title = 'تیر';
          break;
        case 5:
          newMonth.title = 'مرداد';
          break;
        case 6:
          newMonth.title = 'شهریور';
          break;
        case 7:
          newMonth.title = 'مهر';
          break;
        case 8:
          newMonth.title = 'آبان';
          break;
        case 9:
          newMonth.title = 'آذر';
          break;
        case 10:
          newMonth.title = 'دی';
          break;
        case 11:
          newMonth.title = 'بهمن';
          break;
        case 12:
          newMonth.title = 'اسفند';
          break;

      }
      monthList.push(newMonth);
    }

    return monthList;
  }
}
