import {Role} from './Role';
import {Status} from '../../enumeration/enum/Status';

export class Privilege {
    id: string;
    title: string;
    roleList: Array<Role> = [];
    status: Status;

}
