import {CompanyDto} from '../../../company/model/dto/companyDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {PartDto} from '../../../part/model/dto/part';
import {TaskGroupDto} from '../../../taskGroup/model/dto/taskGroupDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';

export namespace WorkOrderDto {
    import DocumentFile = CompanyDto.DocumentFile;
    import Task = TaskGroupDto.Task;

    export class Create {
        id: string;
        title: string;
        code: string;
        requiredCompletionDate: any;
        image: DocumentFile;
        assetId: string;
        assetName: string;
        assetCode: string;
        projectId: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        statusId: string;
        startDate: any;
        endDate: any;
        creationDate: any;
        fromSchedule = false;
    }

    export class NewGetOneٔWorkOrderDTO {
        id: string;
        workRequestId: string;
        title: string;                                                    // شرح درخواست خرابی
        partSupply: number;                                                    // زمان تامین قطعه
        startDate: any;                                                  // تاریخ وقوع خرابی
        repairDate: any;                                 //  تاریخ شروع تعمیر
        endDate: any;                                                    // تاریخ راه اندازی
        requestedDate: any;                                              // تاریخ تحویل به تعمیرات
        requestDescription: string;                                       // شرح درخواست
        failureReason: string;                                            // علت خرابی
        solution: string;                                                 // شرح اقدامات انجام شده
        userIdList: string[];                                      // ایدی تعمیرکار
        UserWithUserTypeNameDTO: UserWithUserTypeNameDTO[];           // تعمیرکار
        assetId: string;                                                  // ایدی دستگاه
        assetName: string;                                                // نام دستگاه
        pmSheetCode: string;                                                // شماره برگه pm
        number: number; // عددی /// شماره برگه pm
        getOneUsedPartList: GetOneUsedPart[] = [];                        // قطعات استفاده شده
    }


    export class GetOneUsedPart {
        partId: string;
        partName: string;
        partCode: string;
        usedNumber: number;
    }

    export class UserWithUserTypeNameDTO {
        id: string;
        name: string;
        family: string;
        userTypeId: string;
        userTypeName: string;
    }

    export class GetOne {
        id: string;
        title: string;
        code: string;
        requiredCompletionDate: any;
        image: DocumentFile;
        assetId: string;
        assetName: string;
        assetCode: string;
        projectId: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        statusId: string;
        startDate: any;
        endDate: any;
        creationDate: any;
    }

    export class WorkOrderBasicInformation {
        issueSummary: string;
        completedUserId: string;
        completedUserUserTypeId: string;
        completedUserOrgId: string;
        laborHour: number;
        userAssignedId: string;
        userAssignedName: string;
        userAssignedFamily: string;
        userAssignedUserTypeId: string;
        userAssignedUserTypeName: string;
        userAssignedOrgId: string;
        userAssignedOrgName: string;
        actualLaborHour: number;
        workInstruction: string;
    }

    export class WorkOrderBasicInformationDTO {
        issueSummary: string;
        completedUserId: string;
        laborHour: number;
        userAssignedId: string;
        actualLaborHour: number;
        workInstruction: string;
        CompletionDate: Date;
    }

    export class CompletionDetail {
        budgetId: string;
        chargeDepartmentId: string;
        note: string;
        problem: string;
        rootCause: string;
        solution: string;
        adminNote: string;
    }

    export class CompletionDetailDtO {
        budgetId: string;
        budgetTitle: string;
        chargeDepartmentId: string;
        chargeDepartmentTitle: string;
        note: string;
        problem: string;
        rootCause: string;
        solution: string;
        adminNote: string;
    }

    export enum MaintenanceType {
        PREVENTIVE = 'پیشگیرانه' as any,
        DAMAGE = 'آسیب' as any,
        CORRECTIVE = 'اصلاحی' as any,
        SAFETY = 'ایمنی' as any,
        UPGRADE = 'ارتقاء' as any,
        ELECTRICAL = 'الکتریکی' as any,
        PROJECT = 'پروژه' as any,
        INSPECTION = 'بازرسی' as any,
        METERREADING = 'خواندن کارکرد' as any,
        OTHER = 'سایر' as any,
    }


