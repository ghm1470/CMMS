import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {Account} from '../../../../shared/model/account';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {PartDto} from '../../../part/model/dto/part';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';

class TimeType {
}

export namespace AssetDto {
    import Address = CompanyDto.Address;
    import DocumentFile = CompanyDto.DocumentFile;
    import CategoryType = CategoryDto.CategoryType;

    export class CreateAsset {
        id: string;
        name: string; //
        installYear: string = null; //سال نصب
        hasExchange: string; //دستگاه جایگزین
        style: string; //نوع/تیپ
        nominalCapacity: string; //ظرفیت اسمی
        serialNumber: string = null; // شماره سریال
        constructionYear: string = null; // سال ساخت
        manufacturer: string; //سازنده
        description: string;  //
        code: string; //
        status: boolean; //
        assetTemplateId: string; //
        assetPriority: string; // الویت
        categoryId: string; // خانواده گروه
        categoryTitle: string; // خانواده گروه
        parentLocationId: string; //
        parentLocationName: string;
        assetTemplateName: string; //
        isPartOfAsset: string;
        image: DocumentFile;
        users: Array<any>; //
        categoryType: CategoryType;
        activityIdList: string[] = [];
        // parts:Array<Part>; //
        // properties: Array<PropertyDto.Create>; //
        // companyList: Array<string>; // ای دی شرکت های پشتیبانی
        documents: Array<CompanyDto.DocumentFile>; //
        // childAssetList: AssetDto.CreateAsset[] = [];
        hasChild: boolean;
        warrantyDate: any;
    }

    export class GetOneAsset {
        mainAsset: CreateAsset;
        parentAsset: CreateAsset;
    }

    export class AssetBasicInformation {
        address: Address = new Address(); //
        // unit: UnitOfMeasurement[] = new UnitOfMeasurement();
        unitIdList: string[] = [];
        unitOfMeasurementName?: any[] = [];
        note: string;
        account: Account = new Account();
        budgetId: string;
        chargeDepartmentId: string;
        quantity: number;
        minQuantity: number;
        parentId: string;
        //  //////// view /////////
        id?: string;
        budgetName?: string;
        chargeDepartmentName?: string;
    }

    export class AssetBasicInformationGetOne {
        address: Address = new Address(); //
        unit: UnitOfMeasurement[] = [];
        note: string;
        account: Account = new Account();
        budget: Budget;
        chargeDepartment: ChargeDepartment = new ChargeDepartment();
        parentId: string;
    }

    // image:ImageModel=new ImageModel(); //
    // assets: Array<any> = []; //
    // warranties: Array<any>; //

    // meterings: Array<Metering>; //
    // calibrations: Array<any> = []; //
    // purchase: Array<any>; //
    // parentCategoryId: string;
    // subCategoryId: string;

    // repairSchedulingLogs: Array<AssetRepairSchedulingLog>; //
    //
    // consumableLogs: Array<AssetConsumablePartLog>; //
    //
    // onOffLogs: Array<AssetOnlineOfflineLog>; //
    //
    // openWorkOrderLogs: Array<AssetOpenWorkOrderLog>; //
    //
    // workOrderDateLogs: Array<AssetWorkOrderDateLog>; //

    export class AssetRepairSchedulingLog {
        id: string;
        date: string;
        description: string;
    }

    export class AssetListBOM {
        id: string;
        name: string;
        isPartOfAsset: string;
        code: string;
        categoryType: CategoryType;
    }

    export class AssetConsumablePartLog {
        id: string;
        workOrder: WorkOrderDto.Create = new WorkOrderDto.Create();
        part: PartDto.Create = new PartDto.Create();
        count: number;
    }

    export class AssetOnlineOfflineLog {
        id: string;
        userOnline: UserDto.Create = new UserDto.Create();
        dataOnline: string;
        userOffline: UserDto.Create = new UserDto.Create();
        dateOffline: string;

    }

    export class AssetOpenWorkOrderLog {
        id: string;
        description: string;

    }

    export class AssetWorkOrderDateLog {
        id: string;
        description: string;
        completionDate: string;
    }

    export class GetAllByFilterAndPagination {
        id: string;
        name: string;
        code: string;
        parentCategoryTitle: string;
        parentCategoryId: string;
        subCategoryTitle: string;
        subCategoryId: string;
        assetTemplate = new AssetTemplate();
        assetTemplateId: string;
        status: string;
        categoryType: CategoryType;

    }

    export class Warranty {
        id: string;
        companyName: string;
        time: string;
        expiry: string;
        timeType: TimeType;
        description: string;
    }

    export class AssetTemplate {
        id: string;
        name: string;
    }

    export class AssignedAssetDto {
        name: string;
        code: string;
        status: AssetStatus;
        assetTemplateId: string;
        categoryType: CategoryType;
    }

    export enum AssetStatus {
        ACTIVE = 'ACTIVE' as any,
        INACTIVE = 'INACTIVE' as any,
        NULL = 'NULL' as any,
    }
}
