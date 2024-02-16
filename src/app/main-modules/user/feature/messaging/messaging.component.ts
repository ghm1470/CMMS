import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserDto} from '../../model/dto/user-dto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {MessagingService} from '../../endpoint/messaging.service';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() mode: ActionMode;
  actionMode = ActionMode;
  Messaging = new UserDto.Messaging();
  MessagingCopy = new UserDto.Messaging();

  constructor(private messagingService: MessagingService) {
  }

  ngOnInit() {
    this.getOne();
  }

  getOne() {
    this.messagingService.getOne({userId: this.userId}).pipe(takeUntilDestroyed(this)).subscribe((res: UserDto.Messaging) => {
      if (res) {
        this.Messaging = res;
        this.MessagingCopy = JSON.parse(JSON.stringify(res));
      }
    });
  }

  action(form) {
    if (JSON.stringify(this.Messaging) !== JSON.stringify(this.MessagingCopy)) {
      this.Messaging.userId = this.userId;
      this.messagingService.update(this.Messaging)
        .pipe(takeUntilDestroyed(this)).subscribe(res => {
        if (res) {
          this.MessagingCopy = JSON.parse(JSON.stringify(this.Messaging));
          DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
        } else {
          // DefaultNotify.notifyDanger('تغییری دراطلاعات ثبت شده ایجاد نکرده اید.');

        }
      });
    } else {
      DefaultNotify.notifyDanger('تغییری دراطلاعات ثبت شده ایجاد نکرده اید.', '', NotiConfig.notifyConfig);
    }
  }

  ngOnDestroy(): void {
  }

  checkbox() {
  }
}
