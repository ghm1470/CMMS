import {CompanyDto} from '../../../company/model/dto/companyDto';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';

import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {WarrantyType} from '../../warranty/model/warranty-type-enum';
import {UserDto} from '../../../user/model/dto/user-dto';
import DocumentFile = CompanyDto.DocumentFile;


export namespace PartDto {
    import Address = CompanyDto.Address;

    export class Create {
        description: string;
        partCode: string;
        id: string;
        partId: string;
        name: string;
        image: DocumentFile;
        partQuantity = 0;
        index?: number;
        selected = false;
        partName;

        subSystem: string; // زیر سیستم
        usedNumber: number = null; // تعداد
// =======================================بقیه ی مدل لازم نیست
//     quantity: string;
//     minQuantity: string;
//     chargeDepartment: ChargeDepartment;
//     budget: Budget;
//     corridor: string;
//     row: string;
//     partModel: string;
//     warehouse: string;
//     price: string;
//     inventoryCode: string;
//     user: UserDto.Create;
//     metering: Metering;
//     company: CompanyDto.Create;
    }


    export class GetAll {
        row: string;
        corridor: string;
        partId: string;
        warehouse: string;
        inventoryLocation: Storage = new Storage();
        currentQuantity: number;
        minQuantity: number;
        inventoryId: string;
        partName: string;
        budget: Budget;
        inventoryCode: string;
        chargeDepartment: ChargeDepartment;
        previousQuantity: number;
        creationDate: Date;
        partCode: string;
        price: string;
        orderAmount: string;//مقدار سفارش
        location: string;//موقعیت در انبار
        user: UserDto.Create;
        // selected = false;

    }

    export class GetOnePart {
        description: string;
        partCode: string;
        image: DocumentFile;
        name: string;
        material: string; // جنس
        partCategory: PartCategory;  // دسته بندی
        id: string;
    }

    export class GetOneInventory {
        id: string;
        currentQuantity: number;
        previousQuantity: number;
        minQuantity: number;
        chargeDepartmentId: string;
        chargeDepartmentName: string;
        budgetId: string;
        budgetName: string;
        corridor: string;
        row: string;
        warehouse: string;
        price: string;
        inventoryCode: string;
        inventoryLocationId: string;
        inventoryLocationName: string;
    }

    export class CreateInventory {
        partName: string;
        partCode: string;
        title: string;
        chargeDepartmentId: string;
        chargeDepartmentName: string;
        budgetId: string;
        budgetName: string;
        corridor: string;
        row: string;
        partId: string;
        warehouse: string;
        price: string;
        inventoryCode: string;
        creationDate: Date;
        // user: UserDto.Create;
        user: any;
        inventoryLocationId: string;
        inventoryLocationName: string;
        // inventoryLocationId: string;
        id: string;
        inventoryId: string;
        previousQuantity: number;
        currentQuantity: number = 0;
        minQuantity: string;
        // minQuantity: number;
        // previousQuantity: number;
        // currentQuantity: number;
        deleted: boolean;
        orderAmount: string = null;//مقدار سفارش
        location: string; //موقعیت در انبار
        receiptNumber: string; //شماره رسید
        //

        // private long currentQuantity;
        // private long minQuantity;
        // private Storage inventoryLocation;    //inventoryLocationId


    }


    export class CheckLocation {
        corridor: string;
        row: string;
        partId: string;
        warehouse: string;
        inventoryLocationId: string;
        inventoryLocation: Storage = new Storage();
    }

    export class InventoryListForALocation {
        creationDate: Date;
        user: UserDto.Create;
        previousQuantity: string;
        currentQuantity: string;
    }

    export class Storage {
        id: string;
        title: string;
        code: string;
        address: Address;
        assetId: string;
        assetName: string;
        hasChild: boolean;
        inventoryList: string[] = [];
    }


    export class Metering {
        referenceId: string;
        creationDate: Date;
        unitOfMeasurement: UnitOfMeasurement;
        id: string;
        amount: number;
        description: string;

    }

    export class Warranty {
        companyId: string;
        companyName: string;
        unitOfMeasurementName: string;
        id: string;
        name: string;
        time: string;
        expiry: any;
        type: WarrantyType;
        unitOfMeasurementId: string;
        kilometerWarranty: string;
        description: string;
        warrantyCode: string;
        partId: string;
        assetId: string;
    }

    export class GetAllWarranty {
        id: string;
        name: string;
        time: string;
        expiry: any;
        warrantyCode: string;
        companyName: string;
        type: WarrantyType;
        kilometerWarranty: string;
        unitOfMeasurementName: string;
    }

    export enum PartCategory {
        Electric = 'برقی' as any,
        Mechanical = 'مکانیکی' as any,
        Blacksmithing = 'آهنگری' as any,
        Facilities = 'تاسیسات' as any,
        Other = 'سایر' as any,

    }
}
