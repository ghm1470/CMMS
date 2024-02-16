import {Privilege} from './Privilege';

export class UserAccount {
     username: string;
     password: string;
     lastPasswordResetDate: Date;
     enabled: boolean ;
     privilegeList: Array<Privilege>;
}
