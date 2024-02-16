import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Notify} from '../notify/model/notify';
import {ActionMode, DefaultNotify, isNullOrUndefined, PageContainer, Paging} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {NotifyService} from '../../endpoint/notify.service';
import {UserService} from '../../../user/endpoint/user.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {NotifyEvent} from '../notify/model/notifyEvent';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {UserType} from "../../../securityManagement/model/userType";
import {AssetTemplatePersonnelDTO, AssignedToGroup} from "../../../assetTemplate/endpoint/asset-template.service";
import {UserTypeService} from "../../../securityManagement/endpoint/user-type.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-notify-work-table',
  templateUrl: './notify-work-table.component.html',
  styleUrls: ['./notify-work-table.component.scss']
})
export class NotifyWorkTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workOrderId: string;
  @Input() activityInstanceId: string;
  @Input() activityLevelId: string;
  @Input() numberOfParticipation: number;
  @Input() isView: boolean;
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  @Output() nextCarousel = new EventEmitter<boolean>();
  existedAlreadySaveForWAR: boolean;
  disabledButton = false;
  notifyList: Notify[] = [];
  notify: Notify;
  selectedIndex: number;
  actionMode = ActionMode;
  mode = ActionMode.ADD;
  myPattern = MyPattern;
  doSave = false;
  notifyEventList = [] as EnumObject[];
  userList: UserDto.Create[] = [];
  loading = false;

  constructor(public notifyService: NotifyService,
              public userService: UserService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public userTypeService: UserTypeService,
              public router: Router) {
    this.notifyEventList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<NotifyEvent>(NotifyEvent));
    this.notify = new Notify(this.workOrderId);
  }

  ngOnInit() {
    DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
      if (res) {
        this.existedAlreadySaveForWAR = res;
      }
    });
    // this.getUserList();
    this.getAllUserType();
    this.getNotifyListByReferenceId();
  }

  getNotifyListByReferenceId() {
    this.notifyService.getNotifyListByReferenceId({referenceId: this.workOrderId}).pipe(takeUntilDestroyed(this))
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

///// کاربر
  userTypeList2: UserType[] = [];
  loadingUserTypeList2 = true;
  selectedUserTypeId2: string;
  userList2: UserDto.Create[] = [];
  loadingUserList2 = false;

  allowGetAllUserType = true;
  assetTemplateUsers: AssetTemplatePersonnelDTO[] = [];
  assignedToGroupList: AssignedToGroup[] = [];

  getAllUserType() {
    if (this.allowGetAllUserType) {
      this.loadingUserTypeList2 = true;
      this.allowGetAllUserType = false;
      this.userTypeService.getAllRole()
          .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        this.loadingUserTypeList2 = false;
        if (!isNullOrUndefined(res)) {
          this.userTypeList2 = res;
        }
      });
    }
  }

  changeUserType(event: UserType) {
    this.notify.user.id = null;
    this.userList2 = [];
    if (event) {
      this.selectedUserTypeId2 = event.id;
      this.getAllUsersOfUserType();
    }

  }

  getAllUsersOfUserType() {
    const paging = new Paging();
    paging.size = 15;
    this.loadingUserList2 = true;
    this.userService.getAllUsersOfUserType({paging, totalElements: 0, userTypeId: this.selectedUserTypeId2})
        .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
      this.loadingUserList2 = false;
      if (this.userList2.length === 0) {
        this.userList2 = res.content;
      } else {
        this.userList2 = this.userList2.concat(res.content);
      }
      // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

    });
  }

///// !!!کاربر
  chooseSelectedItemForEdit(item: Notify, i) {
    this.selectedIndex = i;
    this.notify = item;
    this.mode = ActionMode.EDIT;
    ModalUtil.showModal('notifyModal');
  }

  deleteItem(item: Notify) {
    this.notifyService.delete({notifyId: item.id})
      .pipe(takeUntilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.notifyList = this.notifyList.filter((e) => {
          return e.id !== item.id;
        });
        setTimeout(() => {
          // this.workOrderAndFormRepository.notifyList = this.notifyList;
          this.workOrderRepositoryService.deleteNotify({
            activityInstanceId: this.activityInstanceId
            , activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation,
            notifyId: item.id
          }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
            if (resTow) {
            }
          });
        }, 100);
        DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
      }
    });
  }

  addNewNotify() {
    this.notify = new Notify(this.workOrderId);
    this.mode = ActionMode.ADD;
    ModalUtil.showModal('notifyModal');
  }

  ngOnDestroy(): void {
  }


  action() {
    this.doSave = true;
    if (isNullOrUndefined(this.notify.user) || isNullOrUndefined(this.notify.user.id) ||
      this.notify.events.length < 1) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if ((!this.existedAlreadySaveForWAR)) {
            this.workOrderRepositoryService.createNotifyInFirstTime(this.notify,
              {
                workOrderId: this.workOrderId,
                activityInstanceId: this.activityInstanceId,
                activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
              }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
              if (resOne) {
                DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                DataService.setExistedAlreadySaveForWAR(true);
                this.notifyList.push(this.notify);
                this.cancelModal();
              }
            });
          } else if (this.existedAlreadySaveForWAR) {
            this.workOrderRepositoryService.createNotifyAfterFirstTime(this.notify,
              {
                workOrderId: this.workOrderId,
                activityInstanceId: this.activityInstanceId,
                activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
              }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
              if (resTow) {
                this.notifyList.push(this.notify);
                DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                this.cancelModal();
              }
            });
          }
  }

  cancelModal() {
    ModalUtil.hideModal('notifyModal');
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
      this.notify.user.name = this.userList2.find(user => user.id === this.notify.user.id).name;
      this.notify.user.family = this.userList2.find(user => user.id === this.notify.user.id).family;
    }
  }

  checkNotifyChecked(value: any) {
    if (this.notify.events.indexOf(value) === -1) {
      return false;
    }
    return true;
  }

  nextOrPrev(item) {
    if (item === 'next') {
      this.nextCarousel.emit(true);
    }
    if (item === 'prev') {
      this.nextCarousel.emit(false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (!isNullOrUndefined(changes.notificationDTO)) {
    //   this.notifyList = this.notificationDTO;
    // }
  }
}
