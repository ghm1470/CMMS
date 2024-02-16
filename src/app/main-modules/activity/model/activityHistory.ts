import {ActivityLevel} from './activityLevel';
import {ActionType} from './enum/actionType';
import {BaseInfoDTO} from '../../worktable/model/baseInfoDTO';

export class ActivityHistory {
  id: string;
  receiver: ActivityLevel;
  actionType: ActionType;
  description: string;
  creationDate: Date;
  formDataId: string;
  sender: BaseInfoDTO;
}
