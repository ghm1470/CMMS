import {WarrantyType} from '../../part/warranty/model/warranty-type-enum';
import {CompanyDto} from '../../company/model/dto/companyDto';

export namespace WarrantyForExam {
  export class Warranty {
    id: string;
    warrantyType: WarrantyType;
    warrantyUsageTermType: WarrantyUsageTermType;
    // // id: string;
    // name: string;
    // time: string;
    // expiry: any;
    // // timeType: WarrantyTimeType;
    // type: WarrantyType;
    // unitOfMeasurementId: string;
    // kilometerWarranty: string;
    // description: string;
    // warrantyCode: string;
    // warrantyCompany: CompanyDto.Create;
    // partId: string;
  }

  export enum WarrantyType {
    BASIC = <any> 'اصلی',
    EXTENDED = <any> 'ضمیمه ای',
  }

  export enum WarrantyUsageTermType {
    DATE = <any> 'تاریخ',
    METER_READING = <any> 'خواندن متر',
    PRODUCTION_TIME = <any> 'زمان تولید',
  }
}

