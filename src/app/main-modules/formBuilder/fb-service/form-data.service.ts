import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormDataService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'form';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  getOnQuestionAnswers(formId, questionId) {
    const suffixPath =
      'get-question-all-answer/' + formId + '/' + questionId;
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getOptionalQuestionAnswers(formId, questionId) {
    const suffixPath =
      'get-question-group-answer/' + formId + '/' + questionId;
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getPersonAnsweredToOption(formId, optionId) {
    const suffixPath =
      'get-question-all-person/' + formId + '/' + optionId;
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  createByPerson(formData, cId) {
    const suffixPath = 'create';
    return super.postService(formData, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: {companyId: cId}
    });
  }

  getOneFormData(formDataId) {
    return super.getService( {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {}),
      urlQueryObject: {id: formDataId}
    });
  }
}
