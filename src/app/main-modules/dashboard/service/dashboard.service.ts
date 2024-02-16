import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {query} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = '';
    this.prefixMatches = this.getMatches(this._prefix);
  }


  managerDashboardPendingWorkOrdersForBar() {
    const suffixPath = 'work-order/manager-dashboard-pending-work-orders-for-bar';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  managerDashboardUnscheduledWorkOrdersForBar() {
    const suffixPath = 'work-order/manager-dashboard-unscheduled-work-orders-for-bar';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  managerDashboardLateWorkOrdersForBar() {
    const suffixPath = 'work-order/manager-dashboard-late-work-orders-for-bar';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardCurrentWeekWorkOrdersForBar() {
    const suffixPath = 'work-order/manager-dashboard-current-week-work-orders-for-bar';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  managerDashboardCurrentPlannedWorkOrdersForBar() {
    const suffixPath = 'work-order/manager-dashboard-current-week-planned-work-orders-for-bar';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }


  // countRealHighestPriorityWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-highest-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealHighestPriorityWorkOrdersBySpecifiedMonth( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-highest-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealHighPriorityWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-high-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealHighPriorityWorkOrdersBySpecifiedMonth( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-high-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealAveragePriorityWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-average-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealAverageWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-average-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealLowPriorityWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-low-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealLowPriorityWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-low-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealVeryLowPriorityWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-very-low-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealVeryLowPriorityWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-very-low-priority-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  //
  // countRealOpenWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-open-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealOpenWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-open-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealClosedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-closed-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealClosedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-closed-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  // countRealPendingWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-pending-work-order';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealPendingWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-pending-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealDraftWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-draft-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealDraftWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-draft-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealHighestPriorityNotPlannedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-highest-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealHighestPriorityPlannedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-highest-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  // countRealHighPriorityNotPlannedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-high-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealHighPriorityNotPlannedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-high-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  // countRealAveragePriorityNotPlannedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-average-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealAveragePriorityNotPlannedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-average-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealLowPriorityNotPlannedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-low-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealLowPriorityNotPlannedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-low-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countRealVeryLowPriorityNotPlannedWorkOrders(query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/count-real-very-low-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getRealVeryLowPriorityNotPlannedWorkOrders( query: { userAssignedId , month }) {
  //   const suffixPath = 'work-order/get-real-very-low-priority-not-planned-work-orders';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  //
  // countUserOnlineAsset(query: { userAssignedId}) {
  //   const suffixPath = 'asset/count-real-online-asset';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getUserOnlineAsset( query: { userAssignedId}) {
  //   const suffixPath = 'asset/get-real-online-asset';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  //
  // countUserOfflineAsset(query: { userAssignedId}) {
  //   const suffixPath = 'asset/count-real-offline-asset';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }
  // getUserOfflineAsset( query: { userAssignedId}) {
  //   const suffixPath = 'asset/get-real-offline-asset';
  //   return super.getService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //     urlQueryObject: query
  //   });
  // }


  managerDashboardGetHighestPriorityWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-highest-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountHighestPriorityWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-highest-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }



  managerDashboardGetHighPriorityWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-high-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountHighPriorityWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-high-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetAveragePriorityWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-average-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountAveragePriorityWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-average-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetLowPriorityWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-low-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountLowPriorityWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-low-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetLowestPriorityWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-lowest-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountLowestPriorityWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-lowest-priority-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetOpenWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-open-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountOpenWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-open-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetClosedWorkOrder( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-closed-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountClosedWorkOrder(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-closed-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetPendingWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-pending-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountPendingWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-pending-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetDraftWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-draft-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountDraftWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-draft-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetOverDueWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-over-due-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountOverDueWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-over-due-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetHighestPriorityPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-highest-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountHighestPriorityPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-highest-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetHighPriorityPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-high-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountHighPriorityPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-high-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetAveragePriorityPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-average-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountAveragePriorityPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-average-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetLowPriorityPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-low-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountLowPriorityPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-low-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetLowestPriorityPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-lowest-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountLowestPriorityPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-lowest-priority-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetOpenPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-open-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountOpenPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-open-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetClosedPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-closed-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountClosedPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-open-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  managerDashboardGetPendingPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-pending-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountPendingPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-pending-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetDraftPlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-draft-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountDraftPlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-draft-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  managerDashboardGetOverDuePlannedWorkOrders( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-get-over-due-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  managerDashboardCountOverDuePlannedWorkOrders(query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-count-over-due-planned-work-orders';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getGeneralOnlineAssets() {
    const suffixPath = 'asset/get-general-online-assets';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  countGeneralOnlineAssets() {
    const suffixPath = 'asset/count-general-online-assets';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  getGeneralOfflineAssets() {
    const suffixPath = 'asset/get-general-offline-assets';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  countGeneralOfflineAssets() {
    const suffixPath = 'asset/count-general-offline-assets';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }


  managerDashboardPlannedWorkOrdersRatio( query: {month }) {
    const suffixPath = 'work-order/manager-dashboard-planned-work-orders-ratio';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getUserDashboardAccess(query?: {userId}) {
    const suffixPath = 'dashboard-access/get-user-dashboard-access';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  createUserDashboardAccess(item) {
    const suffixPath = 'dashboard-access/create-user-dashboard-access';
    return super.postService(item ,{
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }




}
