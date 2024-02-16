import {ScheduleDto} from '../../scheduling/model/scheduleDto';

export namespace WorkTableSchedule {

    import UsedPart = ScheduleDto.UsedPart;

    export class GetPageDto {
        assetId: string;
        mainSubSystemId: string; // قطعه ی اصلی
        minorSubSystem: string; // قطعه جزئی
        workCategoryId: string; // رسته کاری
        activityTypeId: string; // نوع فعالیت
        importanceDegreeId: string; // درجه اهمیت
        startDate: any; // تاریخ سررسید
        assetStatus: ScheduleDto.AssetStatus; // وضعیت تجهیز
        userId: string; // تخصیص به

    }

    export class GetPage {
        activityInstanceId: string;
        activityLevelId: number;
        workOrderId: string;
        assetId: string;
        assetName: string;  // نام دستگاه
        mainSubSystemId: string; //  قطعه ی اصلی
        mainSubSystemName: string; //  قطعه ی اصلی
        minorSubSystem: string; //  قطعه جزئی
        scheduleUserIdList: ScheduleUserIdList[] = []; //  تخصیص به
        workCategoryId: string; //   رسته کاری
        workCategoryName: string; //   رسته کاری
        activityTypeId: string; //  نوع فعالیت
        activityTypeName: string; //  نوع فعالیت
        importanceDegreeId: string; //  درجه  اهمیت
        importanceDegreeName: string; //  درجه  اهمیت
        solution: string; //  شرح فعالیت
        assetStatus: ScheduleDto.AssetStatus; //  وضعیت تجهیز
        activityTime: number; //  مدت زمان فعالیت
        startDate: any; //  تاریخ  سررسید
        estimateCompletionDate: number; //  هلت زمان انجام
        workRequestAcceptor: boolean; // مشخص میکند که کاربر تایید کننده هست یا نه


    }

    export class ScheduleUserIdList {
        userFamily: string;
        userId: string;
        userName: string;
    }

    export class WorkOrderScheduleDTO {
        activityInstanceId: string;
        activityLevelId: number;
        id: string;
        workRequestId: string;
        assetId: string;  // نام دستگاه
        assetName: string;  // نام دستگاه
        mainSubSystemId: string;  // قطعه ی اصلی
        mainSubSystemName: string;  // قطعه ی اصلی
        minorSubSystem: string;  // قطعه جزئی
        workCategoryId: string;  //  رسته کاری
        workCategoryName: string;  //  رسته کاری
        activityTypeId: string;  // نوع فعالیت
        activityTypeName: string;  // نوع فعالیت
        importanceDegreeId: string;  // درجه  اهمیت
        importanceDegreeName: string;  // درجه  اهمیت
        solution: string;  // شرح فعالیت
        activityTime: number;  // مدت زمان فعالیت
        startDate: any;  // تاریخ  سررسید
        endDate: any;  // تاریخ اقدام
        assetStatus: ScheduleDto.AssetStatus;  // وضعیت تجهیز
        usedPartList: UsedPart[];              // قطعات مصرفی
        userIdList: string[];                  // تعمیرکار
        associatedScheduleMaintenanceId: string;

    }

}
