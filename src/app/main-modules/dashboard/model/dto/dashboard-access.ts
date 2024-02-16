import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;

export class DashboardAccess {
  id: string;
  userId: string;
  creatorId: string;
  dashboardAccessEnumList: ManagerDashboardAccessEnum [];
  dashboardAccessAssociatedMonth: ManagerDashboardAccessAssociatedMonth;
}


export class DashboardAccessAssociatedMonth {
  highestPriorityWorkOrderTime: number = 1;
  highPriorityWorkOrderTime: number = 1;
  averagePriorityWorkOrderTime: number = 1;
  lowPriorityWorkOrderTime: number = 1;
  lowestPriorityWorkOrderTime: number = 1;
  openWorkOrderTime: number = 1;
  closedWorkOrderTime: number = 1;
  pendingWorkOrderTime: number = 1;
  highestPriorityNotPlannedWorkOrderTime: number = 1;
  highPriorityNotPlannedWorkOrderTime: number = 1;
  averagePriorityNotPlannedWorkOrderTime: number = 1;
  lowPriorityNotPlannedWorkOrderTime: number = 1;
  lowestPriorityNotPlannedWorkOrderTime: number = 1;
  draftWorkOrderTime: number = 1;
}


export enum DashboardAccessEnum {
  HIGHEST_PRIORITY_WORK_ORDER = <any> 'HIGHEST_PRIORITY_WORK_ORDER',
  HIGH_PRIORITY_WORK_ORDER = <any> 'HIGH_PRIORITY_WORK_ORDER',
  AVERAGE_PRIORITY_WORK_ORDER = <any> 'AVERAGE_PRIORITY_WORK_ORDER',
  LOW_PRIORITY_WORK_ORDER = <any> 'LOW_PRIORITY_WORK_ORDER',
  LOWEST_PRIORITY_WORK_ORDER = <any> 'LOWEST_PRIORITY_WORK_ORDER',
  ACTIVE_ASSET = <any> 'ACTIVE_ASSET',
  INACTIVE_ASSET = <any> 'INACTIVE_ASSET',
  OPEN_WORK_ORDER = <any> 'OPEN_WORK_ORDER',
  CLOSED_WORK_ORDER = <any> 'CLOSED_WORK_ORDER',
  PENDING_WORK_ORDER = <any> 'PENDING_WORK_ORDER',
  DRAFT_WORK_ORDER = <any> 'DRAFT_WORK_ORDER',
  HIGHEST_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'HIGHEST_PRIORITY_NOT_PLANNED_WORK_ORDER',
  HIGH_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'HIGH_PRIORITY_NOT_PLANNED_WORK_ORDER',
  AVERAGE_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'AVERAGE_PRIORITY_NOT_PLANNED_WORK_ORDER',
  LOW_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'LOW_PRIORITY_NOT_PLANNED_WORK_ORDER',
  LOWEST_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'LOWEST_PRIORITY_NOT_PLANNED_WORK_ORDER',
}

export enum DashboardAccessEnumFA {
  HIGHEST_PRIORITY_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت خیلی بالا',
  HIGH_PRIORITY_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت بالا',
  AVERAGE_PRIORITY_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده اولویت متوسط',
  LOW_PRIORITY_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده اولویت پایین',
  LOWEST_PRIORITY_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت خیلی پایین',
  ACTIVE_ASSET = <any> 'دارایی فعال',
  INACTIVE_ASSET = <any> 'دارایی غیر فعال',
  OPEN_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده باز',
  CLOSED_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده بسته',
  PENDING_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده معلق',
  DRAFT_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده پیش نویس',
  HIGHEST_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'دستورکار تصادفی اولویت خیلی بالا',
  HIGH_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'دستورکار تصادفی اولویت بالا',
  AVERAGE_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'دستورکار تصادفی اولویت متوسط',
  LOW_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> 'دستورکار تصادفی اولویت پایین',
  LOWEST_PRIORITY_NOT_PLANNED_WORK_ORDER = <any> ' دستورکار تصادفی اولویت خیلی پایین',
}


