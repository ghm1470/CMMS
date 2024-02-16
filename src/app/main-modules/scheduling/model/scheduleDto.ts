export namespace ScheduleDto {

    export class Create {
        assetList: AssetLight[];
        startDate: any;
        endDate: any;
        activityTypeId: string; // نوع فعالیت
        workCategoryId: string; // رسته کاری
        importanceDegreeId: string; // درجه اهمیت
        estimateCompletionDate: number; // تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        activityTime: number; // مدت زمان فعالیت
        solution: string;                          // شرح فعالیت
        userIdList: string[];                  // تعمیرکار
        usedPartList: UsedPart[];              // قطعات مصرفی
        frequency: Frequency; // تناوب
        per: number; // هر
        assetStatus: AssetStatus; // وضعیت تجهیز
        runStatus: RunStatus; // وضعیت اجرا
        mode: Mode;

    }

    export class Update {
        id: string;
        assetId: string;//دستگاه
        mainSubSystemId: string;//قطعه ی اصلی
        minorSubSystem: string; //قطعه جزئی
        activityId: string; //  نام فرآیند
        startDate: any;
        endDate: any;
        activityTypeId: string; // نوع فعالیت
        workCategoryId: string; // رسته کاری
        importanceDegreeId: string; // درجه اهمیت
        estimateCompletionDate: number; // تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        activityTime: number; // مدت زمان فعالیت
        solution: string;                          // شرح فعالیت
        userIdList: string[];                  // تعمیرکار
        usedPartList: UsedPart[];              // قطعات مصرفی
        frequency: Frequency; // تناوب
        per: number; // هر
        assetStatus: AssetStatus; // وضعیت تجهیز
        runStatus: RunStatus; // وضعیت اجرا
        mode: Mode;
        nexDate: any;

    }

    export class GetPageSearchDto {
        assetId: string; // دستگاه
        mainSubSystemId: string; //قطعه ی اصلی
        minorSubSystem: string; // قطعه جزئی
        activityTypeId: string;
        workCategoryId: string;
        importanceDegreeId: string;
        assetStatus: AssetStatus;
        runStatus: RunStatus;


    }

    export class GetPage {

        id: string;
        mainSubSystemId: string;
        mainSubSystemName: string;
        minorSubSystem: string;
        workCategoryName: string;
        assetName: string;
        assetId: string;
        startDate: any;
        endDate: any;
        activityTypeId: string; // نوع فعالیت
        activityTypeName: string;
        workCategoryId: string; // رسته کاری
        importanceDegreeId: string; // درجه اهمیت
        importanceDegreeName: string;

        estimateCompletionDate: number; // تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        activityTime: number; // مدت زمان فعالیت
        solution: string;                          // شرح فعالیت
        userIdList: string[];                  // تعمیرکار
        usedPartList: UsedPart[];              // قطعات مصرفی
        frequency: Frequency; //
        per: number; // هر
        assetStatus: AssetStatus; // وضعیت تجهیز
        runStatus: RunStatus; // وضعیت اجرا
        mode: Mode;

    }

    export class GetOne {

        id: string;
        mainSubSystemId: string; // آیدی قطعه اصلی
        mainSubSystemName: string;// عنوان قطعه اصلی
        minorSubSystem: string;// عنوان قطعه جزئی
        workCategoryName: string;
        assetName: string;
        assetId: string;
        startDate: any;
        endDate: any;
        activityTypeId: string; // نوع فعالیت
        activityTypeName: string;
        workCategoryId: string; // رسته کاری
        importanceDegreeId: string; // درجه اهمیت
        importanceDegreeName: string;

        estimateCompletionDate: number; // تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        activityTime: number; // مدت زمان فعالیت
        solution: string;                          // شرح فعالیت
        userIdList: string[];                  // تعمیرکار
        usedPartList: UsedPart[];              // قطعات مصرفی
        frequency: Frequency; // تناوب
        per: number; // هر
        assetStatus: AssetStatus; // وضعیت تجهیز
        runStatus: RunStatus; // وضعیت اجرا
        mode: Mode;
        activityId: string;  /// فرایند ایدی
        activityTitle: string; /// فرایند عنوان

        //
        // startDate: any;
        // endDate: any;
        // assetId: string;
        // assetName: string;
        // mainSubSystemId: string;
        // mainSubSystemName: string;
        // activityTypeId: string;
        // activityTypeName: string;
        // workCategoryId: string;
        // workCategoryName: string;
        // importanceDegreeId: string;
        // importanceDegreeName: string;
        // estimateCompletionDate: number;//تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        // activityTime: number;//مدت زمان فعالیت
        // solution: string;                          //شرح فعالیت
        // userIdList: string[];                  //تعمیرکار
        // usedPartList: UsedPart[];              //قطعات مصرفی
        // frequency: Frequency;//
        // per: number;//هر
        // mode: Mode;
        // assetStatus: AssetStatus;
        // runStatus: RunStatus;
    }

    export class AssetLight {
        assetId: string; // دستگاه
        activityId: string; // فرآیند
        mainSubSystemId: string; // قطعه ی اصلی
        minorSubSystem: string; // قطعه جزئی
    }

    export class UsedPart {
        partId: string;
        partName: string;
        partCode: string;
        usedNumber: number;
    }


    export enum Frequency {
        DAILY = 'DAILY' as any,
        WEEKLY = 'WEEKLY' as any,
        MONTHLY = 'MONTHLY' as any,
        YEARLY = 'YEARLY' as any,
    }

    export enum Mode {
        FLOAT = 'FLOAT' as any, // جاری
        FIXED = 'FIXED' as any, // ثابت
    }

    export enum AssetStatus {
        STOP = 'STOP' as any, // متوقف
        RUN = 'RUN' as any, // درحال کار
    }


    export enum RunStatus {
        ACTIVE = 'ACTIVE' as any, // فعال
        DE_ACTIVE = 'DE_ACTIVE' as any, // غیر فعال
    }
}
