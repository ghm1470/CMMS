    export namespace MttrDTO {
    export class MttrCalculationDto {
        assetId: string;
        from: any;
        until: any;
        range: string;
    }

    export class MttrCalculationResDto {
        repairDate: any;
        mttr: number;
        repairDuration: number;
        count: number;
    }

    export enum Range {
        daily = 'daily' as any, // روزانه
        // weekly = 'weekly' as any, //هفتگی
        monthly = 'monthly' as any, //ماهانه
        yearly = 'yearly' as any //سالانه
    }


}