    export enum Priority {
        HIGHEST = 'خیلی زیاد' as any,
        HIGH = 'زیاد' as any,
        MEDIUM = 'متوسط' as any,
        LOW = 'کم' as any,
        LOWEST = 'خیلی کم' as any,
    }

    export enum Scheduling {
        TRUE = 'رنامه ریزی شده' as any,
        FALSE = 'برنامه ریزی نشده' as any,
    }

    export class GetAllByFilterAndPagination {
        id: string;
        title: string;
        code: string;
        maintenanceType: any; // enum (i change it to being comfortable in show persian value in list)
        priority: any; // enum (i change it to being comfortable in show persian value in list)
        projectId: string;
        projectName: string;
        assetId: string;
        pmSheetCode: string = null; // شماره برگه pm
        number: string = null; // شماره برگه em
        statusId: string;
        statusName: string;
        assetName: string;
        statusTitle: string;
        fromSchedule: boolean;
        endDate: any;
        startDate: any;
        failureDateFrom: any;
        failureDateUntil: any;
    }

    export class GetAllByFilterAndPaginationTow {
        asset: AssetDto.CreateAsset = new AssetDto.CreateAsset();
        code: string;
        id: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        project: Project = new Project();
        status: Status = new Status();
        title: string;
    }

    export class SearchBoxSelected {
        id: string;
        title = false;
        code = false;
        statusId = false;
        assetId = false;
        projectId = false;
        priority = false;
        maintenanceType = false;
        fromSchedule = false;
        startDate = false;
        endDate = false;
    }

    export class GetAllByFilterAndPaginationTree {
        asset: AssetDto.CreateAsset = new AssetDto.CreateAsset();
        pmSheetCode: string; // شماره برگه pm
        number: string; // شماره برگه em
        code: string;
        id: string;
        maintenanceType: MaintenanceType;
        priority: Priority;
        project: Project = new Project();
        status: Status = new Status();
        title: string;
        startDate: any;
        endDate: any;
        fromSchedule = false;
    }

    export class Asset {
        id: string;
        name: string;
    }

    export class Status {
        id: string;
        name: string;
    }

    export class Project {
        id: string;
        name: string;
    }

    export class MiscCost {
        id: string;
        title: string;
        estimatedQuantity: number;
        estimatedUnitCost: number;
        estimatedTotalCost: number;
        quantity: number;
        actualUnitCost: number;
        actualTotalCost: number;
        description: string;
        miscCostType: MiscCostType;
        referenceId: string;

        constructor(refId: string) {
            this.referenceId = refId;
        }
    }

    export enum MiscCostType {
        GENERAL = 'کار های عمومی' as any,
        PRIVATE = 'کار های اختصاصی' as any
    }

    export class UpdateTaskGroupListAndTaskList {
        taskGroupList: TaskGroupDto.Create[] = [];
        taskList: Task[] = [];
    }

    export class FormIdForView {
        workOrder = false;
        completionDetails = false;
        information = false;
        tasks = false;
        taskGroup = false;
        workOrderPart = false;
        miscCost = false;
        notification = false;
        reports = false;
        file = false;
    }

    export class NewSaveDTO {
        id: string;
        title: string;                                       //  شرح درخواست خرابی
        partSupply: number;                                 // زمان تامین قطعه
        startDate: any;                                    //  تاریخ وقوع خرابی
        endDate: any;                                     //  تاریخ راه اندازی
        repairDate: any;                                 //  تاریخ شروع تعمیر
        requestedDate: any;                             //  تاریخ تحویل به تعمیرات
        requestDescription: string;                    //  شرح درخواست
        failureReason: string;                        //  علت خرابی
        solution: string;                            //  شرح اقدامات انجام شده
        pmSheetCode: string;                        //   شماره برگه pm
        number: number;                            //   em     شماره برگه
        userIdList: string[];                     //  تعمیرکار
        assetId: string;                         //  نام دستگاه
        usedPartList: UsedPart[];               // قطعات استفاده شده

    }

    export class UsedPart {
        partId: string;
        usedNumber: number;
    }

}
