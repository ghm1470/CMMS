export namespace ReportUserDto {

    export class TotalWorkedTimeOfPersonnel {
        userId: string;
        from: any;
        until: any;
    }

    export class GetPageAssetReport {
        repairDate: any;
        pureRepairDate: any;
        duration: number;
        assetId: string;
        assetName: string;
        workOrderId: string;
    }

    export class TotalWorkedTimeDTO {
        totalWorkedTime: number;
    }

}
