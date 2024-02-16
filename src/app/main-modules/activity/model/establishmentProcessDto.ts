import {ActionType} from './enum/actionType';

export class EstablishmentProcessDto {
  actionType: ActionType;
  activityId: string;
  companyId: string;
  description: string;
}
