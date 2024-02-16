import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {UserDto} from '../../../user/model/dto/user-dto';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {ActivityLevel} from '../../../activity/model/activityLevel';
import {ActivityService} from '../../../activity/service/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Reading} from '../../../reading/model/reading';
import {
    ActivityLevelList,
    ActivityLevelSequenceHistory
} from '../../../submitWorkRequest/feature/acceptation-process/acceptation-process.component';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {isNullOrUndefined} from 'util';
import {DataService} from '../../../../shared/service/data.service';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {Province} from '../../../dashboard/model/dto/province';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-work-table-history-list',
    templateUrl: './work-table-history-list.component.html',
    styleUrls: ['./work-table-history-list.component.scss']
})
export class WorkTableHistoryListComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private entityService: ActivityService,
                protected assetService: AssetService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.activatedRoute.queryParams.subscribe(params => {
            let state: string;
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.state ? state = params.state : '';
            if (state) {
                state === 'true' ? this.state = true : false;
            }
            this.length = -1;
            this.getPage();

        });
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
    }


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;

    entityList: GetAllWorkTable [] = [];
    getAllByFilterAndPagination = new GetAllByFilterAndPaginationHistory();

    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    state = true;
    user: UserDto.Create = new UserDto.Create();
    priorityList = [] as EnumObject[];
    myMoment = Moment;
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;

    readAsset;
    assetList: AssetDto.CreateAsset[] = [];
    tools = Tools;

    ngOnInit() {
        this.getRoleListKey();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getAllAcceptedAndRejectedActivitiesOfUserWithPagination(this.getAllByFilterAndPagination, {
            paging,
            totalElements:-1,
            state: this.state,
            userId: this.user.id,
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                }
                
            }, error => {
                this.loading = false;
            });
    }

    search() {
        if (this.pageIndex == 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }

    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                state: this.state,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    getAssetList() {
        if (!this.readAsset) {
            this.readAsset = true;
            this.assetService.getAll().pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetDto.CreateAsset[]) => {
                    if (res && res.length) {
                        this.assetList = res;
                        this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                    }
                });
        }
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            $('#requestTime').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#requestTime'),
                disableBeforeToday: false,
            }).on('change', (e) => {
                console.log($(e.currentTarget).val());
                try {
                    this.getAllByFilterAndPagination.requestTime =
                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                    console.log('ddd', this.getAllByFilterAndPagination.requestTime);
                } catch (e) {
                    // DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
                }
            });
            $('#deliveryDate').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#deliveryDate'),
                disableBeforeToday: false,
            }).on('change', (e) => {
                console.log($(e.currentTarget).val());
                try {
                    this.getAllByFilterAndPagination.deliveryDate =
                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                    console.log('ddd', this.getAllByFilterAndPagination.deliveryDate);
                } catch (e) {
                    // DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
                }
            });
            $('#replyDate').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#replyDate'),
                disableBeforeToday: false,
            }).on('change', (e) => {
                console.log($(e.currentTarget).val());
                try {
                    this.getAllByFilterAndPagination.replyDate =
                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                    console.log('ddd', this.getAllByFilterAndPagination.replyDate);
                } catch (e) {
                    // DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
                }
            });
        }, 400);
    }


    //////////////////////////////////////