export class ManagerDashboardAccessAssociatedMonth {
  managerDashboardHighestPriorityWorkOrderTime: number = 1;
  managerDashboardHighPriorityWorkOrderTime: number = 1;
  managerDashboardAveragePriorityWorkOrderTime: number = 1;
  managerDashboardLowPriorityWorkOrderTime: number = 1;
  managerDashboardLowestPriorityWorkOrderTime: number = 1;
  managerDashboardOpenWorkOrderTime: number = 1;
  managerDashboardClosedWorkOrderTime: number = 1;
  managerDashboardPendingWorkOrderTime: number = 1;
  managerDashboardDraftWorkOrderTime: number = 1;
  managerDashboardOverDueWorkOrderTime: number = 1;
  managerDashboardHighestPriorityPlannedWorkOrderTime: number = 1;
  managerDashboardHighPriorityPlannedWorkOrderTime: number = 1;
  managerDashboardAveragePriorityPlannedWorkOrderTime: number = 1;
  managerDashboardLowPriorityPlannedWorkOrderTime: number = 1;
  managerDashboardLowestPriorityPlannedWorkOrderTime: number = 1;
  managerDashboardOpenPlannedWorkOrderTime: number = 1;
  managerDashboardClosedPlannedWorkOrderTime: number = 1;
  managerDashboardPendingPlannedWorkOrderTime: number = 1;
  managerDashboardDraftPlannedWorkOrderTime: number = 1;
  managerDashboardOverDuePlannedWorkOrderTime: number = 1;
  managerDashboardPlannedWorkOrderRatioTime: number = 1;

}


export enum ManagerDashboardAccessEnum {
  MANAGER_DASHBOARD_HIGHEST_PRIORITY_WORK_ORDER = <any> 'MANAGER_DASHBOARD_HIGHEST_PRIORITY_WORK_ORDER',
  MANAGER_DASHBOARD_HIGH_PRIORITY_WORK_ORDER = <any> 'MANAGER_DASHBOARD_HIGH_PRIORITY_WORK_ORDER',
  MANAGER_DASHBOARD_AVERAGE_PRIORITY_WORK_ORDER = <any> 'MANAGER_DASHBOARD_AVERAGE_PRIORITY_WORK_ORDER',
  MANAGER_DASHBOARD_LOW_PRIORITY_WORK_ORDER = <any> 'MANAGER_DASHBOARD_LOW_PRIORITY_WORK_ORDER',
  MANAGER_DASHBOARD_LOWEST_PRIORITY_WORK_ORDER = <any> 'MANAGER_DASHBOARD_LOWEST_PRIORITY_WORK_ORDER',
  MANAGER_DASHBOARD_OPEN_WORK_ORDER = <any> 'MANAGER_DASHBOARD_OPEN_WORK_ORDER',
  MANAGER_DASHBOARD_CLOSED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_CLOSED_WORK_ORDER',
  MANAGER_DASHBOARD_PENDING_WORK_ORDER = <any> 'MANAGER_DASHBOARD_PENDING_WORK_ORDER',
  MANAGER_DASHBOARD_DRAFT_WORK_ORDER = <any> 'MANAGER_DASHBOARD_DRAFT_WORK_ORDER',
  MANAGER_DASHBOARD_OVER_DUE_WORK_ORDER = <any> 'MANAGER_DASHBOARD_OVER_DUE_WORK_ORDER',
  MANAGER_DASHBOARD_HIGHEST_PRIORITY_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_HIGHEST_PRIORITY_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_HIGH_PRIORITY_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_HIGH_PRIORITY_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_AVERAGE_PRIORITY_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_AVERAGE_PRIORITY_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_LOW_PRIORITY_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_LOW_PRIORITY_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_LOWEST_PRIORITY_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_LOWEST_PRIORITY_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_OPEN_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_OPEN_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_CLOSED_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_CLOSED_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_PENDING_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_PENDING_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_DRAFT_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_DRAFT_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_OVER_DUE_PLANNED_WORK_ORDER = <any> 'MANAGER_DASHBOARD_OVER_DUE_PLANNED_WORK_ORDER',
  MANAGER_DASHBOARD_PLANNED_WORK_ORDER_RATIO = <any> 'MANAGER_DASHBOARD_PLANNED_WORK_ORDER_RATIO',
  GENERAL_ACTIVE_ASSET = <any> 'GENERAL_ACTIVE_ASSET',
  GENERAL_IN_ACTIVE_ASSET = <any> 'GENERAL_IN_ACTIVE_ASSET',
}

