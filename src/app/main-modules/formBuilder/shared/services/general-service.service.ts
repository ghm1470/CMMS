import {ErrorHandlerServiceBaseService} from './error-handler-service-base.service';
import {ResourceRequest} from '../model/rest/request/resource-request.model';

export class GeneralService extends ErrorHandlerServiceBaseService {
  public entityName: string;

  constructor() {
    super();
    this.entityName = '';
  }

  create(entity: any): any  {
    return super.postService(entity, this.entityName + '/create');
  }

  get(request: ResourceRequest): any {
    return super.postService(request, this.entityName + '/get');
  }

  getFormComplete(request: ResourceRequest): any {
    return super.postService(request, this.entityName + '/get-all');
  }

  delete(idList): any {
    return super.postService(idList, this.entityName + '/delete');
  }

  getMyForm(request: ResourceRequest): any {
    return super.postService(request, this.entityName + '/get-my-form-data');
  }
}
