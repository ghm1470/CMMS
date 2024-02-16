import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {AssetDto} from '../../../asset/model/dto/assetDto';

export namespace ScheduleMaintenanceDto {
    import MaintenanceType = WorkOrderDto.MaintenanceType;
    import Priority = WorkOrderDto.Priority;
    import DocumentFile = CompanyDto.DocumentFile;

    export class Create {
        title: string;
        code: string;
        id: string;
        statusId: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        assetId: string;
        assetName: string;
        Code: string;
        projectId: string;
        image: DocumentFile;
        active: boolean;
        // assetTitle: string;
        projectName: string;
        statusName: string;
        activityId: string;
        activityTitle: string;
    }

    export class ScheduleMaintenanceBasicInformation {
        issueSummary: string;
        laborHour: number;
        actualLaborHour: number;
        workInstruction: string;
        completionDate: any;
    }

    export class ScheduleMaintenanceCompletionDetail {
        note: string;
        problem: string;
        rootCause: string;
        solution: string;
        adminNote: string;
    }

    export class GetAllByFilterAndPagination {
        id: string;
        title: string;
        code: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        assetId: string;
        workOrderStatusId: string;
        projectId: string;
        dueDate: any;
        expirationStatus: ExpirationStatus;
        active: boolean
    }

    export class GetAllByFilterAndPaginationForProject {
        asset: AssetDto.CreateAsset = new AssetDto.CreateAsset();
        id: string;
        maintenanceType: MaintenanceType;
        projectId: string;
        workOrderStatus: WorkOrderDto.Status = new WorkOrderDto.Status();
        priority: Priority;
    }

    export class GetAllByFilterAndPagination2 {
        code: string;
        title: string;
        id: string;
        active;
        maintenanceType: MaintenanceType;
        priority: Priority;
        asset = new Asset();
        workOrderStatus = new WorkOrderStatus();
        project = new Project();
        dueDate: Date;
        scheduledMeteringCycle: ScheduleMaintenanceDto.ScheduledMeteringCycleDTO;
    }

    export class Asset {
        id: string;
        name: string;
    }

    export class WorkOrderStatus {
        id: string;
        name: string;
    }

    export class Project {
        id: string;
        name: string;
    }

    export class ScheduleWithTimeAndMetering {
        scheduleType: ScheduleType;
        scheduledTime: ScheduledTime = new ScheduledTime();
        meteringCycle: ScheduledMeteringCycle = new ScheduledMeteringCycle();
    }

    export class ScheduleWithTimeAndMeteringDTO {
        scheduleType: ScheduleType;
        scheduledTime: ScheduledTime = new ScheduledTime();
        meteringCycle: ScheduledMeteringCycleDTO = new ScheduledMeteringCycleDTO();
    }

    export enum ScheduleType {
        TIME = <any>'زمان',
        METER = <any>'کارکرد'
    }

    export class ScheduledTime {
        id: string;
        per: number;
        endOn: any;
        startOn: any;
        cycle: TimeType;
        fixType: FixType;
        lastModify: Date;

    }

    export class ScheduledMeteringCycle {
        createWo: boolean;
        endDistance: number;
        startDistance: number;
        per: number;
        cycle: TimeType;
        fixType: FixType;
        unitOfMeasurementId: string;
        unitOfMeasurementName: string;
        registrationDate: Date;
    }

    export class ScheduledMeteringCycleDTO {
        createWo: boolean;
        withoutExpireDate: boolean;
        endDistance: number;
        startDistance: number;
        per: number;
        cycle: TimeType;
        fixType: FixType;
        unitOfMeasurementId: string;
        unitOfMeasurementName: string;
        registrationDate: Date;
    }

    export class NextLaunchDate {
        createDate: Date[] = [];
    }

    export class NextLaunchMetering {
        longList: number[] = [];
    }

    export enum TimeType {
        DAILY = <any>'روز',
        WEEKLY = <any>'هفتگی',
        MONTHLY = <any>'ماهانه',
        YEARLY = <any>'سالانه',
    }

    export enum TimeTypeView {
        DAILY = <any>'روز',
        WEEKLY = <any>'هفته',
        MONTHLY = <any>'ماه',
        YEARLY = <any>'سال',
    }

    export enum FixType {
        FIXED = <any>'ثابت',
        FLOATING = <any>'شناور',
    }

    export enum ExpirationStatus {
        EXPIRED = <any>'منقضی شده',
        INPROCESS = <any>'در حال اجرا',
    }
}
