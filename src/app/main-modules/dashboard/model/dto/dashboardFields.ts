export namespace DashboardField {
  export class DashboardFieldSelecting {
    fieldName: string;
    fieldNameFa: string;
    suffixPath: string;
    service: string;
    needUser: boolean;
    value: string;
    type: Type;
    recipe: string;
    RelatedMonth: number;
    scheduling: boolean;
  }

  export class DashboardFieldEnum {
    fieldName: string;
    id?: string;
    fieldNameFa: string;
    suffixPath: string;
    suffixPathForModalGetService?: string;
    needUser: boolean;
    type: Type;
    value: string;
    valueOfCount: string;
    recipe: string;
    service: string;
    RelatedMonth: number;
    scheduling: boolean;
  }


  // export class SettingDashboardAccess {
  //   countAllWorkOrderByUserId = false;
  //   getAllWorkOrdersBySpecifiedMonth = false;
  //   getAllWorkOrdersBySpecifiedRelatedMonth = 0;
  //   getAllOpenWorkOrdersByUserIdBySpecifiedCurrentMonth = false;
  //   getAllOpenWorkOrdersByUserIdBySpecifiedCurrentRelatedMonth = 0;
  //   getAllOpenWorkOrdersOfUsersByUserId = false;
  //   countHighPriorityWorkOrders = false;
  //   getHighPriorityWorkOrdersBySpecifiedMonth = false;
  //   getHighPriorityWorkOrdersBySpecifiedRelatedMonth = 0;
  //   countClosedWorkOrdersByUserId = false;
  //   getClosedWorkOrdersByUserIdBySpecifiedMonth = false;
  //   getClosedWorkOrdersByUserIdBySpecifiedRelatedMonth = 0;
  //   countOverDueAndCompletedWorkOrders = false;
  //   countOverDueAndCompletedWorkOrdersRelatedMonth = 0;
  //   onTimeCompletedWorkOrders = false;
  //   countOnTimeCompletedWorkOrdersBySpecifiedMonth = false;
  //   countOnTimeCompletedWorkOrdersBySpecifiedRelatedMonth = 0;
  //   overDueAndNotCompletedWorkOrders = false;
  //   countOverDueAndNotCompletedWorkOrdersBySpecifiedTime = false;
  //   countOverDueAndNotCompletedWorkOrdersBySpecifiedTimeRelatedMonth = 0;
  //   onTimeCompletionRate = false;
  //   onTimeCompletionRateBySpecifiedTime = false;
  //   onTimeCompletionRateBySpecifiedTimeRelatedMonth = 0;
  //   numberOfPendingWorkOrderOfUserInSpecificTime = false;
  //   numberOfPendingWorkOrderOfUserInSpecificTimeRelatedMonth = 0;
  //   countAllOfflineAssets = false;
  //   countAllOnlineAssets = false;
  //   id: string;
  //   userId: string;
  // }

  export class SettingDashboardAccess {
    id: string;
    userId: string;

    // کل دستور کارها   //////countAllWorkOrderByUserId
    allWorkOrder = false;
    allWorkOrderNumber = 0;

    // 'کل دستور کارها در بازه زمانی'   ////  getAllWorkOrdersBySpecifiedMonth
    allWorkOrderMonth = false;
    allWorkOrderMonthNumber = 0;

    // تعداد دستور کارهای باز   /////  getAllOpenWorkOrdersOfUsersByUserId
    open = false;
    openNumber = 0;

    // دستور کارهای باز در بازه زمانی    ///// getAllOpenWorkOrdersByUserIdBySpecifiedCurrentMonth
    openMonth = false;
    openMonthNumber = 0;

    // دستور کار با اولویت بالا   ////countHighPriorityWorkOrder
    highPriority = false;
    highPriorityNumber = 0;

    // دستور کار با اولویت بالاترین   ////countRealHighestPriorityWorkOrders
    highestPriority = false;
    highestPriorityNumber = 0;


    // getHighPriorityWorkOrdersBySpecifiedMonth دستور کار با اولویت بالا در بازه زمانی   ///////
    highPriorityMonth = false;
    highPriorityMonthNumber = 0;

    // دستور کارهای بسته شده ////// countClosedWorkOrdersByUserId
    closed = false;
    closedNumber = 0;


    // دستور کارهای بسته شده دستور کارهای بسته شده (ناقص) در بازه زمانی    ///  getClosedNotCompletedWorkOrdersByUserIdBySpecifiedMonth
    closeNotCompletedMonth = false;
    closeNotCompletedMonthNumber = 0;

    // دستور کارهای بسته شده(تکمیلی)   /////getClosedWorkOrdersByUserIdBySpecifiedMonth
    closedMonth = false;
    closedMonthNumber = 0;


    // دستور کارهای تکمیل شده در موعد مقرر از تعداد کل بسته شده //////onTimeCompletedWorkOrders
    onTimeCompleted = false;
    onTimeCompletedNumber = 0;


    // countOnTimeCompletedWorkOrdersBySpecifiedMonth دستور کارهای تکمیل شده در موعد مقرر از تعداد دستور کارهای بسته ///////
    onTimeCompletedMonth = false;
    onTimeCompletedMonthNumber = 0;

    //  دستور کارهای بسته و معوق از تعداد کل دستور کارهای بسته  ////   countOverDueAndCompletedWorkOrders
    overDueAndCompletedMonth = false;
    overDueAndCompletedMonthNumber = 0;

    // overDueAndNotCompletedWorkOrders  دستور کارهای باز از تعداد دستور کارهای باز معوق ///////
    overDueNotCompleted = false;
    overDueNotCompletedNumber = 0;

    // countOverDueAndNotCompletedWorkOrdersBySpecifiedTime //////  دستور کارهای باز از تعداد دستور کارهای باز معوق
    overDueAndNotCompletedMonth = false;
    overDueAndNotCompletedMonthNumber = 0;

    // درصد انجام به موقع کارها  ////// onTimeCompletionRate
    onTimeCompletionRate = false;
    onTimeCompletionRateNumber = 0;

    // درصد انجام به موقع کارها در بازه زمانی  //////  onTimeCompletionRateBySpecifiedTime
    onTimeCompletionRateMonth = false;
    onTimeCompletionRateMonthNumber = 0;

    // numberOfPendingWorkOrderOfUserInSpecificTime دستور کارهای معلق ///
    pendingMonth = false;
    pendingMonthNumber = 0;



   // countAllOfflineAssets دارایی های آفلاین   /////
    offlineAssets = false;
    offlineAssetsNumber = 0;

    // دارایی های آنلاین //////  countAllOnlineAssets
    onlineAssets = false;
    onlineAssetsNumber = 0;

    lowStockItems = false;
    lowStockItemsNumber = 0;
  }

  //
  // export class SettingDashboardAccess {
  //   id: string;
  //   userId: string;
  //   countAllWorkOrderByUserId = false;
  //   getAllWorkOrdersBySpecifiedMonth = false;
  //   getAllWorkOrdersBySpecifiedRelatedMonth = false;
  //   getAllOpenWorkOrdersByUserIdBySpecifiedCurrentMonth = false;
  //   getAllOpenWorkOrdersByUserIdBySpecifiedCurrentRelatedMonth = 0;
  //   getAllOpenWorkOrdersOfUsersByUserId = true;
  //   countHighPriorityWorkOrders = false;
  //   getHighPriorityWorkOrdersBySpecifiedMonth = false;
  //   getHighPriorityWorkOrdersBySpecifiedRelatedMonth = 0;
  //   countClosedWorkOrdersByUserId = true;
  //   getClosedWorkOrdersByUserIdBySpecifiedMonth = false;
  //   countOverDueAndCompletedWorkOrders = false;
  //   getClosedWorkOrdersByUserIdBySpecifiedRelatedMonth = 0;
  //   countOverDueAndCompletedWorkOrdersRelatedMonth = 0;
  //   onTimeCompletedWorkOrders = true;
  //   countOnTimeCompletedWorkOrdersBySpecifiedMonth = false;
  //   countOnTimeCompletedWorkOrdersBySpecifiedRelatedMonth = 0;
  //   overDueAndNotCompletedWorkOrders = false;
  //   countOverDueAndNotCompletedWorkOrdersBySpecifiedTime = false;
  //   countOverDueAndNotCompletedWorkOrdersBySpecifiedTimeRelatedMonth = 0;
  //   onTimeCompletionRate = false;
  //   onTimeCompletionRateBySpecifiedTime = false;
  //   onTimeCompletionRateBySpecifiedTimeRelatedMonth = 0;
  //   numberOfPendingWorkOrderOfUserInSpecificTime = 0;
  //   numberOfPendingWorkOrderOfUserInSpecificTimeRelatedMonth = 0;
  //   countAllOnlineAssets = false;
  //   countAllOfflineAssets = false;
  // }


  export enum Type {
    COUNT = 'COUNT' as any,
    COUNTOFCOUNT = 'COUNTOFCOUNT' as any,
    RATE = 'RATE' as any,
  }


}

// export enum Fields {
//   countWorkOrderOpen = 'دستور کار های باز',
//   countWorkOrderPriority = 'دستور کار با اولویت بالا',
//   countWorkOrderClosedCompleted = 'دستور کارهای بسته شده(کامل)',
//   countWorkOrderClosedNotCompleted = 'دستور کارهای بسته (ناقص)',
//   countWorkOverDueCompleted = ' دستور کارهای تاخیر افتاده (تمام شده)',
//   countWorkOverDueNotCompleted = ' دستور کارهای تاخیر افتاده (تمام نشده)',
//   OnTimeCompletionRate = 'نرخ دستور کارهای تمام شده در زمان معین',
// }




