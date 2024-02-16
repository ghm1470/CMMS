import {Province} from './Province';
import {TownShip} from './TownShip';
import {City} from './City';
import {Country} from './Country';

export class Address {
  country: Country;
  province: Province;
  // townShip:  TownShip ;
  city: City;
  addressDetails: string;
  postalCode: string;
}
