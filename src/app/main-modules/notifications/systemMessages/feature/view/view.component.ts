import {Component, OnDestroy, OnInit} from '@angular/core';
import {Inbox} from '../../../inbox/model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {Toolkit2} from '@angular-boot/util';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {NotificationService} from '../../../endPoint/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Toolkit} from '../../../../formBuilder/shared/utility/toolkit';
import {Location} from '@angular/common';
import {Moment} from "../../../../../shared/shared/tools/date/moment";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  myMoment = Moment;
  toolkit2 = Toolkit2;
  MyToolkit = Toolkit;
  MyToolkit2 = Toolkit2;
  inbox = new Inbox.GetOne();
  user = new UserDto.Create();
  notificationId: string;

  constructor(private notificationService: NotificationService,
              public location: Location,
              public activatedRoute: ActivatedRoute) {
    this.notificationId = this.activatedRoute.snapshot.queryParams.notificationId;
  }

  ngOnInit() {
    this.getOne();
  }

  cancel() {
    this.location.back();
  }

  getOne() {
    console.log('notificationId==>', this.notificationId);
    this.notificationService.getOneSystemMessage(
      {notificationId: this.notificationId}).pipe(takeUntilDestroyed(this)).subscribe((res: Inbox.GetOne) => {
      if (res) {
        this.inbox = res;
      }
    });
  }

  ngOnDestroy(): void {
  }
}
