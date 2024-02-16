import {PropertyCategoryDto} from '../../../propertyCategory/model/dto/property-category-dto';

export namespace PropertyDto {
  export class Create {
    parentCategoryId: string;
    id: string;
    key: string;
    repository: Array<string> = [];
    data: Array<string> = [];
    type: PropertyType;
    val: string;
    propertyCategoryId: string;
    propertyCategoryTitle: string;
    propertyCategory: PropertyCategoryDto.Create;
    valueType: ValueType;

  }

  export enum PropertyType {
    keyValue = 'کلید-مقدار' as any,
    selectOne = 'تک انتخابی' as any,
    selectMulti = 'چند انتخابی' as any,
  }

  export enum ValueType {
    INTEGER = 'INTEGER' as any,
    STRING = 'STRING' as any
  }
}
