import {PlanType} from './PlanType';
// import {OrganizationType} from '../organizationalStructure/OrganizationType';
import {LightPerson} from '../light-person';
import {PlanStatus} from '../../enumeration/enum/PlanStatus';
import {PayType} from '../../enumeration/enum/PayType';
import {Contributor} from './contributor';
import {Image} from '../../../shared/model/Image';
import {Certificate} from './certificate';
import {Condition} from "./Condition";

export class Plan {
  id: string;
  title: string;
  description: string;
  planType: PlanType = new PlanType();
  // requestingOrganizationType: OrganizationType;
  historyList: Array<History> = [];
  applicant: LightPerson = new LightPerson(); // شخص درخواست کننده برنامه
  planStatus: PlanStatus;
  payable = false;
  fee = 0; // حق عضویت
  payType: PayType;
  minCapacity = 0;
  maxCapacity = 0;
  funds: number; // تنخواه
  startDate: string;
  endDate: string;
  creationDate: string;
  joinStartDate: string;
  joinEndDate: string;
  requestingOrganizationId: string;
  requestingOrganizationTitle: string;
  joinCondition = false;
  memberShip = false;
  joinConditionList: Array<Condition> = [];
  contributorList: Array<Contributor>;
  showInNotifications = false;
  correctionDestLevelId: string;
  imageList: Array<Image> = [];
  formDataId: string; // شناسه جواب فرمی که در نوع برنامه ست شده و هنگام درخواست برنامه پاسخ می دهد.
  hasMembershipForm = false;
  membershipFormId: string;
  confirmMembership = false;
  hasMembershipScore = false;
  membershipScore = 0;
  certificate = new Certificate();
  selected = false;
}
