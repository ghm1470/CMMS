import {UserDto} from '../../../../user/model/dto/user-dto';
import {NotifyEvent} from './notifyEvent';
import {ImageModel} from '../../../../../shared/model/ImageModel';

export class Notify {
  id: string;
  referenceId: string;
  user: UserTow;
  events: Array<NotifyEvent> = [];
  // =============این دوتا ایتم برای نوتیفای ۲ هستن====
  // message: string;
  // eventsMessage: Array<NotifyEvent> = [];

  // ==================================================

  constructor(refId: string) {
    this.referenceId = refId;
    this.user = new UserTow();
  }
}


export class UserTow {
  id: string;
  name: string;
  family: string;
  fatherName: string;
  nationalCode: string;
  birthDay: any;
  startWork: any;
  username: string;
  password: string;
  userTypeId: string;
  // orgId: string;
  image: ImageModel = new ImageModel();
  resetPasswordCode: string;
  assets: string[] = [];
  parentUserId: string;
  documentIdList: string[] = [];
  messageId: string;
  deleted = false;
  organizationIdList: string[] = [];
}
