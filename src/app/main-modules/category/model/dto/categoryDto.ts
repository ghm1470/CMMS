import {ImageModel} from '../../../../shared/model/ImageModel';
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';

export namespace CategoryDto {
    import DocumentFile = CompanyDto.DocumentFile;

    export class Create {
        id: string;
        // parentCategory: CategoryDto.Create;
        parentId: string;
        title: string;
        description: string;
        // persianName: string;
        image: DocumentFile = new DocumentFile();
        organId: string;
        properties: Array<PropertyDto.Create> = [];
        subCategoriesId: string[];
        imageUrl: string;
        creationDate: any;
        categoryType: CategoryType;
    }

    export class GetAll {
        id: string;
        parentCategoryId: string;
        parentCategoryTitle: string;
        title: string;
        categoryType: CategoryType;
        properties: Array<PropertyDto.Create> = [];
    }

    export enum CategoryType {
        BUILDING = 'سالن' as any,
        FACILITY = 'تجهیز ' as any,
        TOOLS = 'ابزار' as any,
    }

    export enum AssetPriority {
        normal = 'عادی' as any,
        important = 'مهم ' as any,
        strategic = 'استراتژیک' as any,
    }

    export class ParentCategory {
        id: string;
        title: string;
    }
}
