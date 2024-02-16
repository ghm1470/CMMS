export namespace InventoryDTO {

    export class GetAll {
        inventoryLocationName: string;//نام انبار قطعه
        inventoryId: string;
        row: string;
        corridor: string;
        warehouse: string;
        currentQuantity: number;
        minQuantity: number;
        inventoryCode: string;
        orderAmount: string = null;//مقدار سفارش
        location: string; //موقعیت در انبار
        previousQuantity: number;
        receiptNumber: string; //شماره رسید


    }

    export class GetOne {
        currentQuantity: number = 0;
        previousQuantity: number;
        minQuantity: number;
        partName: string;
        partCode: string;
        chargeDepartmentId: string;
        budgetId: string;
        corridor: string;
        orderAmount: string = null;//مقدار سفارش
        location: string; //موقعیت در انبار
        id: string;
        row: string;
        warehouse: string;
        price: string;
        inventoryCode: string;
        inventoryLocationId: string;
        inventoryLocationName: string;
        chargeDepartmentName: string;
        budgetName: string;
        // =====================بالایی مشترک بین create و get  ولی پایین زمان creat بهدردمان میخورد============
        userId: string;
        partId: string;
        inventoryId: string;
        receiptNumber: string; //شماره رسید

    }

    export class CheckLocation {
        corridor: string;
        row: string;
        partId: string;
        location: string;
        receiptNumber: string;
        orderAmount: string;
        warehouse: string;
        inventoryLocationId: string;
    }

    // export class AdjustmentInventory {
    //    id: string;
    //    inventoryId: string;
    //    currentQuantity: number;
    //    previousQuantity: number;
    //    minQuantity: number;
    //    partId: string;
    //    partName: string;
    //    partCode: string;
    //    chargeDepartmentId: string;
    //    budgetId: string;
    //    corridor: string;
    //    row: string;
    //    warehouse: string;
    //    price: string;
    //    inventoryCode: string;
    //    userId: string;
    //  creationDate: Date;
    //    inventoryLocationId: string;
    //    sameDocumentsDeleted: boolean;
    // }
}



