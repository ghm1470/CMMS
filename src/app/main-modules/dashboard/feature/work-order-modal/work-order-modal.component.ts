import {Component, Input, OnInit} from '@angular/core';
import {ModalSize, Toolkit2} from '@angular-boot/util';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {GetAllWorkTable} from '../../../worktable/feature/list/worktable-list.component';
import {DashboardAccessWorkOrder} from '../../model/dto/dashboard-access';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import Priority = WorkOrderDto.Priority;
import Scheduling = WorkOrderDto.Scheduling;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {Moment} from '../../../../shared/shared/tools/date/moment';

declare var $: any;

@Component({
  selector: 'app-work-order-modal',
  templateUrl: './work-order-modal.component.html',
  styleUrls: ['./work-order-modal.component.scss']
})
export class WorkOrderModalComponent implements OnInit {
  MyModalSize = ModalSize;
  @Input() modalId;
  @Input() title;
  @Input() workOrderList: DashboardAccessWorkOrder [] = [];
  MyToolkit = Toolkit2;
  priorityList = [] as EnumObject[];
  schedulingList = [] as EnumObject[];
  maintenanceTypeList = [] as EnumObject[];
  dateViewMode = DateViewMode;
  myMoment = Moment;

  constructor() {
    this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
    this.schedulingList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Scheduling>(Scheduling));
    this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
  }

  ngOnInit() {
  }

  removeModal() {
    $('body').removeClass('modal-open');
  }
}
