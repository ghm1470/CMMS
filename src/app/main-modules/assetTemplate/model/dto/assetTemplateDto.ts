import {CompanyDto} from '../../../company/model/dto/companyDto';
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {CategoryDto} from '../../../category/model/dto/categoryDto';

export namespace AssetTemplateDto {
  import DocumentFile = CompanyDto.DocumentFile;
  import CategoryType = CategoryDto.CategoryType;

  export class Create {
    id: string;
    name: string;
    description: string;
    // categoryId: string;
    // categoryTitle: string;
    parentCategoryId: string;
    parentCategoryTitle: string;
    parentCategoryType: CategoryType;
    subCategoryId: string;
    categoryType: string;
    subCategoryTitle: string;
    // businesses: Array<CompanyDto.Create> = [];
    properties: Array<PropertyDto.Create> = [];
    // documents: Array<CompanyDto.DocumentFile> = [];
    // businessIdList: Array<string> = [];
    // usersId: Array<string> = [];
    // backupCompaniesIdList: Array<string> = [];
    note: string;
    image: DocumentFile = new DocumentFile();
    users: Array<UserDto.Create> = [];
  }
}
