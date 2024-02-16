 export namespace UserTypeDto {
  export class Create {
    id: string;
    name: string;
    type: string;
    privilege: string[] = [];
    accessList: string[] = [];
  }

  export class CreateSend {
    id: string;
    name: string;
    type: string;
    privilege: string[] = [];
  }

  export class GetPage {
    id: string;
    name: string;
    type: string;
    privilege: string[] = [];
  }

  export enum Role {
    ADMIN = <any> 'ادمین',
    USER = <any> 'کاربر',
    MANAGER = <any> 'مدیر',
    EXPERT = <any> 'تکنسین',
  }



}
