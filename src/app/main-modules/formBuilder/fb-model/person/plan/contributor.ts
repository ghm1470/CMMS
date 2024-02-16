import {LightPerson} from '../light-person';
import {RegisterStatus} from '../../enumeration/enum/registerStatus';


export class Contributor {
  person: LightPerson;
  joinDate: string;
  registerStatus: RegisterStatus;
  surveyed: boolean; // در نظرسنجی شرکت کرده یا نه؟
  surveyFormDataId: string; // آی دی جواب فرم نظرسنجی
  membershipFormDataId: string; // آی دی جواب فرم عضویت در برنامه
  selected: boolean; // helper for confirmation
  certificateIssuanceDate: string; // اگر مقدار نداشته باشد یعنی گواهی صادر نشده است.
  certificateHashCode: string;
}
