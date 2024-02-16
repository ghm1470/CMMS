import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Inbox} from '../../../inbox/model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {ActionMode, DefaultNotify, EnumHandle, ListHelper, PageContainer, Toolkit2} from '@angular-boot/util';
import {NotificationService} from '../../../endPoint/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {ModalUtil} from "@angular-boot/widgets";
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from "@angular-boot/common";
import {TokenRoleList} from "../../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../../shared/constants/cacheKeys";
import {isNullOrUndefined} from "util";
import {DeleteModel} from "../../../../../shared/conferm-delete/model/delete-model";
import User = Inbox.User;
import {UserService} from "../../../../user/endpoint/user.service";
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
  selector: 'app-sent-list',
  templateUrl: './sent-list.component.html',
  styleUrls: ['./sent-list.component.scss']
})
export class SentListComponent extends BaseListComponentSeven<sentListNsp.RouteParam, sentListNsp.QueryParam,
  sentListNsp.ComponentData, Inbox.GetAllForSender>
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() listOnCallback: () => any;
  totalElements = 0;

  dataOfSentList: sentListNsp.ComponentData;
  // sentList: sentListNsp.ComponentData;
  statusList: any [] = [];
  loading = false;

  roleList = new TokenRoleList();
  //
  sentList: Inbox.GetAllForSender[] = [];
  showLoader = true;
  user = new UserDto.Create();
  toolkit2 = Toolkit2;
  myMoment = Moment;
  dateViewMode = DateViewMode;
  selectedItemForDelete = new DeleteModel();
  sender = new SenderDTO();
  userList: User[] = [];
  sort = false;
  MyToolkit2 = Toolkit2;

  constructor(
    private cacheService: CacheService,
    public notificationService: NotificationService,
    public activatedRoute: ActivatedRoute,
    private userService: UserService,
    public router: Router) {

    super(activatedRoute, router, sentListNsp.RouteParam, sentListNsp.QueryParam);
    this.dataOfSentList =
      new sentListNsp.ComponentData(sentListNsp.RouteParam, sentListNsp.QueryParam);
    /**
     * If You want change default values in dataOfSentList, you can do like blew
     * --> this.dataOfSentList.init({sizeList: [2, 5, 10, 15]});
     */
    this.dataOfSentList =
      new sentListNsp.ComponentData(sentListNsp.RouteParam, sentListNsp.QueryParam);
    this.user = JSON.parse(sessionStorage.getItem('user'));

    // this.sender.receiverUserId = this.user.id;
    this.fireInitiatePagination();
    super.receiveData();
  }

  canDeactivate(): boolean {
    return true;
  }

  private fireInitiatePagination() {
    this.initiatePagination({size: 10});
  }

  private fireResetPagination() {
    this.resetPagination({size: 10});
  }

  ngOnInit() {
    // this._setToQueryParams(this.dataOfSentList.queryParam);
    this.getRoleListKey();
  }

  getListOnCallback() {
    return this.listOnCallback;
  }

  getListRemoteArg(optionsOfGetList?: any) {
    return new ListHelper(
      {
        paging: this.dataOfSentList.queryParamReal.paging,
        term: this.dataOfSentList.term
      }
    );
  }

  getRoleListKey() {
    this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }

  getListByFilter() {
    if (this.dataOfSentList.term) {
      this.dataOfSentList.queryParamReal.paging.page = 0;
      this.getListSelf();
    } else {
      this.getListSelf();

    }
  }


  getAllUser() {
    this.userList = [];
    this.userService.getAllUsersExceptOne({userId: this.user.id}).pipe(takeUntilDestroyed(this))
      .subscribe((res: User[]) => {
        if (res && res.length) {
          this.userList = res;
        }
      });
  }

  // getAllSent() {
  //   this.notificationService.getAllSent({userId: this.user.id}).pipe(takeUntilDestroyed(this))
  //     .subscribe((res) => {
  //       this.showLoader = false;
  //       if (res && res.length > 0) {
  //         this.sentList = res;
  //       }
  //     });
  // }

  getListSelf(options?: any) {
    this.loading = true;
    // this.sender.receiverUserId = this.user.id;
    if (this.sender.from) {
      const date = new Date(this.sender.from);
      date.setHours(date.getHours() + 4);
      date.setMinutes(date.getMinutes() + 30);
      this.sender.from = date.toISOString();
    }
    if (this.sender.to) {
      const date = new Date(this.sender.to);
      date.setHours(date.getHours() + 4);
      date.setMinutes(date.getMinutes() + 30);
      this.sender.to = date.toISOString();
    }
    this.notificationService.getAllSenderUserInformation(this.sender, {
      paging: this.dataOfSentList.queryParamReal.paging,
      totalElements: this.dataOfSentList.itemPage.totalElements,
      term: this.dataOfSentList.term,
      userId: this.user.id,
      sort: this.sort,

    }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetAllForSender>) => {
      this.loading = false;
      this.sentList = [];

      for (let i = 0; i < res.content.length; i++) {
        let resSent: any;
        resSent = res.content[i];

        // if (!isNullOrUndefined(res.content[i].creationDate)) {
        //
        //   const date = Toolkit2.Moment.getJaliliDateFromIsoOrFull(res.content[i].creationDate);
        //   const faDate = Toolkit2.Common.En2Fa(date);
        //   resSent.creationDate = faDate;
        // }
        this.sentList.push(resSent);
      }
      this.dataOfSentList.itemPage = null;
      this.dataOfSentList.itemPage = res;
    });
  }

  chooseSelectedItemForEdit(item: Inbox.GetAllForSender) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.EDIT, workOrderStatusId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForView(item: Inbox.GetAllForSender) {
    this.router.navigate([item.id, ActionMode.VIEW], {
      relativeTo: this.activatedRoute
    });
  }


  deleteItem(event) {

    if (event) {
      this.notificationService.deleteNotification({notificationId: this.selectedItemForDelete.id,
        senderOrReceiver: 'SENDER'
      })
        .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
        if (res) {
          this.sentList = this.sentList
            .filter((e) => {
              return e.notificationId !== this.selectedItemForDelete.id;
            });
          DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
          ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        } else if (!res) {
          DefaultNotify.notifyDanger('مشکلی رخ داد.', '', NotiConfig.notifyConfig);

          ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
      });
    } else if (!event) {
      ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
    }
  }

  showModalDelete(item, i) {
    this.selectedItemForDelete.loading = false;
    this.selectedItemForDelete.id = item.notificationId;

    this.selectedItemForDelete.title = ' آیا پیام ارسالی به    ' + item.userName + ' ' + item.userFamily + ' حذف  شود؟ ';
    this.selectedItemForDelete.index = i;
    setTimeout(e => {
      ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
    }, 10);
  }

  showNotification(item) {
    this.router.navigate(['inbox/view'], {
      queryParams: {notificationId: item.notificationId},
      relativeTo: this.activatedRoute
    });
  }

  onReceiveQueryParam(queryParam: sentListNsp.QueryParam): any {
    super.defaultOnReceiveQueryParam(queryParam);
    this.dataOfSentList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
  }

  onReceiveRouteParam(routeParam: sentListNsp.RouteParam): any {
    this.fireResetPagination();
    this.hardSyncQueryParamReal();
    this.getList();
  }

  onReceiveRouteData(routeData: any): any {
  }

  onChangedTerm() {
    this.getList();
  }

  public _setToQueryParams(queryParam) {
    super.setToQueryParams(queryParam);
  }

  sortify(event) {
    this.dataOfSentList.sortings =
      super.defaultSortify(this.dataOfSentList.sortings, event);
    this.getList();
  }

  chooseOne(item: Inbox.GetAllForSender) {
    this.selectedItem.emit(item);
  }

  selectDeselectItem(item: Inbox.GetAllForSender) {
    if (this.selectedList.filter(e => e.id === item.id).length > 0) {
      this.selectedList
        .splice(this.selectedList.map(e => e.id)
          .indexOf(item.id), 1);
      this.deSelectedItem.emit(item);
    } else {
      this.selectedList.push(item);
      this.selectedItem.emit(item);
    }
  }

  isInSelected(arg: { item: Inbox.GetAllForSender, selectedList: Inbox.GetAllForSender[] }) {
    if (isNullOrUndefined(arg.selectedList)) {
      return false;
    }
    // const b = arg.selectedList.includes(arg.item);
    let b: boolean;
    if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
      b = true;
    } else {
      b = false;
    }
    return b;
  }

  onChooseMultiMode() {
  }

  onChooseOneMode() {
  }

  onDefaultMode() {
  }

  getComponentData(): sentListNsp.ComponentData {
    return this.dataOfSentList;
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    const mthis = this;
    $('#startDate').azPersianDateTimePicker({
      Placement: 'left', // default is 'bottom'
      Trigger: 'focus', // default is 'focus',
      enableTimePicker: false, // default is true,
      TargetSelector: '', // default is empty,
      GroupId: '', // default is empty,
      ToDate: false, // default is false,
      FromDate: false, // default is false,
      targetTextSelector: $('#startDate'),
      disableBeforeToday: false
    }).on('change', (e) => {
      try {
        mthis.sender.from =
          mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
      } catch (e) {
        DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
      }
    });
    $('#endDate').azPersianDateTimePicker({
      Placement: 'left', // default is 'bottom'
      Trigger: 'focus', // default is 'focus',
      enableTimePicker: false, // default is true,
      TargetSelector: '', // default is empty,
      GroupId: '', // default is empty,
      ToDate: false, // default is false,
      FromDate: false, // default is false,
      targetTextSelector: $('#endDate'),
      disableBeforeToday: false
    }).on('change', (e) => {
      try {
        mthis.sender.to =
          mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
      } catch (e) {
        DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
      }
    });


  }

  changeSort(sort) {

    this.sort = sort;
    this.getListSelf();

  }
}

export namespace sentListNsp {

  export class ComponentData extends ListComponentData<Inbox.GetAllForSender, RouteParam, QueryParam> {
    labels: Labels = new Labels();
  }


  class Labels {
    listTitle = ' لیست پیام های ارسال شده';
  }

  export class RouteParam {
  }

  export class QueryParam extends ListQueryParam {
  }
}

export class SenderDTO {
  receiverUserId: string;
  from: string;
  to: string;

}
