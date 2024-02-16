import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Toolkit2} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UserDto} from '../../../../user/model/dto/user-dto';
import {Inbox} from '../../model/inbox';
import {NotificationService} from '../../../endPoint/notification.service';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {ModalUtil} from "@angular-boot/widgets";
import {DeleteModel} from "../../../../../shared/conferm-delete/model/delete-model";
import {TokenRoleList} from "../../../../../shared/shared/constants/tokenRoleList";
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from "@angular-boot/common";
import {isNullOrUndefined} from "util";
import {CacheService} from "../../../../formBuilder/shared/cache-service/cache.service";
import {CacheType} from "../../../../formBuilder/shared/cache-service/cache-type.enum";
import {Auth} from "../../../../../shared/constants/cacheKeys";
import User = Inbox.User;
import {UserService} from "../../../../user/endpoint/user.service";
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-inbox-list',
    templateUrl: './inbox-list.component.html',
    styleUrls: ['./inbox-list.component.scss']
})


export class InboxListComponent extends BaseListComponentSeven<inboxListNsp.RouteParam, inboxListNsp.QueryParam,
    inboxListNsp.ComponentData, Inbox.GetAllForSender>
    implements OnInit, OnDestroy, AfterViewInit {
    @Input() listOnCallback: () => any;
    totalElements = 0;

    dataOfjInboxList: inboxListNsp.ComponentData;
    inboxList: Inbox.GetAllForSender[] = [];
    loading = false;

    roleList = new TokenRoleList();
    //
    showLoader = true;
    user = new UserDto.Create();
    toolkit2 = Toolkit2;
    myMoment = Moment;
    dateViewMode = DateViewMode;
    selectedItemForDelete = new DeleteModel();
    senderInfo = new SenderInfoDTO();
    sort = false;
    //
    userList: User[] = [];

    constructor(
        private cacheService: CacheService,
        public notificationService: NotificationService,
        public activatedRoute: ActivatedRoute,
        private userService: UserService,
        public router: Router) {
        super(activatedRoute, router, inboxListNsp.RouteParam, inboxListNsp.QueryParam);
        this.dataOfjInboxList =
            new inboxListNsp.ComponentData(inboxListNsp.RouteParam, inboxListNsp.QueryParam);
        /**
         * If You want change default values in dataOfjInboxList, you can do like blew
         * --> this.dataOfjInboxList.init({sizeList: [2, 5, 10, 15]});
         */
        this.dataOfjInboxList =
            new inboxListNsp.ComponentData(inboxListNsp.RouteParam, inboxListNsp.QueryParam);
        this.user = JSON.parse(sessionStorage.getItem('user'));

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
        // this._setToQueryParams(this.dataOfjInboxList.queryParam);
        this.getRoleListKey();
    }

    getListOnCallback() {
        return this.listOnCallback;
    }

    getListRemoteArg(optionsOfGetList?: any) {
        return new ListHelper(
            {
                paging: this.dataOfjInboxList.queryParamReal.paging,
                term: this.dataOfjInboxList.term
            }
        );
    }

    getAllUser() {
        this.userList = [];
        this.userService.getAllUsersExceptOne({userId: this.user.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: User[]) => {
                if (res && res.length) {
                    this.userList = res;
                    console.log(' this.userList=>', this.userList);
                }
            });
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getListByFilter() {
        if (this.dataOfjInboxList.term) {
            this.dataOfjInboxList.queryParamReal.paging.page = 0;
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
    //           this.inboxList = res;
    //           console.log(this.inboxList);
    //         }
    //       }
    //     });
    // }

    // getListSelf(options?: any) {
    //   this.loading = true;
    //   // this.notificationService.getPage({
    //   //   paging: this.dataOfjInboxList.queryParamReal.paging,
    //   //   totalElements: this.dataOfjInboxList.itemPage.totalElements,
    //   //   term: this.dataOfjInboxList.term
    //   // }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetAllForSender>) => {
    //   //   this.loading = false;
    //   //
    //   //   this.dataOfjInboxList.itemPage = res;
    //   //   console.log(this.dataOfjInboxList);
    //   // });
    // }
    getListSelf(options?: any) {
        this.loading = true;
        // this.inboxList = [];
        console.log('this.sender', this.senderInfo)
        this.notificationService.getAllPrivateMessagesOfTheUser(this.senderInfo, {
            paging: this.dataOfjInboxList.queryParamReal.paging,
            totalElements: this.dataOfjInboxList.itemPage.totalElements,
            term: this.dataOfjInboxList.term,
            userId: this.user.id,
            sort: this.sort,

        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Inbox.GetAllForSender>) => {
            this.loading = false;
            this.inboxList = [];

            console.log('res================>', res);
            if (res) {
                this.inboxList = res.content
                // for (let i = 0; i < res.content.length; i++) {
                //   let resSent: any;
                //   resSent = res.content[i];
                //
                //   if (!isNullOrUndefined(res.content[i].creationDate)) {
                //
                //     const date = Toolkit2.Moment.getJaliliDateFromIsoOrFull(res.content[i].creationDate);
                //     const faDate = Toolkit2.Common.En2Fa(date);
                //     resSent.creationDate = faDate;
                //   }
                //   this.inboxList.push(resSent);
                //
                // }
                console.log('this.inboxList', this.inboxList)

                this.dataOfjInboxList.itemPage = res;

                console.log('dataOfjInboxList', this.dataOfjInboxList);
            }

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
        console.log('this.selectedItemForDelete.id', this.selectedItemForDelete.id)

        if (event) {
            this.notificationService.deleteNotification({
                notificationId: this.selectedItemForDelete.id,
                senderOrReceiver: 'RECEIVER'
            })
                .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
                if (res) {
                    this.inboxList = this.inboxList
                        .filter((e) => {
                            return e.notificationId !== this.selectedItemForDelete.id;
                        });
                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
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
        this.selectedItemForDelete.title = ' آیا پیام دریافتی از    ' + item.senderName + ' ' + item.senderFamilyName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    showNotification(item) {
        console.log('item', item);
        this.router.navigate(['view'], {
            queryParams: {notificationId: item.notificationId},
            relativeTo: this.activatedRoute
        });
    }

    changeSort(sort) {
        this.sort = false;
        this.getListSelf();
        console.log('this.sort', this.sort);
    }

    onReceiveQueryParam(queryParam: inboxListNsp.QueryParam): any {
        super.defaultOnReceiveQueryParam(queryParam);
        this.dataOfjInboxList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
    }

    onReceiveRouteParam(routeParam: inboxListNsp.RouteParam): any {
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
        this.dataOfjInboxList.sortings =
            super.defaultSortify(this.dataOfjInboxList.sortings, event);
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

    getComponentData(): inboxListNsp.ComponentData {
        return this.dataOfjInboxList;
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
            console.log($(e.currentTarget).val());
            try {
                mthis.senderInfo.from =
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
            console.log($(e.currentTarget).val());
            try {
                mthis.senderInfo.to =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
        });


    }
}

export namespace inboxListNsp {

    export class ComponentData extends ListComponentData<Inbox.GetAllForSender, RouteParam, QueryParam> {
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

export class SenderInfoDTO {
    senderUserId: string;
    from: string;
    to: string;

}
