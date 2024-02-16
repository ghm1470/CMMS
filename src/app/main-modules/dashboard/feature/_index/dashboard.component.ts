import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {DashboardField} from '../../model/dto/dashboardFields';
import {EnumHandle, ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {DashboardAccessService} from '../../endpoint/dashboard-access.service';
import {DashboardService} from '../../service/dashboard.service';
import {DashboardWorkOrder} from '../../model/dto/dashboard-work-order';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {
  DashboardAccess,
  ManagerDashboardAccessAssociatedMonth,
  ManagerDashboardAccessEnum, ManagerDashboardAccessEnumFA
} from '../../model/dto/dashboard-access';
import {MatSlideToggleChange} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {CacheService, CacheType, takeUntilDestroyed} from "@angular-boot/core";
import {Moment} from "../../../../shared/shared/tools/date/moment";

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  myType = DashboardField.Type;
  MyModalSize = ModalSize;
  myMoment = Moment;

  selectWidgetModalId = ModalUtil.generateModalId();
  selectDateModalId = ModalUtil.generateModalId();

  currentWorkOrder: DashboardWorkOrder.PendingAndCurrent [] = [];
  currentPlanedWorkOrder: DashboardWorkOrder.PendingAndCurrent [] = [];
  pendingWorkOrder: DashboardWorkOrder.PendingAndCurrent [] = [];
  lateWorkOrder: DashboardWorkOrder.Late [] = [];
  unscheduledWorkOrder: DashboardWorkOrder.Unscheduled [] = [];
  dateViewMode = DateViewMode;
  currentWorkOrderLoader;
  currentPlanedWorkOrderLoader;
  pendingWorkOrderLoader;
  lateWorkOrderLoader;
  unscheduledWorkOrderLoader;

  managerDashboardAccessAssociatedMonth = new ManagerDashboardAccessAssociatedMonth();
  managerDashboardAccessEnum = ManagerDashboardAccessEnum;
  managerDashboardAccessEnumFATitle = ManagerDashboardAccessEnumFA;

  managerDashboardAccess = new DashboardAccess();

  selectedWidgetInModal: ManagerDashboardAccessEnum [] = [];
  selectedWidgetInModalChangeMonth: ManagerDashboardAccessEnum [] = [];
  userWidget = [];
  userWidgetCopy = [];
  userRoleAccessWidget = [];
  toolkit = Toolkit2;

  workOrderModalId = ModalUtil.generateModalId();
  workOrderModalTitle = '';

  user: UserDto.Create = new UserDto.Create();
  workOrderList = [];
  assetsList = [];
  assetModalTitle = '';
  assetModalId = ModalUtil.generateModalId();
  accessId;
  roleList = new TokenRoleList();

  constructor(
    private workOrderService: WorkOrderService,
    private dashboardService: DashboardService,
    private dashboardAccessService: DashboardAccessService,
    public assetService: AssetService,
    private cacheService: CacheService,

  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    const dashEnum = EnumHandle.getAsValueTitleList(ManagerDashboardAccessEnum);
    for (const item of dashEnum) {
      this.userRoleAccessWidget.push(item.title);
    }
  }


  ngOnInit() {
    this.managerDashboardCurrentWeekWorkOrdersForBar();
    this.getManagerDashboardAccess();
    this.getRoleListKey();

  }


  getRoleListKey() {
    this.cacheService.getItem(Auth.RoleListKey,
        CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.readService(this.userWidget);
    }, 2000);
  }

  getManagerDashboardAccess() {
    this.dashboardService.getUserDashboardAccess({userId: this.user.id}).subscribe((res: DashboardAccess) => {
      if (!isNullOrUndefined(res)) {
        if (res.id) {
          this.accessId = res.id;
        }
        if (res.dashboardAccessEnumList) {
          this.userWidget = res.dashboardAccessEnumList;
          this.userWidgetCopy = JSON.parse(JSON.stringify(res.dashboardAccessEnumList));
        }
        if (res.dashboardAccessAssociatedMonth) {
          this.managerDashboardAccessAssociatedMonth = res.dashboardAccessAssociatedMonth;
        }
      }
    });
  }

  readService(accessList) {
    for (const item of accessList) {
      switch (<any> item) {
        case ManagerDashboardAccessEnum.GENERAL_ACTIVE_ASSET: {
          this.countGeneralOnlineAssets(ManagerDashboardAccessEnum.GENERAL_ACTIVE_ASSET);
          break;
        }
        case ManagerDashboardAccessEnum.GENERAL_IN_ACTIVE_ASSET: {
          this.countGeneralOfflineAssets(ManagerDashboardAccessEnum.GENERAL_IN_ACTIVE_ASSET);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGHEST_PRIORITY_WORK_ORDER: {
          this.managerDashboardCountHighestPriorityWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGHEST_PRIORITY_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGH_PRIORITY_WORK_ORDER: {
          this.managerDashboardCountHighPriorityWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGH_PRIORITY_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_AVERAGE_PRIORITY_WORK_ORDER: {
          this.managerDashboardCountAveragePriorityWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_AVERAGE_PRIORITY_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOW_PRIORITY_WORK_ORDER: {
          this.managerDashboardCountLowPriorityWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOW_PRIORITY_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOWEST_PRIORITY_WORK_ORDER: {
          this.managerDashboardCountLowestPriorityWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOWEST_PRIORITY_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OPEN_WORK_ORDER: {
          this.managerDashboardCountOpenWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OPEN_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_CLOSED_WORK_ORDER: {
          this.managerDashboardCountClosedWorkOrder(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_CLOSED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PENDING_WORK_ORDER: {
          this.managerDashboardCountPendingWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PENDING_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_DRAFT_WORK_ORDER: {
          this.managerDashboardCountDraftWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_DRAFT_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OVER_DUE_WORK_ORDER: {
          this.managerDashboardCountOverDueWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OVER_DUE_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGHEST_PRIORITY_PLANNED_WORK_ORDER: {
          this.managerDashboardCountHighestPriorityPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGHEST_PRIORITY_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGH_PRIORITY_PLANNED_WORK_ORDER: {
          this.managerDashboardCountHighPriorityPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_HIGH_PRIORITY_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_AVERAGE_PRIORITY_PLANNED_WORK_ORDER: {
          this.managerDashboardCountAveragePriorityPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_AVERAGE_PRIORITY_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOW_PRIORITY_PLANNED_WORK_ORDER: {
          this.managerDashboardCountLowPriorityPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOW_PRIORITY_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOWEST_PRIORITY_PLANNED_WORK_ORDER: {
          this.managerDashboardCountLowestPriorityPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_LOWEST_PRIORITY_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OPEN_PLANNED_WORK_ORDER: {
          this.managerDashboardCountOpenPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OPEN_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_CLOSED_PLANNED_WORK_ORDER: {
          this.managerDashboardCountClosedPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_CLOSED_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PENDING_PLANNED_WORK_ORDER: {
          this.managerDashboardCountPendingPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PENDING_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_DRAFT_PLANNED_WORK_ORDER: {
          this.managerDashboardCountDraftPlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_DRAFT_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OVER_DUE_PLANNED_WORK_ORDER: {
          this.managerDashboardCountOverDuePlannedWorkOrders(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_OVER_DUE_PLANNED_WORK_ORDER);
          break;
        }
        case ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PLANNED_WORK_ORDER_RATIO: {
          this.managerDashboardPlannedWorkOrdersRatio(ManagerDashboardAccessEnum.MANAGER_DASHBOARD_PLANNED_WORK_ORDER_RATIO);
          break;
        }
      }
    }
  }

  managerDashboardCurrentWeekWorkOrdersForBar() {
    this.currentWorkOrderLoader = true;
    this.dashboardService.managerDashboardCurrentWeekWorkOrdersForBar().subscribe(res => {
      this.currentWorkOrderLoader = false;
      if (res) {
        this.currentWorkOrder = res;
      }
    });
  }

  managerDashboardCurrentPlannedWorkOrdersForBar() {
    this.currentPlanedWorkOrderLoader = true;
    this.dashboardService.managerDashboardCurrentPlannedWorkOrdersForBar().subscribe(res => {
      this.currentPlanedWorkOrderLoader = false;
      if (res) {
        this.currentPlanedWorkOrder = res;
      }
    });
    setTimeout(() => {
      this.currentPlanedWorkOrderLoader = false;
    }, 3000);
  }

  managerDashboardPendingWorkOrdersForBar() {
    this.pendingWorkOrderLoader = true;
    this.dashboardService.managerDashboardPendingWorkOrdersForBar().subscribe(res => {
      this.pendingWorkOrderLoader = false;
      if (res) {
        this.pendingWorkOrder = res;
      }
    });
    setTimeout(() => {
      this.pendingWorkOrderLoader = false;
    }, 3000);
  }

  managerDashboardLateWorkOrdersForBar() {
    this.lateWorkOrderLoader = true;
    this.dashboardService.managerDashboardLateWorkOrdersForBar().subscribe(res => {
      this.lateWorkOrderLoader = false;
      if (res) {
        this.lateWorkOrder = res;
      }
    });
    setTimeout(() => {
      this.lateWorkOrderLoader = false;
    }, 3000);
  }

  managerDashboardUnscheduledWorkOrdersForBar() {
    this.dashboardService.managerDashboardUnscheduledWorkOrdersForBar().subscribe(res => {
      this.unscheduledWorkOrderLoader = false;
      if (res) {
        this.unscheduledWorkOrder = res;
      }
    });
    setTimeout(() => {
      this.unscheduledWorkOrderLoader = false;
    }, 3000);
  }

  openModal(modalId: string) {
    this.selectedWidgetInModal = [];
    ModalUtil.showModal(modalId);
  }

  selectWidget(event: MatSlideToggleChange, key) {
    if (event.checked) {
      this.selectedWidgetInModal.push(key);
      this.userWidgetCopy.push(key);
    } else {
      for (let i = 0; i < this.selectedWidgetInModal.length; i++) {
        if (this.selectedWidgetInModal[i] === key) {
          this.selectedWidgetInModal.splice(i, 1);
        }
      }
      for (let i = 0; i < this.userWidget.length; i++) {
        if (this.userWidget[i] === key) {
          this.userWidget.splice(i, 1);
        }
      }

      for (let i = 0; i < this.userWidgetCopy.length; i++) {
        if (this.userWidgetCopy[i] === key) {
          this.userWidgetCopy.splice(i, 1);
        }
      }
    }
  }

  hasWidget(key) {
    let has;
    for (const item of this.userWidgetCopy) {
      if (item === key) {
        has = true;
        return has;
      } else {
        has = false;
      }
    }
    if (!has) {
      return has;
    }
  }

  sendWidget() {
    this.managerDashboardAccess.dashboardAccessEnumList = this.userWidgetCopy;
    this.managerDashboardAccess.dashboardAccessAssociatedMonth = this.managerDashboardAccessAssociatedMonth;
    this.managerDashboardAccess.userId = this.user.id;
    if (this.accessId) {
      this.managerDashboardAccess.id = this.accessId;
    }
    this.dashboardService.createUserDashboardAccess(this.managerDashboardAccess).subscribe(res => {
      if (res) {
        for (const item of this.selectedWidgetInModal) {
          this.userWidget.push(item.toString());
        }
        ModalUtil.hideModal(this.selectWidgetModalId);
        this.readService(JSON.parse(JSON.stringify(this.selectedWidgetInModal)));
        this.readService(JSON.parse(JSON.stringify(this.selectedWidgetInModalChangeMonth)));
        this.selectedWidgetInModal = [];
        this.selectedWidgetInModalChangeMonth = [];
      }
    });

  }


  managerDashboardCountHighestPriorityWorkOrders(type) {
    this.dashboardService.managerDashboardCountHighestPriorityWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighestPriorityWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountHighPriorityWorkOrders(type) {
    this.dashboardService.managerDashboardCountHighPriorityWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighPriorityWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountAveragePriorityWorkOrders(type) {
    this.dashboardService.managerDashboardCountAveragePriorityWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardAveragePriorityWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountLowPriorityWorkOrders(type) {
    this.dashboardService.managerDashboardCountLowPriorityWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowPriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountLowestPriorityWorkOrders(type) {
    this.dashboardService.managerDashboardCountLowestPriorityWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowestPriorityWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountOpenWorkOrders(type) {
    this.dashboardService.managerDashboardCountOpenWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardOpenWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountClosedWorkOrder(type) {
    this.dashboardService.managerDashboardCountClosedWorkOrder(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardClosedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountPendingWorkOrders(type) {
    this.dashboardService.managerDashboardCountPendingWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardPendingWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountDraftWorkOrders(type) {
    this.dashboardService.managerDashboardCountDraftWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardDraftWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountOverDueWorkOrders(type) {
    this.dashboardService.managerDashboardCountOverDueWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardOverDueWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountHighestPriorityPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountHighestPriorityPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighestPriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountHighPriorityPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountHighPriorityPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighPriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountAveragePriorityPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountAveragePriorityPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardAveragePriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountLowPriorityPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountLowPriorityPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowPriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountLowestPriorityPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountLowestPriorityPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowestPriorityPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountOpenPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountOpenPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardOpenPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountClosedPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountClosedPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardClosedPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountPendingPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountPendingPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardPendingPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountDraftPlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountDraftPlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardDraftPlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardCountOverDuePlannedWorkOrders(type) {
    this.dashboardService.managerDashboardCountOverDuePlannedWorkOrders(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardOverDuePlannedWorkOrderTime})
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  managerDashboardPlannedWorkOrdersRatio(type) {
    this.dashboardService.managerDashboardPlannedWorkOrdersRatio(
      {month: this.managerDashboardAccessAssociatedMonth.managerDashboardPlannedWorkOrderRatioTime})
      .subscribe((res: any) => {
        if (res) {
          $('#T' + type).text(Toolkit2.Common.En2Fa(res.plannedWorkOrders) + ' از ' + Toolkit2.Common.En2Fa(res.allWorkOrders));
          const iP = (100 * res.plannedWorkOrders) / res.allWorkOrders;
          $('#' + type).attr('stroke-dasharray', iP.toString() + ', 100');
        }
      });
  }

  countGeneralOnlineAssets(type) {
    this.dashboardService.countGeneralOnlineAssets()
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }

  countGeneralOfflineAssets(type) {
    this.dashboardService.countGeneralOfflineAssets()
      .subscribe(res => {
        if (res >= 0) {
          $('#' + type).text(Toolkit2.Common.En2Fa(res));
        }
      });
  }


  ngOnDestroy(): void {
  }


  managerDashboardGetHighestPriorityWorkOrders(title) {
    this.dashboardService.managerDashboardGetHighestPriorityWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighestPriorityWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetHighPriorityWorkOrders(title) {
    this.dashboardService.managerDashboardGetHighPriorityWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighPriorityWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetAveragePriorityWorkOrders(title) {
    this.dashboardService.managerDashboardGetAveragePriorityWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardAveragePriorityWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetLowPriorityWorkOrders(title) {
    this.dashboardService.managerDashboardGetLowPriorityWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowPriorityWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetLowestPriorityWorkOrders(title) {
    this.dashboardService.managerDashboardGetLowestPriorityWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowestPriorityWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetPendingWorkOrders(title) {
    this.dashboardService.managerDashboardGetPendingWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardPendingWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetOpenWorkOrders(title) {
    this.dashboardService.managerDashboardGetOpenWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardOpenWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetClosedWorkOrder(title) {
    this.dashboardService.managerDashboardGetClosedWorkOrder({month: this.managerDashboardAccessAssociatedMonth.managerDashboardClosedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetDraftWorkOrders(title) {
    this.dashboardService.managerDashboardGetDraftWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardDraftWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetOverDueWorkOrders(title) {
    this.dashboardService.managerDashboardGetOverDueWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardOverDueWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }


  managerDashboardGetHighestPriorityPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetHighestPriorityPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighestPriorityPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetHighPriorityPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetHighPriorityPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardHighPriorityPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetAveragePriorityPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetAveragePriorityPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardAveragePriorityPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetLowPriorityPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetLowPriorityPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowPriorityPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetLowestPriorityPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetLowestPriorityPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardLowestPriorityPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetOpenPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetOpenPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardOpenPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetClosedPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetClosedPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardClosedPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetPendingPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetPendingPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardPendingPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetDraftPlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetDraftPlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardDraftPlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  managerDashboardGetOverDuePlannedWorkOrders(title) {
    this.dashboardService.managerDashboardGetOverDuePlannedWorkOrders({month: this.managerDashboardAccessAssociatedMonth.managerDashboardOverDuePlannedWorkOrderTime})
      .subscribe(res => {

        if (res) {
          this.workOrderList = [];
          this.workOrderList = res;
          this.workOrderModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.workOrderModalId);
        }
      });
  }

  getGeneralOnlineAssets(title) {
    this.dashboardService.getGeneralOnlineAssets()
      .subscribe(res => {

        if (res) {
          this.assetsList = [];
          this.assetsList = res;
          this.assetModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.assetModalId);
        }
      });
  }

  getGeneralOfflineAssets(title) {
    this.dashboardService.getGeneralOfflineAssets()
      .subscribe(res => {

        if (res) {
          this.assetsList = [];
          this.assetsList = res;
          this.assetModalTitle = 'لیست ' + title;
          ModalUtil.showModal(this.assetModalId);
        }
      });
  }


  changeMonth(type) {
    let has;
    for (let i = 0; i < this.selectedWidgetInModal.length; i++) {
      if (this.selectedWidgetInModalChangeMonth[i] === type) {
        has = true;
        this.selectedWidgetInModalChangeMonth.splice(i, 1);
        break;
      } else {
        has = false;
      }
    }
    if (!has) {
      this.selectedWidgetInModalChangeMonth.push(type);
    }
  }
}


