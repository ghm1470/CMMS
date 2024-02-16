import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Inbox} from '../../../inbox/model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Toolkit2} from '@angular-boot/util';
import {NotificationService} from '../../../endPoint/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {UserService} from '../../../../user/endpoint/user.service';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {isNullOrUndefined} from 'util';
import User = Inbox.User;
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;


@Component({
  selector: 'app-trash-list',
  templateUrl: './trash-list.component.html',
  styleUrls: ['./trash-list.component.scss']
})
export class TrashListComponent extends BaseListComponentSeven<trashListNsp.RouteParam, trashListNsp.QueryParam,
  trashListNsp.ComponentData, Inbox.GetTrash>
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() listOnCallback: () => any;
  totalElements = 0;

  dataOfTrashList: trashListNsp.ComponentData;
  // trashList: trashListNsp.ComponentData;
  statusList: any [] = [];
  loading = false;

  roleList = new TokenRoleList();
  //
  trashList: Inbox.GetTrash[] = [];
  showLoader = true;
  user = new UserDto.Create();
  toolkit2 = Toolkit2;
  myMoment = Moment;
  dateViewMode = DateViewMode;
  selectedItemForDelete = new DeleteModel();
  deletedNotification = new DeletedNotificationDTO();
  userList: User[] = [];
  sort = false;
  MyToolkit2 = Toolkit2;

  constructor(
    private cacheService: CacheService,
    public notificationService: NotificationService,
    public activatedRoute: ActivatedRoute,
    private userService: UserService,
    public router: Router) {

    super(activatedRoute, router, trashListNsp.RouteParam, trashListNsp.QueryParam);
    this.dataOfTrashList =
      new trashListNsp.ComponentData(trashListNsp.RouteParam, trashListNsp.QueryParam);
    /**
     * If You want change default values in dataOfTrashList, you can do like blew
     * --> this.dataOfTrashList.init({sizeList: [2, 5, 10, 15]});
     */
    this.dataOfTrashList =
      new trashListNsp.ComponentData(trashListNsp.RouteParam, trashListNsp.QueryParam);
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
    // this._setToQueryParams(this.dataOfTrashList.queryParam);
    this.getRoleListKey();
    this.getAllUser();
  }

  getListOnCallback() {
    return this.listOnCallback;
  }

  getListRemoteArg(optionsOfGetList?: any) {
    return new ListHelper(
      {
        paging: this.dataOfTrashList.queryParamReal.paging,
        term: this.dataOfTrashList.term
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
    this.dataOfTrashList.queryParamReal.paging.page = 0;
    // super.setToQueryParams({page: 0, size: 10});
    this.getListSelf() ;
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

  // getAllTrash() {
  //   this.notificationService.getAllTrash({userId: this.user.id}).pipe(takeUntilDestroyed(this))
  //     .subscribe((res) => {
  //       this.showLoader = false;
  //       if (res && res.length > 0) {
  //         this.trashList = res;
  //       }
  //     });
  // }

  getListSelf(options?: any) {
    this.loading = true;
    // this.sender.receiverUserId = this.user.id;
    if (this.deletedNotification.from) {
      const date = new Date(this.deletedNotification.from);
      date.setHours(date.getHours() + 4);
      date.setMinutes(date.getMinutes() + 30);
      this.deletedNotification.from = date.toISOString();
    }
    if (this.deletedNotification.to) {
      const date = new Date(this.deletedNotification.to);
      date.setHours(date.getHours() + 4);
      date.setMinutes(date.getMinutes() + 30);
      this.deletedNotification.to = date.toISOString();
    }
    this.notificationService.getAllDeletedNotification(this.deletedNotification, {
      paging: this.dataOfTrashList.queryParamReal.paging,
      totalElements: this.dataOfTrashList.itemPage.totalElements,
      term: this.dataOfTrashList.term,
      userId: this.user.id,
      sort: this.sort,

    }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetTrash>) => {
      this.loading = false;
      this.trashList = [];
      this.trashList = res.content;
      // for (let i = 0; i < res.content.length; i++) {
      //   let resTrash: any;
      //   resTrash = res.content[i];
      //
      //   if (!isNullOrUndefined(res.content[i].creationDate)) {
      //
      //     const date = Toolkit2.Moment.getJaliliDateFromIsoOrFull(res.content[i].creationDate);
      //     const faDate = Toolkit2.Common.En2Fa(date);
      //     resTrash.creationDate = faDate;
      //   }
      //   this.trashList.push(resTrash);
      // }
      this.dataOfTrashList.itemPage = res;
    });
  }

  chooseSelectedItemForEdit(item: Inbox.GetTrash) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.EDIT, workOrderStatusId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForView(item: Inbox.GetTrash) {
    this.router.navigate([item.id, ActionMode.VIEW], {
      relativeTo: this.activatedRoute
    });
  }


  deleteItem(event) {
    if (event) {
      this.notificationService.deleteTrash({notificationId: this.selectedItemForDelete.id})
        .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
        if (res) {
          this.dataOfTrashList.itemPage.content = this.dataOfTrashList.itemPage.content
            .filter((e) => {
              return e.notificationId !== this.selectedItemForDelete.id;
            });
          DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
          ModalUtil.hideModal('modalIda' + this.selectedItemForDelete.id);
          this.selectedItemForDelete = new DeleteModel();
        } else if (!res) {
          DefaultNotify.notifyDanger('مشکلی رخ داد.', '', NotiConfig.notifyConfig);
          ModalUtil.hideModal('modalIda' + this.selectedItemForDelete.id);
          this.selectedItemForDelete = new DeleteModel();

        }
      });
    } else if (!event) {
      ModalUtil.hideModal('modalIda' + this.selectedItemForDelete.id);
      this.selectedItemForDelete = new DeleteModel();

    }
  }

  showModalDelete(item, i) {
    this.selectedItemForDelete.loading = false;
    this.selectedItemForDelete.id = item.notificationId;
    this.selectedItemForDelete.title = 'ایا از حذف پیام اطمینان دارید.';
    this.selectedItemForDelete.index = i;
    setTimeout(e => {
      ModalUtil.showModal('modalIda' + this.selectedItemForDelete.id);
    }, 10);
  }

  showNotification(item) {
    console.log('itm', item);
    this.router.navigate(['inbox/view'], {
      queryParams: {notificationId: item.notificationId},
      relativeTo: this.activatedRoute
    });
  }

  onReceiveQueryParam(queryParam: trashListNsp.QueryParam): any {
    super.defaultOnReceiveQueryParam(queryParam);
    this.dataOfTrashList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
  }

  onReceiveRouteParam(routeParam: trashListNsp.RouteParam): any {
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
    this.dataOfTrashList.sortings =
      super.defaultSortify(this.dataOfTrashList.sortings, event);
    this.getList();
  }

  chooseOne(item: Inbox.GetTrash) {
    this.selectedItem.emit(item);
  }

  selectDeselectItem(item: Inbox.GetTrash) {
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

  isInSelected(arg: { item: Inbox.GetTrash, selectedList: Inbox.GetTrash[] }) {
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

  getComponentData(): trashListNsp.ComponentData {
    return this.dataOfTrashList;
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
        mthis.deletedNotification.from =
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
        mthis.deletedNotification.to =
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

export namespace trashListNsp {

  export class ComponentData extends ListComponentData<Inbox.GetTrash, RouteParam, QueryParam> {
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

export class DeletedNotificationDTO {
  senderUserId: string;
  recipientUserId: string;
  subject: string;
  from: string;
  to: string;

}
