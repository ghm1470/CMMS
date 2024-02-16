import {Location} from '../../../dashboard/model/dto/location';

export namespace OrganizationDto {
  export class Create {
    id: string;
    name: string;
    organCode: string;
    organLocation: Location = new Location();
    parentOrganId: string;
    cityId: string;
    provinceId: string;
    userTypeList: string[] = [];
  }

  export class GetAllByFilter {
    provinceId: string;
    cityId: string;
    parentOrganId: string;
    organizationName: string;
    organizationCode: string;
  }
  export class  GetAll {
    userTypeIdList: string;
    id: string;
    name: string;
    organCode: string;
    cityName: string;
    provinceName: string;
    parentOrganName: string;
    organLocation: Location = new Location();
  }
}
