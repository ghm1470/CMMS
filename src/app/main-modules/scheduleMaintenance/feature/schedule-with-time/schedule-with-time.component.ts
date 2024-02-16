import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { ScheduleMaintenanceDto} from '../../model/dto/scheduleMaintenanceDto';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, EnumHandle, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {UnitOfMeasurementService} from '../../../basicInformation/unitOfMeasurement/endpoint/unit-of-measurement.service';
import {ModalUtil} from '@angular-boot/widgets';
import {ActivatedRoute, Router} from '@angular/router';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {Moment} from "../../../../shared/shared/tools/date/moment";

declare var $: any;


@Component({
  selector: 'app-schedule-with-time',
  templateUrl: './schedule-with-time.component.html',
  styleUrls: ['./schedule-with-time.component.scss']
})
export class ScheduleWithTimeComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() scheduleMaintenanceId: string;
  @Input() againGetT: boolean;
  @Input() TMode: ActionMode;
  mode: ActionMode = ActionMode.VIEW;
  modeView: ActionMode = ActionMode.ADD;
  actionMode = ActionMode;
  scheduleTime = new ScheduleMaintenanceDto.ScheduledTime();
  scheduleTimeCopy = new ScheduleMaintenanceDto.ScheduledTime();
  myMoment = Moment;
  dateViewMode = DateViewMode;
  Toolkit2 = Toolkit2;
  cycleList: any[] = [];
  cycle: string;
  sendItemForEdit = new ScheduleMaintenanceDto.ScheduleWithTimeAndMetering();
  view = false;
  viewTimeModal = false;
  loading = true;
  readService= false;

  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService,
              public unitOfMeasurementService: UnitOfMeasurementService,
              public router: Router,
              public  activatedRoute: ActivatedRoute) {
    this.cycleList = EnumHandle.getAsValueTitleList(ScheduleMaintenanceDto.TimeTypeView);
  }

  ngOnInit() {
    // this.scheduleTime.scheduledTime = null;
    this.getScheduleWithTimeAndMeteringByScheduleMaintenanceId();
    // if (this.mode === ActionMode.VIEW) {
    //   $('input').attr('disabled', 'disabled');
    //   $('select').attr('disabled', 'disabled');
    // }

  }

  ngOnChanges(): void {
    // this.getScheduleWithTimeAndMeteringByScheduleMaintenanceId();
  }

  ngOnDestroy(): void {
  }

  getScheduleWithTimeAndMeteringByScheduleMaintenanceId() {
    this.scheduleMaintenanceService.getScheduleWithTimeByScheduleMaintenanceId(
      {scheduleMaintenanceId: this.scheduleMaintenanceId}).pipe(takeUntilDestroyed(this))
      .subscribe((res) => {
        if (isNullOrUndefined(res.endOn)) {
          this.mode = ActionMode.ADD;
          this.loading = false;
        }
        if (res && (!isNullOrUndefined(res.endOn) || !isNullOrUndefined(res.startOn))) {
          this.loading = false;
          this.mode = ActionMode.EDIT;
          this.scheduleTime = res;
          this.putTitleOfCycle();
        }
        this.scheduleTimeCopy = JSON.parse(JSON.stringify(res));
      });
  }

putTitleOfCycle() {
  for (const item of this.cycleList) {
    if ( item.value ===  this.scheduleTime.cycle) {
      this.cycle =  item.title;
    }
  }
}
  chooseSelectedItemForEdit(item) {
    this.viewTimeModal = true;
    setTimeout(() => {
      this.sendItemForEdit = item;
      this.mode = ActionMode.EDIT;
      ModalUtil.showModal('timeModal');
    } , 50);
  }

  setService() {
    this.viewTimeModal = true;
    setTimeout(() => {
      this.mode = ActionMode.ADD;
      ModalUtil.showModal('timeModal');
      } , 100);
    // this.autoplay = !this.autoplay;
  }

  ngAfterViewInit(): void {
  }

  deleteItem() {
    // this.scheduleTime.scheduleType = null;
    this.scheduleMaintenanceService.deleteScheduleMaintenanceTimeScheduling
    (this.scheduleTime,
      {scheduleMaintenanceId: this.scheduleMaintenanceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
      if (res) {
        this.viewTimeModal = false;
        this.mode = this.actionMode.ADD;
        this.scheduleTime = new ScheduleMaintenanceDto.ScheduledTime();
      }
    });

  }

  receive(event) {
    this.scheduleTime = new ScheduleMaintenanceDto.ScheduledTime();
    this.mode = ActionMode.EDIT;
    this.scheduleTime.lastModify = event.lastModify;
    this.scheduleTime.per = event.per;
    this.scheduleTime.cycle = event.cycle;
    this.scheduleTime.startOn = event.startOn;
    this.scheduleTime.endOn = event.endOn;
    this.scheduleTime.id = event.id;
    this.putTitleOfCycle();
  }

  openShowScheduledTimeModal() {
    this.view = ! this.view;
    this.readService = true ;
    ModalUtil.showModal('showScheduledTime');
  }


  changeViewTimeModal(event: boolean) {
    this.modeView = this.actionMode.ADD;
    this.viewTimeModal = false;
  }

  chooseSelectedItemForView(item) {
    this.modeView = this.actionMode.VIEW;
    this.viewTimeModal = true;
    setTimeout(() => {
      this.sendItemForEdit = item;
      this.mode = ActionMode.EDIT;
      ModalUtil.showModal('timeModal');
    } , 50);
  }
}