//
//     componentData: ComponentData;
//     getActivityHistory: GetAllWorkTable [] = [];
//     totalElements = 0;
//     totalPages = 0;
//     user: UserDto.Create = new UserDto.Create();
//     loading: boolean;
//     getOneLoading = false;
//     MyToolkit = Toolkit;
//     MyToolkit2 = Toolkit2;
//     state = true;
//     assetList: AssetDto.CreateAsset[] = [];
//     priorityList = [] as EnumObject[];
//     myMoment = Moment;
//     tools = Tools;
//     readAsset;
//
//     constructor(
//         protected router: Router,
//         protected activatedRoute: ActivatedRoute,
//         private activityService: ActivityService,
//         protected assetService: AssetService,
//     ) {
//         this.state = this.activatedRoute.snapshot.queryParams.state;
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     ngOnInit() {
//         this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
//     }
//
//
//
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.user = JSON.parse(sessionStorage.getItem('user'));
//         this.componentData.myQuery = queryParam;
//         // this.loading = true;
//         this.getMyWorkTableHistoryList();
//
//         // setTimeout(() => {
//         if (!isNullOrUndefined(this.componentData.myQuery.getAllByFilterAndPagination.requestTime)) {
//             $('#requestTime').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
//             (new Date(this.componentData.myQuery.getAllByFilterAndPagination.requestTime).toISOString()))).trigger('change');
//         }
//         if (!isNullOrUndefined(this.componentData.myQuery.getAllByFilterAndPagination.deliveryDate)) {
//             $('#deliveryDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
//             (new Date(this.componentData.myQuery.getAllByFilterAndPagination.deliveryDate).toISOString()))).trigger('change');
//         }
//         if (!isNullOrUndefined(this.componentData.myQuery.getAllByFilterAndPagination.replyDate)) {
//             $('#replyDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
//             (new Date(this.componentData.myQuery.getAllByFilterAndPagination.replyDate).toISOString()))).trigger('change');
//         }
//         if (this.componentData.myQuery.getAllByFilterAndPagination.requestTime ||
//             this.componentData.myQuery.getAllByFilterAndPagination.deliveryDate ||
//             this.componentData.myQuery.getAllByFilterAndPagination.replyDate ||
//             this.componentData.myQuery.getAllByFilterAndPagination.requestTitle ||
//             this.componentData.myQuery.getAllByFilterAndPagination.assetId ||
//             this.componentData.myQuery.getAllByFilterAndPagination.fromSchedule ||
//             this.componentData.myQuery.getAllByFilterAndPagination.maintenanceType ||
//             this.componentData.myQuery.getAllByFilterAndPagination.priority) {
//             $('#workTableHistory-search').addClass('show');
//             if (this.componentData.myQuery.getAllByFilterAndPagination.assetId) {
//                 this.getAssetList();
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.priority) {
//                 this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
//             }
//         }
//         setTimeout(() => {
//             const mthis = this;
//             $('#requestTime').azPersianDateTimePicker({
//                 Placement: 'left', // default is 'bottom'
//                 Trigger: 'focus', // default is 'focus',
//                 enableTimePicker: false, // default is true,
//                 TargetSelector: '', // default is empty,
//                 GroupId: '', // default is empty,
//                 ToDate: false, // default is false,
//                 FromDate: false, // default is false,
//                 targetTextSelector: $('#requestTime'),
//                 disableBeforeToday: false,
//             }).on('change', (e) => {
//                 console.log($(e.currentTarget).val());
//                 try {
//                     mthis.componentData.myQuery.getAllByFilterAndPagination.requestTime =
//                         mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//                     console.log('ddd', mthis.componentData.myQuery.getAllByFilterAndPagination.requestTime);
//                 } catch (e) {
//                     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//                 }
//             });
//             $('#deliveryDate').azPersianDateTimePicker({
//                 Placement: 'left', // default is 'bottom'
//                 Trigger: 'focus', // default is 'focus',
//                 enableTimePicker: false, // default is true,
//                 TargetSelector: '', // default is empty,
//                 GroupId: '', // default is empty,
//                 ToDate: false, // default is false,
//                 FromDate: false, // default is false,
//                 targetTextSelector: $('#deliveryDate'),
//                 disableBeforeToday: false,
//             }).on('change', (e) => {
//                 console.log($(e.currentTarget).val());
//                 try {
//                     mthis.componentData.myQuery.getAllByFilterAndPagination.deliveryDate =
//                         mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//                     console.log('ddd', mthis.componentData.myQuery.getAllByFilterAndPagination.deliveryDate);
//                 } catch (e) {
//                     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//                 }
//             });
//             $('#replyDate').azPersianDateTimePicker({
//                 Placement: 'left', // default is 'bottom'
//                 Trigger: 'focus', // default is 'focus',
//                 enableTimePicker: false, // default is true,
//                 TargetSelector: '', // default is empty,
//                 GroupId: '', // default is empty,
//                 ToDate: false, // default is false,
//                 FromDate: false, // default is false,
//                 targetTextSelector: $('#replyDate'),
//                 disableBeforeToday: false,
//             }).on('change', (e) => {
//                 console.log($(e.currentTarget).val());
//                 try {
//                     mthis.componentData.myQuery.getAllByFilterAndPagination.replyDate =
//                         mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//                     console.log('ddd', mthis.componentData.myQuery.getAllByFilterAndPagination.replyDate);
//                 } catch (e) {
//                     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//                 }
//             });
//         }, 400);
//         // }, 4000)
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//     getMyWorkTableHistoryList() {
//         this.getOneLoading = true;
//         this.activityService.getAllAcceptedAndRejectedActivitiesOfUserWithPagination(
//             this.componentData.myQuery.getAllByFilterAndPagination,
//             {
//                 state: this.componentData.myQuery.state,
//                 userId: this.user.id,
//                 paging: this.componentData.myQuery.paging,
//                 totalElements: this.totalElements,
//             }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<GetAllWorkTable>) => {
//             this.getOneLoading = false;
//             if (res) {
//                 this.getActivityHistory = res.content;
//                 for (const item of this.getActivityHistory) {
//                     if (!isNullOrUndefined(item.assetCode)) {
//                         item.assetCode = '#' + item.assetCode;
//                     }
//                 }
//                 // DataService.setTotal(res.totalElements);
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//
//     }
//
//
//     setPage(page) {
//         super.setToQueryParams({page: page, size: this.componentData.myQuery.paging.size});
//     }
//
//
//     search() {
//         if (!isNullOrUndefined(this.componentData.myQuery.getAllByFilterAndPagination.requestTitle)) {
//             this.componentData.myQuery.getAllByFilterAndPagination.requestTitle =
//             this.componentData.myQuery.getAllByFilterAndPagination.requestTitle.trim();
//         }
//         this.totalElements = 0;
//         super.setToQueryParams({
//             page: 0,
//             size: 10,
//             requestTitle: this.componentData.myQuery.getAllByFilterAndPagination.requestTitle,
//             requestTime: this.componentData.myQuery.getAllByFilterAndPagination.requestTime,
//             deliveryDate: this.componentData.myQuery.getAllByFilterAndPagination.deliveryDate,
//             replyDate: this.componentData.myQuery.getAllByFilterAndPagination.replyDate,
//             assetId: this.componentData.myQuery.getAllByFilterAndPagination.assetId,
//             priority: this.componentData.myQuery.getAllByFilterAndPagination.priority,
//             fromSchedule: this.componentData.myQuery.getAllByFilterAndPagination.fromSchedule,
//         });
//     }
//
//
//     ngOnDestroy(): void {
//     }
//
//     ngOnChanges(changes: SimpleChanges): void {
//     }
//
//
//     ngAfterViewInit(): void {
//     }
//
// }
//
// export class ComponentData {
//     myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
// }
//
// export namespace CourseParam {
//     export class RouteParam {
//
//     }
//
//     export class QueryParam {
//         paging: Paging;
//         getAllByFilterAndPagination: GetAllByFilterAndPaginationHistory;
//         state;
//
//         constructor() {
//             this.paging = new Paging();
//             this.getAllByFilterAndPagination = new GetAllByFilterAndPaginationHistory();
//             this.paging.page = 0;
//             this.paging.size = 10;
//             this.state = null;
//             this.getAllByFilterAndPagination.requestTitle = null;
//             this.getAllByFilterAndPagination.requestTime = null;
//             this.getAllByFilterAndPagination.assetId = null;
//             this.getAllByFilterAndPagination.priority = null;
//             this.getAllByFilterAndPagination.fromSchedule = null;
//         }
//     }
//
}


