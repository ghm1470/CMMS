export class UserType {
  id: string;
  name: string;
  role: string;
  privilege: Array<string> = [];
  accessList: Array<string> = [];
  // type: Type;
}

export enum Type {
  ADMIN = <any> 'ادمین',
  USER = <any> 'کاربر',
  MANAGER = <any> 'مدیر',
  EXPERT = <any> ';کارشناس',
}



