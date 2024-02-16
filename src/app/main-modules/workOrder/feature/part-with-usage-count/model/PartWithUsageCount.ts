export class PartWithUsageCount {
    id: string;
    planedQuantity: number;
    actualQuantity: number;
    usedNumber: number;
    partId: string;
    partName: string;
    partCode: string;
    referenceId: string;
    forSchedule: boolean;

    constructor(refId: string) {
        this.referenceId = refId;
    }
}
