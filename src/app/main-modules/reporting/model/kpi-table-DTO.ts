export namespace KpiTableDTO {
    export class GetDto {
        from: any;
        until: any;
    }

    export class MtbfTableReturn {
        assetId: string;
        assetName: string;
        assetCode: string;
        failureDuration: number; //جمع ساعات توقف
        repairDuration: number;// جمع ساعات تعمیر
        count: number;// تعداد دفعات  خرابی
        mtbf: number;
    }

    export class MttrTableReturn {
        assetId: string;
        mttr: number;
    }

    export class MdtTableReturn {
        assetId: string;
        mdt: number;
    }

    export class TableModel {
        assetId: string;
        assetCode: string;
        assetName: string;
        failureDuration: number; //جمع ساعات توقف
        repairDuration: number;// جمع ساعات تعمیر
        count: number;// تعداد دفعات  خرابی
        mtbf: number = 0;
        mttr: number = 0;
        mdt: number = 0;
        mttf: number;
    }


}
