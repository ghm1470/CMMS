import {WorkOrderDto} from '../../workOrder/model/dto/workOrderDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {UserType} from '../../formBuilder/fb-model/enumeration/enum/UserType';

export namespace WorkRequestDto {
    export class SubmitWorkRequest {
        // requesterFullName: string;
        // requesterPhoneNumber: string;
        // requesterEmail: string;
        // workOrderCode: string;
        // workOrderStatus: string;
        // description: string;
        // assetId: string;
        // suggestedTime: number;

        id: string;
        userId: string;
        assetId: string;
        activityId: string;
        description: string;
        suggestionTime: string;
        priority: Priority;
        maintenanceType: MaintenanceType;

    }

    export class GetWorkRequest {
        id: string;
        userId: string;
        username: string;
        assetId: string;
        activityId: string;
        activityName: string;
        assetName: string;
        description: string;
        workRequestTitle: string;
        number: number; // عددی /// شماره برگه pm
        emSheetCode: string; // شماره برگه pm
        hasAssessment: boolean;
        priority: Priority;
        maintenanceType: MaintenanceType;
        workRequestTime: Date;
        nextLevelSeenDate: Date; // زمان مشاهده مرحله بعد
        workRequestStatus: string; // inProcess, finished, rejected
        rejectionReason: string;// متن علت رد
    }

    export class GetAllByFilter {
        name: string;
        assetId: string;
    }

    export class ShowForm {
        name: string;
        family: string;
        userTypeId: string;
        userTypeName: string;
        userId: string;
        workRequestDate: Date;
        workRequestId: string;
    }

    export class GetWorkRequestTechnician {
        userId: string;
        userName: string;
        userFamily: string;
        workOrderId: string;
        point: number;
    }

    export class SaveAssessment {
        commenter: string;
        userId: string;
        point: number;
        workRequestId: string;
    }

}