export enum ManagerDashboardAccessEnumFA {
  MANAGER_DASHBOARD_HIGHEST_PRIORITY_WORK_ORDER = <any> 'دستورکار تصادفی اولویت خیلی بالا',
  MANAGER_DASHBOARD_HIGH_PRIORITY_WORK_ORDER = <any> 'دستورکار تصادفی اولویت بالا',
  MANAGER_DASHBOARD_AVERAGE_PRIORITY_WORK_ORDER = <any> 'دستورکار تصادفی اولویت متوسط',
  MANAGER_DASHBOARD_LOW_PRIORITY_WORK_ORDER = <any> 'دستورکار تصادفی اولویت پایین',
  MANAGER_DASHBOARD_LOWEST_PRIORITY_WORK_ORDER = <any> ' دستورکار تصادفی اولویت خیلی پایین',
  MANAGER_DASHBOARD_OPEN_WORK_ORDER = <any> ' دستورکار تصادفی باز',
  MANAGER_DASHBOARD_CLOSED_WORK_ORDER = <any> 'دستورکار تصادفی بسته',
  MANAGER_DASHBOARD_PENDING_WORK_ORDER = <any> 'دستورکار تصادفی معلق',
  MANAGER_DASHBOARD_DRAFT_WORK_ORDER = <any> 'دستورکار تصادفی پیش نویس',
  MANAGER_DASHBOARD_OVER_DUE_WORK_ORDER = <any> ' دستورکار تصادفی معوق',

  MANAGER_DASHBOARD_HIGHEST_PRIORITY_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت خیلی بالا',
  MANAGER_DASHBOARD_HIGH_PRIORITY_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت بالا',
  MANAGER_DASHBOARD_AVERAGE_PRIORITY_PLANNED_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده اولویت متوسط',
  MANAGER_DASHBOARD_LOW_PRIORITY_PLANNED_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده اولویت پایین',
  MANAGER_DASHBOARD_LOWEST_PRIORITY_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده اولویت خیلی پایین',
  MANAGER_DASHBOARD_OPEN_PLANNED_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده باز',
  MANAGER_DASHBOARD_CLOSED_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده بسته',
  MANAGER_DASHBOARD_PENDING_PLANNED_WORK_ORDER = <any> 'دستورکار برنامه ریزی شده معلق',
  MANAGER_DASHBOARD_DRAFT_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده پیشنویس',
  MANAGER_DASHBOARD_OVER_DUE_PLANNED_WORK_ORDER = <any> ' دستورکار برنامه ریزی شده معوق',
  MANAGER_DASHBOARD_PLANNED_WORK_ORDER_RATIO = <any> '  نسبت دستورکار برنامه ریزی شده به کل دستورکارها',
  GENERAL_ACTIVE_ASSET = <any> 'دارایی فعال',
  GENERAL_IN_ACTIVE_ASSET = <any> 'دارایی غیر فعال',


}


export class DashboardAccessWorkOrder {
  workOrderId: string;
  workOrderName: string;
  workOrderCode: string;
  workOrderPriority: Priority;
  workOrderMaintenanceType: MaintenanceType;
  projectId: string;
  projectName: string;
  workOrderStartDate;
  workOrderEndDate;
  fromSchedule: boolean;
  workOrderStatusId: string;
  workOrderStatusName: string;
  assetId: string;
  assetName: string;
}