export class GetAllWorkTable {
    workRequestTitle: string;
    workRequestTime: any;
    assetId: string;
    assetName: string;
    assetCode: string;
    fromSchedule: boolean;
    priority: Priority;
    maintenanceType: MaintenanceType;
    instanceId: string;
    requestStatus: RequestStatus;
    replyDate: Date;
    deliveryDate: Date;
    // ==================
    // activitySample: V;
    // assetId: string;
    // relevantAssetName: string;
    // requestTime: Date;
}

export class V {
    active: boolean;
    activityInstanceId: string;
    activityLevelList: ActivityLevelList[] = [];
    activityLevelSequenceHistory: ActivityLevelSequenceHistory[] = [];
    description: string;
    id: string;
    relatedActivityId: string;
    requesterId: string;
    title: string;
    workOrderId: string;
    workRequestTitle: string;
    fromSchedule = false;
}


export enum RequestStatus {
    NEW_REQUEST = 'NEW_REQUEST' as any,
    REJECTED_REQUEST = 'REJECTED_REQUEST' as any,
    EMPTY = 'EMPTY' as any,
}


export class GetAllByFilterAndPaginationHistory {
    requestTitle: string;
    deliveryDate: any;
    RequestTime: any;
    replyDate: any;
    requestTime: any;
    assetId: string;
    fromSchedule: boolean;
    priority: Priority;
    maintenanceType: MaintenanceType;
}
