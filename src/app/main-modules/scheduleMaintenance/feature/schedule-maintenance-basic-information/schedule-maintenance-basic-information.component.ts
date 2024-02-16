import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ScheduleMaintenanceDto} from '../../../scheduleMaintenance/model/dto/scheduleMaintenanceDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import ScheduleMaintenanceBasicInformation = ScheduleMaintenanceDto.ScheduleMaintenanceBasicInformation;
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
  selector: 'app-schedule-maintenance-basic-information',
  templateUrl: './schedule-maintenance-basic-information.component.html',
  styleUrls: ['./schedule-maintenance-basic-information.component.scss']
})
export class ScheduleMaintenanceBasicInformationComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() scheduleMaintenanceId: string;
  @Input() mode: ActionMode;

  myPattern = MyPattern;
  myMoment = Moment;
  actionMode = ActionMode;
  scheduleMaintenanceBasicInformation = new ScheduleMaintenanceDto.ScheduleMaintenanceBasicInformation();
  scheduleMaintenanceBasicInformationCopy = new ScheduleMaintenanceDto.ScheduleMaintenanceBasicInformation();

  userList: UserDto.Create[] = [];
  doSave = false;
  disabledButton = false;

  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService,
              public userService: UserService) {
    // this.scheduleMaintenanceBasicInformation.userAssigned.id = '-1';
  }

  ngOnInit() {
    this.getBasicInformationByAssetId();
    // this.getAllUser();
    if (this.mode === ActionMode.VIEW) {
      $('input').attr('disabled', 'disabled');
      $('select').attr('disabled', 'disabled');
      $('textarea').attr('disabled', 'disabled');
    }
  }

  ngAfterViewInit(): void {
    const mthis = this;
    $('#completionDate').azPersianDateTimePicker({
      Placement: 'left', // default is 'bottom'
      Trigger: 'focus', // default is 'focus',
      enableTimePicker: false, // default is true,
      TargetSelector: '', // default is empty,
      GroupId: '', // default is empty,
      ToDate: false, // default is false,
      FromDate: false, // default is false,
      targetTextSelector: $('#completionDate'),
    }).on('change', (e) => {
      mthis.scheduleMaintenanceBasicInformation.completionDate =
        mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    });
  }

  getAllUser() {
    this.userService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: UserDto.Create[]) => {
        if (res && res.length > 0) {
          this.userList = res;
        }
      });
  }

  getBasicInformationByAssetId() {
    this.scheduleMaintenanceService.getBasicInformationByScheduleMaintenanceId({scheduleMaintenanceId: this.scheduleMaintenanceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: ScheduleMaintenanceBasicInformation) => {
      if (!isNullOrUndefined(res) && !isNullOrUndefined(res.issueSummary)) {
        this.scheduleMaintenanceBasicInformation = res;
        this.scheduleMaintenanceBasicInformationCopy = JSON.parse(JSON.stringify(res));
        if (!isNullOrUndefined(this.scheduleMaintenanceBasicInformation.completionDate)) {
          $('#completionDate').val(Toolkit2.Common.En2Fa(
            this.myMoment.convertIsoToJDate(new Date(this.scheduleMaintenanceBasicInformation.completionDate).toISOString())));
        }
      }
    });
  }

  ngOnDestroy(): void {
  }

  action(scheduleMaintenanceBasicInformationForm) {
    this.doSave = true;
    if (scheduleMaintenanceBasicInformationForm.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (JSON.stringify(this.scheduleMaintenanceBasicInformation) === JSON.stringify(this.scheduleMaintenanceBasicInformationCopy)) {
      DefaultNotify.notifyDanger('شما تغییری ایجاد نکرده اید', '', NotiConfig.notifyConfig);
      return;
    }
    this.scheduleMaintenanceService.updateScheduleMaintenanceBasicInformation(this.scheduleMaintenanceBasicInformation,
      {scheduleMaintenanceId: this.scheduleMaintenanceId}).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.scheduleMaintenanceBasicInformationCopy = JSON.parse(JSON.stringify(this.scheduleMaintenanceBasicInformation));
        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
      } else {
        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
      }
    });
  }
}
