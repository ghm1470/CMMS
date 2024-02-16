import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ListHelper, ModalSize, PageContainer} from '@angular-boot/util';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {isNullOrUndefined} from 'util';
import {ScheduleMaintenanceDto} from '../../../model/dto/scheduleMaintenanceDto';
import NextLaunchDate = ScheduleMaintenanceDto.NextLaunchDate;
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ScheduleMaintenanceService} from '../../../endpoint/schedule-maintenance.service';
import ScheduledTime = ScheduleMaintenanceDto.ScheduledTime;
import {ActionMode} from '../../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {Moment} from "../../../../../shared/shared/tools/date/moment";

@Component({
  selector: 'app-show-scheduled-time',
  templateUrl: './show-scheduled-time.component.html',
  styleUrls: ['./show-scheduled-time.component.scss']
})
export class ShowScheduledTimeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() view;
  @Input() mode;
  @Input() readService;
  @Input() scheduleMaintenanceId: string;
  @Input() scheduleWithTimeAndMetering = new ScheduledTime();
  MyModalSize = ModalSize;
  dateViewMode = DateViewMode;
  NextLaunchDateLis: any[] = [];
  t = 0;
  myMoment = Moment;

  constructor(public scheduleMaintenanceService: ScheduleMaintenanceService
  ) {
  }

  ngOnInit() {

  }


  getListSelf(options?: any) {
    if (!isNullOrUndefined(this.scheduleWithTimeAndMetering.per)) {
      this.scheduleMaintenanceService.getAllFutureDatesOfScheduleMaintenance({
        scheduleMaintenanceId: this.scheduleMaintenanceId
      }).pipe(takeUntilDestroyed(this)).subscribe((res) => {

        this.NextLaunchDateLis = res;
      });
    }
  }

  chooseSelectedItemForEdit(item: NextLaunchDate) {
  }

  chooseSelectedItemForView(item: NextLaunchDate) {
  }

  deleteItem(item: NextLaunchDate) {
  }


  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.readService) {
      this.getListSelf();
    }
  }

}

