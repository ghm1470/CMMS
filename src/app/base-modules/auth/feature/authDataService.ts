import {Injectable} from '@angular/core';
import {Province} from '../../../main-modules/dashboard/model/dto/province';
import {City} from '../../../main-modules/basicInformation/city/model/city';
import {OrganizationDto} from '../../../main-modules/basicInformation/organization/model/organizationDto';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  provinceList: Array<Province> = [];
  cityList: Array<City> = [];
  organList: Array<OrganizationDto.Create> = [];
}
