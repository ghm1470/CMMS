    export namespace MdtDTO {
    export class MdtCalculationDto {
        assetId: string;
        from: any;
        until: any;
        range: string;
    }

    export class MdtCalculationResDto {
        failureDate: any;
        mdt: number;
        failureDuration: number;
        count: number;
    }
    // private String date;
    // private Date failureDate;
    // private long mdt;
    // private long count;
    // private long failureDuration;


    export enum Range {
        daily = 'daily' as any, // روزانه
        // weekly = 'weekly' as any, //هفتگی
        monthly = 'monthly' as any, //ماهانه
        yearly = 'yearly' as any //سالانه
    }


}
