import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Inbox} from '../../model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {UserService} from '../../../../user/endpoint/user.service';
import {NotificationService} from '../../../endPoint/notification.service';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import User = Inbox.User;
import {Toolkit} from '../../../../formBuilder/shared/utility/toolkit';
import SenderReceiver = Inbox.SenderReceiver;
import {isNullOrUndefined} from 'util';
import {DataService} from '../../../../../shared/service/data.service';
import {UploadService} from '../../../../../shared/service/upload.service';
import {ModalUtil} from '@angular-boot/widgets';
import {FileModel} from '../../../../../shared/model/fileModel';
import DocumentFile = Inbox.DocumentFile;
import {CompanyDto} from '../../../../company/model/dto/companyDto';
import NotificationUpload = Inbox.NotificationUpload;
import {Moment} from '../../../../../shared/shared/tools/date/moment';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
  selector: 'app-inbox-action',
  templateUrl: './inbox-action.component.html',
  styleUrls: ['./inbox-action.component.scss']
})
export class InboxActionComponent implements OnInit, OnDestroy {
  actionMode = ActionMode;
  mode: ActionMode = ActionMode.ADD;
  doSave = false;
  inbox = new Inbox.Create();
  dateViewMode = DateViewMode;
  user = new UserDto.Create();
  userList: User[] = [];
  myMoment = Moment;
  toolkit2 = Toolkit2;
  MyToolkit = Toolkit;
  MyToolkit2 = Toolkit2;
  disabledButton = false;
  loading = false;
  //
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log = '';
  // @ts-ignore
  @ViewChild('myckeditor') myckeditor: any;
  //
  files: Array<File> = [];
  fileModel: Array<any> = [];
  //
  finishedUpload = true;
  config;

  constructor(public location: Location,
              private notificationService: NotificationService,
              public uploadService: UploadService,
              private userService: UserService) {
    this.config = {
      toolbarGroups: [
        {name: 'basicstyles', groups: ['basicstyles']},
        {name: 'paragraph', groups: ['align', 'bidi', 'paragraph']},
        // '/',
        // {name: 'styles', groups: ['styles']},
        {name: 'colors', groups: ['colors']},
      ]
    };

  }

  ngOnInit() {
    this.inbox.message = `<p dir="rtl" >متن پیام شما</p>`;
    this.getCreationDate();
    // this.createNotification();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.getAllUser();
    this.inbox.senderUserId = this.user.id;

  }

  onChange($event: any): void {
    console.log('onChange');
  }

  onPaste($event: any): void {
    console.log('onPaste');
  }

  cancel() {
    this.location.back();
  }

  // createNotification() {
  //   this.notificationService.createNotification().pipe(takeUntilDestroyed(this)).subscribe((res: Inbox.Create) => {
  //     if (res) {
  //       this.inbox.creationDate = res.creationDate;
  //       console.log('this.inbox.creationDate', this.inbox.creationDate);
  //       this.inbox.id = res.id;
  //     }
  //   });
  // }
  getCreationDate() {
    this.notificationService.getCreationDate().pipe(takeUntilDestroyed(this)).subscribe(res => {
      if (res) {
        this.inbox.creationDate = res.creationDate;
        console.log('this.inbox.creationDate', this.inbox.creationDate);
        // this.inbox.id = res.id;
      }
    });
  }

  action(form) {
    this.doSave = true;
    if (this.finishedUpload === false) {
      DefaultNotify.notifyDanger('در حال آپلود فایل , لطفا منتظر بمانید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (!this.inbox.recipientUserId) {
      DefaultNotify.notifyDanger('گیرنده را وارد کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (!this.inbox.subject) {
      DefaultNotify.notifyDanger('موضوع پیام را وارد کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (!this.inbox.message) {
      DefaultNotify.notifyDanger('متن پیام خود را وارد کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (form.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      if (!this.inbox.subject) {
        this.stringLength(this.inbox.subject, 'subject');
      }
      return;
    }

    this.inbox.senderReceiver = SenderReceiver[SenderReceiver.SENDER.toString()];
    // const str = this.inbox.message.slice(4, -5);
    // this.inbox.message = str;
    // console.log('this.inbox.message', this.inbox.message)
    console.log(' this.inbox', this.inbox);

    if (this.mode === ActionMode.ADD) {
      this.loading = true;
      this.notificationService.createNotification(this.inbox)
        .pipe(takeUntilDestroyed(this)).subscribe((res) => {
        this.loading = false;
        DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
        form.reset();
        this.cancel();
      });
    }
  }

  getAllUser() {
    this.userService.getAllUsersExceptOne({userId: this.user.id}).pipe(takeUntilDestroyed(this))
      .subscribe((res: User[]) => {
        if (res && res.length) {
          this.userList = res;
          console.log(' this.userList=>', this.userList);
        }
      });
  }

  stringLength(value, id) {
    console.log('value', value);
    console.log('id', id);
    if (!isNullOrUndefined(value)) {
      value = value.trim();
      if (value.length === 0) {
        $('#' + id).addClass('is-invalid').removeClass('is-valid');
        $('#form').addClass('ng-invalid').removeClass('ng-valid');
        return false;
      } else {
        $('#' + id).addClass('is-valid').removeClass('is-invalid');
        $('#form').addClass('ng-valid').removeClass('ng-invalid');
        return true;

      }
    } else if (isNullOrUndefined(value)) {
      $('#' + id).addClass('is-invalid').removeClass('is-valid');
      $('#form').addClass('ng-invalid').removeClass('ng-valid');
      // return false;
      return true;
    }
  }


  ngOnDestroy(): void {
  }


  changeDocumentList(event: any[]) {
    console.log('event', event);
    this.inbox.notificationUploadList = [];
    for (const item of event) {
      const file = new NotificationUpload();
      file.id = item.id;
      file.name = item.showName;
      file.fileType = item.fileName;
      this.inbox.notificationUploadList.push(file);
    }
    console.log('evthis.inbox.notificationUploadListent', this.inbox.notificationUploadList);

  }

  getFormData(event) {
    console.log('eventgetFormData', event);
    this.inbox.formData = event;

  }

  allowToSaveAfterUpload(event) {
    console.log('allowToSaveAfterUpload', event);
    this.finishedUpload = event;
  }

  trim() {
    this.inbox.subject = this.inbox.subject.trim();
  }
}
