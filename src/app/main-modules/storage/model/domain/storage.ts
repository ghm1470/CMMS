import {CompanyDto} from '../../../company/model/dto/companyDto';
import Address = CompanyDto.Address;
import {AssetDto} from '../../../asset/model/dto/assetDto';

 export namespace Storage {
  export class Create {
    id: string;
    title: string;
    code: string;
    address: Address = new Address();
    assetId: string;
    hasChild = false;
  }
  export class GetOne {
    id: string;
    title: string;
    code: string;
    address: Address = new Address();
    asset: AssetDto.CreateAsset  = new AssetDto.CreateAsset();
    // assetId: string;
  }
}
