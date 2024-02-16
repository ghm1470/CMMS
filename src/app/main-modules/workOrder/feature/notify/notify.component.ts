import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {UserDto} from '../../../user/model/dto/user-dto';
import {NotifyService} from '../../endpoint/notify.service';
import {UserService} from '../../../user/endpoint/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {Notify, UserTow} from './model/notify';
import {NotifyEvent} from './model/notifyEvent';
import {DataService} from '../../../../shared/service/data.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit, OnDestroy {
  disabledButton = false;
  @Input() referenceId: string;
  @Input() modeW;
  @Input() typeOfNotification: string;
  @Input() formStatus: string;
  notifyList: Notify[] = [];
  notify: Notify;
  selectedIndex: number;
  actionMode = ActionMode;
  mode = ActionMode.ADD;
  myPattern = MyPattern;
  doSave = false;
  notifyEventList = [] as EnumObject[];
  userList: UserDto.Create[] = [];
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  loading = false;
  showSelect = true;

  constructor(public notifyService: NotifyService,
              public userService: UserService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.notifyEventList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<NotifyEvent>(NotifyEvent));
    this.notify = new Notify(this.referenceId);
  }

  ngOnInit() {
    this.getUserList();
    this.notifyService.getNotifyListByReferenceId({referenceId: this.referenceId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: Notify[]) => {
        if (res && res.length) {
          this.notifyList = res;
        }
      });
  }

  getUserList() {
    this.userService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: UserDto.Create[]) => {
        if (res && res.length) {
          this.userList = res;
        }
      });
  }

  chooseSelectedItemForEdit(item: Notify, i) {
    this.selectedIndex = i;
    this.notify = JSON.parse(JSON.stringify(item));
    this.mode = ActionMode.EDIT;
    ModalUtil.showModal('notifyModal2');
  }

  deleteItem(item: Notify) {
    this.notifyService.delete({notifyId: item.id})
      .pipe(takeUntilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.notifyList = this.notifyList.filter((e) => {
          return e.id !== item.id;
        });
        DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
      }
    });
  }

  addNewNotify() {
    this.notify = new Notify(this.referenceId);
    this.mode = ActionMode.ADD;
    ModalUtil.showModal('notifyModal2');
  }

  ngOnDestroy(): void {
  }


  action() {
    this.doSave = true;
    if (isNullOrUndefined(this.notify.user) || isNullOrUndefined(this.notify.user.id)) {
      DefaultNotify.notifyDanger('کاربر را انتخاب کنید', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.notify.events.length < 1) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.mode === ActionMode.ADD) {
      if (this.typeOfNotification === 'scheduleMaintenance') {
        this.notifyService.createScheduleMaintenance(this.notify)
          .pipe(takeUntilDestroyed(this)).subscribe((res: Notify) => {
          if (res && res.id) {
            // =================================================================
            if (this.formStatus === 'pending') {
              if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.update(this.workOrderAndFormRepository).
                pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                  if (resTree) {
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                  if (resTow) {
                    this.workOrderAndFormRepository.id = resTow;
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              }
            }

            // =================================================================
            DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
            this.notifyList.push(res);
            ModalUtil.hideModal('notifyModal2');
            this.notify = new Notify(this.referenceId);
          } else {
            DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
          }
        });
      } else if (this.typeOfNotification === 'workOrder') {
        this.notifyService.create(this.notify)
          .pipe(takeUntilDestroyed(this)).subscribe((res: Notify) => {
          if (res && res.id) {
            // =================================================================
            if (this.formStatus === 'pending') {
              // this.workOrderAndFormRepository.notify = this.notify;
              // DataService.setWAFRepository(this.workOrderAndFormRepository);
              if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                  if (resTree) {
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                  if (resTow) {
                    this.workOrderAndFormRepository.id = resTow;
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              }
            }
            // =================================================================
            DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
            this.notifyList.push(res);
            ModalUtil.hideModal('notifyModal2');
            this.notify = new Notify(this.referenceId);
          } else {
            DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
          }
        });
      }

    } else if (this.mode === ActionMode.EDIT) {
      if (this.typeOfNotification === 'scheduleMaintenance') {
        this.notifyService.updateScheduleMaintenance(this.notify, {notifyId: this.notify.id})
          .pipe(takeUntilDestroyed(this)).subscribe((res) => {
          if (res) {
            for (const item of this.notifyList) {
              if (item.id === this.notify.id) {
                item.user = this.notify.user;
                item.events = this.notify.events;
              }
            }
            ModalUtil.hideModal('notifyModal2');
            this.notify = new Notify(this.referenceId);
            DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            // =================================================================
            if (this.formStatus === 'pending') {
              // this.workOrderAndFormRepository.notify = this.notify;
              // DataService.setWAFRepository(this.workOrderAndFormRepository);
              if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.update(this.workOrderAndFormRepository)
                  .pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                  if (resTree) {
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                  if (resTow) {
                    this.workOrderAndFormRepository.id = resTow;
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              }
            }
            // =================================================================
          } else {
            DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
          }
        });
      } else if (this.typeOfNotification === 'workOrder') {
        this.notifyService.update(this.notify, {notifyId: this.notify.id})
          .pipe(takeUntilDestroyed(this)).subscribe((res) => {
          if (res) {
            for (const item of this.notifyList) {
              if (item.id === this.notify.id) {
                item.user = this.notify.user;
                item.events = this.notify.events;
              }
            }
            ModalUtil.hideModal('notifyModal2');
            this.notify = new Notify(this.referenceId);
            // =================================================================
            if (this.formStatus === 'pending') {
              // this.workOrderAndFormRepository.notify = this.notify;
              // DataService.setWAFRepository(this.workOrderAndFormRepository);
              if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                  if (resTree) {
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                  if (resTow) {
                    this.workOrderAndFormRepository.id = resTow;
                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                  }
                });
              }
            }
            // =================================================================
            DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
          } else {
            DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
          }
        });
      }
    }
  }

  cancelModal() {
    ModalUtil.hideModal('notifyModal2');
  }

  checkNotify(item) {
    if (this.notify.events.indexOf(item._value) === -1) {
      this.notify.events.push(item._value);
    } else {
      this.notify.events = this.notify.events.filter(event => event !== item._value);
    }
  }

  addUserToNotify() {
    if (!isNullOrUndefined(this.notify.user.id)) {
      const hasUser = this.notifyList.find(item => item.user.id === this.notify.user.id);
      if (!hasUser) {
        this.notify.user.name = this.userList.find(user => user.id === this.notify.user.id).name;
        this.notify.user.family = this.userList.find(user => user.id === this.notify.user.id).family;
      } else {
        this.showSelect = false;
        this.notify.user = new UserTow();
        DefaultNotify.notifyDanger('برای این کاربر از قبل آگاه سازی زده شده است.', '', NotiConfig.notifyConfig);
        setTimeout(() => {
          this.showSelect = true;
        }, 100);
      }

    }
  }

  checkNotifyChecked(value: any) {
    if (this.notify.events.indexOf(value) === -1) {
      return false;
    }
    return true;
  }
}
