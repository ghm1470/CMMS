export namespace managementMeeting {

  export class GetListByDate {
    fromDate: any;
    toDate: any;
  }

  export class GetList {
    id: string;
    title: string;
  }

  export class GetOne {
    applyVacation: boolean;
    houre: number;
    minute: number;
    id: string;
    monthlyList: string;
    specialDate: any;
    title: string;
    cron: string;
    type: Type;
    weeklyList: string;
  }

  export class GetPage {
    id: string;
    title: string;
    cron: string;
  }

  export class Create {
    title: string;
    description: string;
    date: string;
    startDate: any;
    endDate: any;
    startTime: any;
    endTime: any;
  }

  export class Update {
    applyVacation: boolean;
    houre: number;
    minute: number;
    monthlyList: string;
    specialDate: any;
    title: string;
    cron: string;
    type: Type;
    weeklyList: string;
  }


  export enum Type {
    SPECIAL = <any>'SPECIAL',
    DAILY = <any>'DAILY',
    WEEKLY = <any>'WEEKLY',
    MONTHLY = <any>'MONTHLY',
    CRON = <any>'CRON'
  }


}
