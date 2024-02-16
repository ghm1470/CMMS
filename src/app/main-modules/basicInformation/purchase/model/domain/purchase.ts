import {CompanyDto} from '../../../../company/model/dto/companyDto';
import {Currency} from '../../../currency/model/dto/currency';

export class Purchase {
  id: string;
  price: number;
  business: CompanyDto.Create = new CompanyDto.Create();
  currency: Currency = new Currency();
  deliverDate: string;
  purchaseDate: string;
}
