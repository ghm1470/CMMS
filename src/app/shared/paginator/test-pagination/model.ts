export namespace Model {
  export class Create {
    address: string;
    system: LoginSystemSettingEnum;

  }

  export class GetOne {
    id: string;
    system: LoginSystemSettingEnum;
    address: string;
  }

  export class GetPage {
    id: string;
    title: string;

  }

  export class GetList {
    id: string;
    system: LoginSystemSettingEnum;
    address: string;

  }

  export enum LoginSystemSettingEnum {
    ERP = <any> 'ERP',
    WMS = <any> 'WMS'

  }

}
