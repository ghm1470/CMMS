import {BASIC_INFORMATION, MICROSERVICE_PREFIX} from '../shared/constants/microservice.name.constants';
import {GeneralService} from '../shared/services/general-service.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENTITYNAME_FORM_CATEGORY} from '../fb-model/form/form-category';

@Injectable({
  providedIn: 'root'
})
export class BasicInfoService extends GeneralService {
  constructor(public http: HttpClient) {
    super();
    this.microserviceName = BASIC_INFORMATION;
    this.prefixUrl = MICROSERVICE_PREFIX;
    this.entityName = ENTITYNAME_FORM_CATEGORY;
  }
}
