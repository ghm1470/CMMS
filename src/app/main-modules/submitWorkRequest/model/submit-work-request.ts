import {WorkOrderDto} from '../../workOrder/model/dto/workOrderDto';
import MaintenanceType = WorkOrderDto.MaintenanceType;
import Priority = WorkOrderDto.Priority;


export class SubmitWorkRequest {

    id: string;
    userId: string;
    assetId: string;
    number: number; // عددی /// شماره برگه pm
    emSheetCode: string; // شماره برگه pm
    activityId: string;
    description: string;
    suggestionTime: string;
    priority: Priority;
    maintenanceType: MaintenanceType;
    title: string;
    failureDate: string; // تاریخ وقوع خرابی
    activityInstanceId: string;


}


export class ReceiveWorkRequest {
    id: string;
    assetName: string;
    assetCode: string;
    activityName: string;
    userName: string;
    userFamily: string;
    userType: string[];
    description: string;
    priority: Priority;
    maintenanceType: MaintenanceType;
    title: string;
}

