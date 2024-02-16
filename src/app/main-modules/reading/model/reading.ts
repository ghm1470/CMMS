import {UnitOfMeasurement} from '../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {AssetDto} from '../../asset/model/dto/assetDto';
import {UserDto} from '../../user/model/dto/user-dto';
import {WorkOrderDto} from "../../workOrder/model/dto/workOrderDto";

export namespace Reading {
    import Asset = WorkOrderDto.Asset;

    export class Create {
        id: string;
        referenceId: string;
        unitOfMeasurement = new UnitOfMeasurement();
        creationDate: Date;
        amount: number;
        userId: string;
        description: string;
        partId: string;
    }

    export class GetAll {
        // id: string;
        // asset = new AssetDto.CreateAsset();
        // unitOfMeasurement = new UnitOfMeasurement();
        // creationDate: Date;
        // userId: string;
        // userName: string;
        // amount: number;
        // description: string;
        // partId: string;
        // deleted = false;

        ////////////////
        amount: number;
        assetId: string;
        assetName: string;
        creationDate: string;
        meteringId: string;
        unitOfMeasurementId: string;
        unitOfMeasurementName: string;
        userId: string;
        userName: string;
    }

    export class GetAllNew {
        id: string;
        creationDate: Date;
        userId: string;
        userName: string;
        amount: number;
        description: string;
        partId: string;
        deleted = false;
        assetId: string;
        assetName: string;
        meteringId: string;
        unitOfMeasurementId: string;
        unitOfMeasurementName: string;
    }

    export class GetOne {
        id: string;
        amount: number;
        description: string;
        creationDate: any;
        partId: string;
        unitOfMeasurement: UnitOfMeasurement;
        asset: Asset;
        userId: string;
        userName: string;
    }
}
