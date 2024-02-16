export namespace ReportAssetDto {

    export class UsedPartOfWorkOrderGetPageDto {
        partId: string;
        from: any;
        until: any;
    }

    export class GetPageUserReport {
        assetId: string;
        workOrderId: string;
        assetName: string;
        usedTime: any;
        usedNumber: string;
    }

    export class CountUsedPartDTO {
        totalNumber: number;
    }

}
