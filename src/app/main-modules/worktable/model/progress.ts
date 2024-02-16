import {ActivityHistory} from '../../activity/model/activityHistory';

export class Progress {
  companyId: string;
  activityHistoryList: ActivityHistory[] = [];
  activityTitle: string;
  companyName: string;
  status: string;
}
