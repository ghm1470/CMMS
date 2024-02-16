import {FormStatus} from '../enumeration/form-status';
import {BasicElement} from '../element/basic-element';
import {FormData} from '../../fb-model/form/form-data';
import {FormCategory} from './form-category';

export class Form {
  id: string = null;
  title: string = null;
  description: string = null;
  formStatus: FormStatus = FormStatus.EDITING;
  creatorId: string = null;
  elementList: Array<BasicElement> = [];
  totalResponder = 1000;
  formScore: number = null;
  systemCreationDate: string = null;
  companyId: string;
  formCategoryId: string;
  form: Form ;

}
export class FormAndFormCategoryDTO {
  form: Form = new Form();
  formCategory: FormCategory;
}
export class FormAndFormData {
  form: Form = new Form();
  formData: FormData = new FormData();
}
export class FormId {
  formId: string = null;
}
