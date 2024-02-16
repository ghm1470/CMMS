import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {ScheduleMaintenanceDto} from '../../model/dto/scheduleMaintenanceDto';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
declare var $: any;
@Component({
  selector: 'app-schedule-maintenance-completion-detail',
  templateUrl: './schedule-maintenance-completion-detail.component.html',
  styleUrls: ['./schedule-maintenance-completion-detail.component.scss']
})
export class ScheduleMaintenanceCompletionDetailComponent implements OnInit, OnDestroy {

  @Input() scheduleMaintenanceId: string;
  @Input() mode: ActionMode;

  myPattern = MyPattern;
  actionMode = ActionMode;
  completionDetail = new ScheduleMaintenanceDto.ScheduleMaintenanceCompletionDetail();
  completionDetailCopy = new ScheduleMaintenanceDto.ScheduleMaintenanceCompletionDetail();
  doSave = false;
  disabledButton = false;

  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService) {
  }

  ngOnInit() {
    this.getCompletionDetailByAssetId();
    if (this.mode === ActionMode.VIEW) {
      $('input').attr('disabled', 'disabled');
      $('select').attr('disabled', 'disabled');
      $('textarea').attr('disabled', 'disabled');
    }
  }

  getCompletionDetailByAssetId() {
    this.scheduleMaintenanceService.getCompletionDetailByScheduleMaintenanceId({scheduleMaintenanceId: this.scheduleMaintenanceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: ScheduleMaintenanceDto.ScheduleMaintenanceCompletionDetail) => {
      if (!isNullOrUndefined(res) && !isNullOrUndefined(res.note)) {
        this.completionDetail = res;
        this.completionDetailCopy = JSON.parse(JSON.stringify(res));
      }
    });
  }

  ngOnDestroy(): void {
  }

  action(completionDetailForm) {
    this.doSave = true;
    if (completionDetailForm.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (JSON.stringify(this.completionDetail) === JSON.stringify(this.completionDetailCopy)) {
      DefaultNotify.notifyDanger('شما تغییری ایجاد نکرده اید', '', NotiConfig.notifyConfig);
      return;
    }
    this.scheduleMaintenanceService.updateScheduleMaintenanceCompletionDetail(this.completionDetail,
      {scheduleMaintenanceId: this.scheduleMaintenanceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.completionDetailCopy = JSON.parse(JSON.stringify(this.completionDetail));
        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
      } else {
        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
      }
    });
  }
}
