    export namespace MtbfDTO {
    export class MtbfCalculationDto {
        assetId: string;
        from: any;
        until: any;
        range: string;
    }

    export class MtbfCalculationResDto {
        workTimeDuration: number;
        count: number;
        failureDuration: number;
        startDate: any;
    }

    export enum Range {
        daily = 'daily' as any, // روزانه
        // weekly = 'weekly' as any, //هفتگی
        monthly = 'monthly' as any, //ماهانه
        yearly = 'yearly' as any //سالانه
    }


}
