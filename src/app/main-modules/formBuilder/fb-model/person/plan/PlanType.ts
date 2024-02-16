import {Activity} from '../../../../activity/model/activity';

export class PlanType {
  id: string;
  title: string;
  description: string;
  activity: Activity = new Activity();
  hasForm = false;
  formId: string;
  hasSurveyForm = false;
  surveyFormId: string;
  hasImageGallery = false;
  allowedOrganizationIdList: Array<string> = [];
}
