import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Inbox} from '../../../inbox/model/inbox';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Toolkit2} from '@angular-boot/util';
import {NotificationService} from '../../../endPoint/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {CacheService} from '../../../../formBuilder/shared/cache-service/cache.service';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {CacheType} from '../../../../formBuilder/shared/cache-service/cache-type.enum';
import {isNullOrUndefined} from 'util';
import {Moment} from '../../../../../shared/shared/tools/date/moment';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
  selector: 'app-system-messages-list',
  templateUrl: './system-messages-list.component.html',
  styleUrls: ['./system-messages-list.component.scss']
})

export class SystemMessagesListComponent extends BaseListComponentSeven<systemMessagesListNsp.RouteParam, systemMessagesListNsp.QueryParam,
  systemMessagesListNsp.ComponentData, Inbox.GetAll>
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() listOnCallback: () => any;
  totalElements = 0;

  dataOfjSystemMessagesList: systemMessagesListNsp.ComponentData;
  systemMessagesList: Inbox.GetAll[] = [];
  loading = false;

  roleList = new TokenRoleList();
  //
  showLoader = true;
  user = new UserDto.Create();
  toolkit2 = Toolkit2;
  myMoment = Moment;
  dateViewMode = DateViewMode;
  selectedItemForDelete = new DeleteModel();
  systemMessagesDate = new SystemMessagesDateDTO();
  sort = false;

  constructor(
    private cacheService: CacheService,
    public notificationService: NotificationService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
    super(activatedRoute, router, systemMessagesListNsp.RouteParam, systemMessagesListNsp.QueryParam);
    this.dataOfjSystemMessagesList =
      new systemMessagesListNsp.ComponentData(systemMessagesListNsp.RouteParam, systemMessagesListNsp.QueryParam);
    /**
     * If You want change default values in dataOfjSystemMessagesList, you can do like blew
     * --> this.dataOfjSystemMessagesList.init({sizeList: [2, 5, 10, 15]});
     */
    this.dataOfjSystemMessagesList =
      new systemMessagesListNsp.ComponentData(systemMessagesListNsp.RouteParam, systemMessagesListNsp.QueryParam);

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
    // this._setToQueryParams(this.dataOfjSystemMessagesList.queryParam);
    this.getRoleListKey();
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  getListOnCallback() {
    return this.listOnCallback;
  }

  getListRemoteArg(optionsOfGetList?: any) {
    return new ListHelper(
      {
        paging: this.dataOfjSystemMessagesList.queryParamReal.paging,
        term: this.dataOfjSystemMessagesList.term
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
    if (this.dataOfjSystemMessagesList.term) {
      this.dataOfjSystemMessagesList.queryParamReal.paging.page = 0;
      this.getListSelf();
    } else {
      this.getListSelf();

    }
  }

  // getAllInbox() {
  //   this.notificationService.getAllInbox({userId: this.user.id}).pipe(takeUntilDestroyed(this))
  //     .subscribe((res: Inbox.GetAllForRecipient[]) => {
  //       if (res) {
  //         this.showLoader = false;
  //         if (res.length > 0) {
  //           this.systemMessagesList = res;
  //         }
  //       }
  //     });
  // }

  // getListSelf(options?: any) {
  //   this.loading = true;
  //   this.notificationService.getPage({
  //     paging: this.dataOfjSystemMessagesList.queryParamReal.paging,
  //     totalElements: this.dataOfjSystemMessagesList.itemPage.totalElements,
  //     term: this.dataOfjSystemMessagesList.term
  //   }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetAll>) => {
  //     this.loading = false;
  //
  //     this.dataOfjSystemMessagesList.itemPage = res;
  //   });
  // }

  getListSelf(options?: any) {
    this.loading = true;
    this.systemMessagesList = [];
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.notificationService.getAllSystemMessagesOfTheUser(this.systemMessagesDate, {
      paging: this.dataOfjSystemMessagesList.queryParamReal.paging,
      totalElements: this.dataOfjSystemMessagesList.itemPage.totalElements,
      term: this.dataOfjSystemMessagesList.term,
      userId: this.user.id,
      sort: this.sort,

    }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetAll>) => {
      this.loading = false;

      for (let i = 0; i < res.content.length; i++) {
        let resSent: any;
        resSent = res.content[i];

        if (!isNullOrUndefined(res.content[i].creationDate)) {

          const date = Toolkit2.Moment.getJaliliDateFromIsoOrFull(res.content[i].creationDate);
          const faDate = Toolkit2.Common.En2Fa(date);
          resSent.creationDate = faDate;
        }
        this.systemMessagesList.push(resSent);
      }
      this.dataOfjSystemMessagesList.itemPage = res;
    });
  }

  changeSort(sort) {
    this.sort = sort;
    this.getListSelf();
  }

  chooseSelectedItemForEdit(item: Inbox.GetAll) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.EDIT, workOrderStatusId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForView(item: Inbox.GetAll) {
    this.router.navigate([item.id, ActionMode.VIEW], {
      relativeTo: this.activatedRoute
    });
  }

  deleteItem(event) {
    if (event) {
      this.notificationService.delete({notificationId: this.selectedItemForDelete.id})
        .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
        if (res) {
          this.dataOfjSystemMessagesList.itemPage.content = this.dataOfjSystemMessagesList.itemPage.content.filter((e) => {
            return e.id !== this.selectedItemForDelete.id;
          });
          ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
          DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
        } else if (!res) {
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

  onReceiveQueryParam(queryParam: systemMessagesListNsp.QueryParam): any {
    super.defaultOnReceiveQueryParam(queryParam);
    this.dataOfjSystemMessagesList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
  }

  onReceiveRouteParam(routeParam: systemMessagesListNsp.RouteParam): any {
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
    this.dataOfjSystemMessagesList.sortings =
      super.defaultSortify(this.dataOfjSystemMessagesList.sortings, event);
    this.getList();
  }

  chooseOne(item: Inbox.GetAll) {
    this.selectedItem.emit(item);
  }

  selectDeselectItem(item: Inbox.GetAll) {
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

  isInSelected(arg: { item: Inbox.GetAll, selectedList: Inbox.GetAll[] }) {
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

  getComponentData(): systemMessagesListNsp.ComponentData {
    return this.dataOfjSystemMessagesList;
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
        mthis.systemMessagesDate.from =
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
        mthis.systemMessagesDate.to =
          mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
      } catch (e) {
        DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
      }
    });


  }

}

export namespace systemMessagesListNsp {

  export class ComponentData extends ListComponentData<Inbox.GetAll, RouteParam, QueryParam> {
    labels: Labels = new Labels();
  }


  class Labels {
    listTitle = ' لیست پیام های دریافت شده';
  }

  export class RouteParam {
  }

  export class QueryParam extends ListQueryParam {
  }
}

export class SystemMessagesDateDTO {
  from: string;
  to: string;

}
