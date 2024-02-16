import {Component, OnDestroy, OnInit} from '@angular/core';
import {isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {Toolkit} from '../../../../formBuilder/shared/utility/toolkit';
import {Inbox} from '../../model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {NotificationService} from '../../../endPoint/notification.service';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActivatedRoute} from '@angular/router';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import * as FileSaver from 'file-saver';
import {DownloadService} from '../../../../../shared/service/download.service';
import {Moment} from "../../../../../shared/shared/tools/date/moment";

@Component({
  selector: 'app-inbox-view',
  templateUrl: './inbox-view.component.html',
  styleUrls: ['./inbox-view.component.scss']
})
export class InboxViewComponent implements OnInit, OnDestroy {
  myMoment = Moment;
  toolkit2 = Toolkit2;
  MyToolkit = Toolkit;
  MyToolkit2 = Toolkit2;
  inbox = new Inbox.GetOne();
  user = new UserDto.Create();
  notificationId: string;
  dateViewMode = DateViewMode;

  constructor(private notificationService: NotificationService,
              public location: Location,
              public downloadService: DownloadService,
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
    console.log('notificationId==>', this.notificationId)
    this.notificationService.getOne({notificationId: this.notificationId}).pipe(takeUntilDestroyed(this)).subscribe((res: Inbox.GetOne) => {
      if (res) {
        this.inbox = res;
        // const str = this.inbox.message.replace('<p>,</p>', '');
        // const str = this.inbox.message.slice(4, -5);
        // this.inbox.message = str;
        // console.log('this.inbox.message', this.inbox.message)


      }
    });
  }

  ngOnDestroy(): void {
  }

  fileType(fileName: string ) {
    return fileName.split('.').pop();
  }

  downloadFile(item: Inbox.NotificationUpload) {
      this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
        .subscribe((res: any) => {

          if (!isNullOrUndefined(res)) {
            FileSaver.saveAs(res, item.fileType);
          }
        });
  }
}
