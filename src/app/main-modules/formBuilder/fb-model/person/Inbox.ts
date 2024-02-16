import {Plan} from './plan/Plan';

export class Inbox {

  id: string;
  ownerId: string;
  sentPlanList: Plan[];
  receivedPlanList: Plan[];
  requestPlanList: Plan [];
}
