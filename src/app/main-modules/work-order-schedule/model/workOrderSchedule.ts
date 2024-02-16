import {ScheduleDto,} from '../../scheduling/model/scheduleDto';

export namespace WorkOrderSchedule {

    import UsedPart = ScheduleDto.UsedPart;
    import AssetStatus = ScheduleDto.AssetStatus;

    export class GetPageDto {
        assetId: string;
        mainSubSystemId: string; // قطعه ی اصلی
        minorSubSystem: string; // قطعه جزئی
        workCategoryId: string; // رسته کاری
        activityTypeId: string; // نوع فعالیت
        importanceDegreeId: string; // درجه اهمیت
        startDate: any; // تاریخ سررسید از تاریخ
        endDate: any; // تاریخ سررسید تا تاریخ
        assetStatus: ScheduleDto.AssetStatus; // وضعیت تجهیز

    }

    export class GetPage {
        id: string;
        activityInstanceId: string;
        activityLevelId: number;
        workOrderId: string;
        assetId: string;
        assetName: string;  // نام دستگاه
        mainSubSystemId: string; //  قطعه ی اصلی
        mainSubSystemName: string; //  قطعه ی اصلی
        minorSubSystem: string; //  قطعه جزئی
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
        endDate: any; //  تاریخ  اقدام
        estimateCompletionDate: number; //  هلت زمان انجام
        workRequestAcceptor: boolean; // مشخص میکند که کاربر تایید کننده هست یا نه


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

    export class Update {
        id: string;
        activityTypeId: string; // نوع فعالیت
        assetStatus: AssetStatus; // وضعیت تجهیز
        workCategoryId: string; // رسته کاری
        importanceDegreeId: string; // درجه اهمیت
        activityTime: number; // مدت زمان فعالیت
        estimateCompletionDate: number; // تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        solution: string;                          // شرح فعالیت
        userIdList: string[];                  // تعمیرکار
        usedPartList: UsedPart[];              // قطعات مصرفی
    }

}
