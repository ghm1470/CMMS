import {Location} from '../../../dashboard/model/dto/location';


export namespace ProvinceDto {
  export class Get {
    id: string;
    name: string;
    location: Location = new Location();
}
  export  class Creat {
    name: string;
    location: Location = new Location();
  }
  export class Address {
    countryId: string;
    provinceId: string;
    cityId: string;
    details: string;
    // location: Location;
    postalCode: string;

  }
  export class Location {
    x: number;
    y: number;
  }
}
