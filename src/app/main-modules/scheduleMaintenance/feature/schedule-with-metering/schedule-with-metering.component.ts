import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ScheduleMaintenanceDto} from '../../model/dto/scheduleMaintenanceDto';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {UnitOfMeasurementService} from '../../../basicInformation/unitOfMeasurement/endpoint/unit-of-measurement.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {Moment} from "../../../../shared/shared/tools/date/moment";

declare var $: any;

@Component({
  selector: 'app-schedule-with-metering',
  templateUrl: './schedule-with-metering.component.html',
  styleUrls: ['./schedule-with-metering.component.scss']
})
export class ScheduleWithMeteringComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() scheduleMaintenanceId: string;
  @Input() assetId: string;
  @Input() againGetM: boolean;
  @Input() MMode: ActionMode;
  mode: ActionMode = ActionMode.VIEW;
  modeView: ActionMode = ActionMode.ADD;
  actionMode = ActionMode;
  sendItemForEdit = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
  scheduleMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
  scheduleMeteringCopy = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
  myMoment = Moment;
  dateViewMode = DateViewMode;
  view = false;
  viewMeteringModal = false;
  unitOfMeasurementList: UnitOfMeasurement[] = [];
  loading = true;
  readService: any;

  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService,
              public unitOfMeasurementService: UnitOfMeasurementService,
              public router: Router,
              public  activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getScheduleWithTimeAndMeteringByScheduleMaintenanceId();
    this.getUnitOfMeasurementList();
  }

  ngOnDestroy(): void {
  }

  getScheduleWithTimeAndMeteringByScheduleMaintenanceId() {
    this.scheduleMaintenanceService.getScheduleMeteringByScheduleMaintenanceId(
      {scheduleMaintenanceId: this.scheduleMaintenanceId}).pipe(takeUntilDestroyed(this))
      .subscribe((res) => {
        if (res.endDistance === 0 && res.startDistance === 0) {
          this.loading = false;
          this.mode = ActionMode.ADD;
        }
        if (res && res.endDistance !== 0  || res.startDistance !== 0 )  {
          this.loading = false;
          this.mode = ActionMode.EDIT;
          this.scheduleMetering = res;
        }
        if (!isNullOrUndefined(res)) {
          this.loading = false;
          this.scheduleMeteringCopy = JSON.parse(JSON.stringify(res));
                }
      });
  }

  chooseSelectedItemForEdit(item) {
    this.viewMeteringModal = true;
    setTimeout(() => {
      this.sendItemForEdit = item;
      this.mode = ActionMode.EDIT;
      ModalUtil.showModal('MeteringSModal');
    }, 100);
  }

  setService() {
    this.viewMeteringModal = true;
    setTimeout(() => {
      this.mode = ActionMode.ADD;
      ModalUtil.showModal('MeteringSModal');
    }, 100);
  }

  ngAfterViewInit(): void {
  }

  deleteItem() {
    this.scheduleMetering = null;
    this.scheduleMaintenanceService.deleteScheduleMaintenanceMeteringScheduling
    (this.scheduleMetering,
      {scheduleMaintenanceId: this.scheduleMaintenanceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
      if (res) {
        this.mode = ActionMode.ADD;
        this.scheduleMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
      }
    });
  }

  receive(event: ScheduleMaintenanceDto.ScheduledMeteringCycleDTO) {
    // if (!isNullOrUndefined(event.registrationDate)) {
    //   $('#registrationDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
    //   (new Date(this.scheduleMetering.registrationDate).toISOString()))).trigger('change');
    // }
    this.scheduleMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycleDTO();
    this.mode = ActionMode.EDIT;
    this.scheduleMetering = event;
  }

  openShowScheduledMeteringModal() {
    this.view = ! this.view;
    this.readService = true ;
    ModalUtil.showModal('showScheduledMetering');
  }

  changeViewMeteringModal(event) {
    this.modeView = ActionMode.ADD;
    this.viewMeteringModal = false;

  }

  chooseSelectedItemForView(item: ScheduleMaintenanceDto.ScheduledMeteringCycleDTO) {
    this.viewMeteringModal = true;
    setTimeout(() => {
      this.sendItemForEdit = item;
      this.modeView = ActionMode.VIEW;
      ModalUtil.showModal('MeteringSModal');
    }, 100);
  }
   getUnitOfMeasurementList() {
    this.scheduleMaintenanceService.getAllForThisAsset({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: UnitOfMeasurement[]) => {
        if (res && res.length) {
          this.unitOfMeasurementList = res;
        }
      });
  }
}
