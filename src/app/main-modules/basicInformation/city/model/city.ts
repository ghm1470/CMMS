import {Location} from '../../../dashboard/model/dto/location';
export class City {
  id: string;
  name: string;
  location: Location = new Location();
  provinceId: string;
}
