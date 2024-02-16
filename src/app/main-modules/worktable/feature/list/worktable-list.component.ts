import {
    AfterViewInit,
    Component,
    ElementRef,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {ActivityService} from '../../../activity/service/activity.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {DefaultNotify, ModalSize, Paging, Toolkit2,} from '@angular-boot/util';
import {DataService} from '../../../../shared/service/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed,} from '@angular-boot/core';
import {
    ActivityLevelList,
    ActivityLevelSequenceHistory,
} from '../../../submitWorkRequest/feature/acceptation-process/acceptation-process.component';
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {isNullOrUndefined} from 'util';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {UserService} from '../../../user/endpoint/user.service';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import CategoryType = CategoryDto.CategoryType;
import * as XLSX from 'xlsx';
import {NumberTools} from '../../../../shared/tools/numberTools';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {ModalUtil} from '@angular-boot/widgets';
import {FileDataTable} from "../../../../shared/export-file/export-file/export-file.component";

declare var $: any;

@Component({
    selector: 'app-worktable-list',
    templateUrl: './worktable-list.component.html',
    styleUrls: ['./worktable-list.component.scss'],
})
export class WorktableListComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    constructor(
        private entityService: ActivityService,
        protected assetService: AssetService,
        private userService: UserService,
        public router: Router,
        private cacheService: CacheService,
        private activatedRoute: ActivatedRoute
    ) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.activatedRoute.queryParams.subscribe((params) => {
            params.pageIndex ? (this.pageIndex = params.pageIndex) : '';
            params.pageSize ? (this.pageSize = params.pageSize) : '';
            params.term ? (this.term = params.term) : '';
            this.getPage();
        });
    }

    ///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: GetAllWorkTable[] = [];
    /////

    ////////////دریافت  pdf,excel
    entityListForReport: GetAllWorkTable[] = [];
    fileDataTableList: FileDataTable[] = [
        {thTitle: 'نام دستگاه', tdTitle: 'assetName'},
        {thTitle: 'شماره برگه em', tdTitle: 'pmSheetCode'},
        {thTitle: 'تاریخ درخواست تعمیر', tdTitle: 'workRequestTimeJalali'},
        {thTitle: 'درخواست کننده', tdTitle: 'requesterFamily'},
        {thTitle: ' نوع درخواست', tdTitle: 'scheduleTitle'}
    ];
    ////////////دریافت  pdf,excel

    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    user: UserDto.Create = new UserDto.Create();
    closeNav1 = true;
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;
    requestType = RequestType;
    assetList: AssetDto.CreateAsset[] = [];
    myMoment = Moment;
    tools = Tools;
    readAsset;
    getAllByFilterAndPagination = new GetAllByFilterAndPagination();
    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    requestTypeList = [] as EnumObject[];

    loadingRouterToAction = false;
    selectedEntityForCheckIfActivityLevelIsPending = new GetAllWorkTable();
    priority = Priority;
    maintenanceType = MaintenanceType;
    requestStatus = RequestStatus;
    listMode = true;

    activityWorkOrderId: string;
    activityActivityLevelId: string;
    activityInstanceIdAction: string;
    isViewAction = false;

    fromDate: any;
    untilDate: any;
    userList: UserDto.GetUserWithUserType[] = [];

    loadingOpenPdf = false;
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    @ViewChild('table', {static: false}) table: ElementRef;
    MyModalSize = ModalSize;

    selectedRequestType: RequestType;
    workRequestAcceptor: boolean;

    //// مقدار دهی درخواست رد شده
    selectedRejectionReason: GetAllWorkTable;

    ngOnInit() {
        // وقتی نوتفیکیشن اومد گت پیج
        DataService.getTotal.pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (!isNullOrUndefined(res)) {
                this.getPage('getTotal');
            }
        });
        ////
        this.priorityList = EnumHandle.getEnumObjectList(
            EnumHandle.listEnums<Priority>(Priority)
        );
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(
            EnumHandle.listEnums<MaintenanceType>(MaintenanceType)
        );
        this.requestTypeList = EnumHandle.getEnumObjectList(
            EnumHandle.listEnums<RequestType>(RequestType)
        );
        this.getRoleListKey();
        this.getAssetList();
        this.getUserWithUserType();
    }

    getAssetList() {
        if (!this.readAsset) {
            this.readAsset = true;
            this.assetService
                .getAll()
                .pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetDto.CreateAsset[]) => {
                    if (res && res.length) {
                        this.assetList = res;
                        this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                    }
                });
        }
    }

    getUserWithUserType() {
        this.userService
            .getUserWithUserType()
            .pipe(takeUntilDestroyed(this)).subscribe((res: UserDto.GetUserWithUserType[]) => {
            if (res) {
                this.userList = res;
            }
        });
    }

    getRoleListKey() {
        this.cacheService
            .getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE)
            .pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (res) {
                    this.roleList = res;
                }
            });
    }

    dateChek() {
        if (!this.fromDate || !this.untilDate) {
            return true;
        }
        if (this.fromDate > this.untilDate) {
            DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.', '', NotiConfig.notifyConfig);
            return false;
        } else {
            return true;
        }
    }

    getPage(from?: string) {
        if (this.loading) {
            return;
        }
        if (from !== 'getTotal') {
            this.countPendingActivityOfTheUser();
        }
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        if (this.dateChek()) {
            this.getAllByFilterAndPagination.from = null;
            this.getAllByFilterAndPagination.until = null;
            if (this.fromDate) {
                this.getAllByFilterAndPagination.from =
                    this.myMoment.convertJaliliToIsoDateWithTime(this.fromDate);
            }
            if (this.untilDate) {
                this.getAllByFilterAndPagination.until =
                    this.myMoment.convertJaliliToIsoDateWithTime(this.untilDate);
            }

            this.loading = true;

            const dto = JSON.parse(JSON.stringify(this.getAllByFilterAndPagination));
            if (dto.pmSheetCode || dto.pmSheetCode === 0) {
                dto.pmSheetCode = +dto.pmSheetCode as any;
                dto.number = +dto.pmSheetCode as any;
            }
            this.entityService
                .getActivityOfPendingUserPagination(dto, {
                    userId: this.user.id,
                    paging,
                    totalElements: -1,
                })
                // this.entityService.getAll()
                .pipe(takeUntilDestroyed(this)).subscribe(
                (res: any) => {
                    this.loading = false;
                    if (res) {
                        this.entityList = res.content;
                        this.length = res.totalElements;

                        this.entityList.map(e => {
                            if (e.number) {
                                e.pmSheetCode = '00000' + e.number;
                                e.pmSheetCode = e.pmSheetCode.slice(e.pmSheetCode.length - 5);
                            }
                            if (!isNullOrUndefined(e.assetCode)) {
                                e.assetCode = '#' + e.assetCode;
                            }
                            if (!isNullOrUndefined(e.assignedUserId)) {
                                e.requestType = RequestType.SENDFORYOU;
                            } else if (isNullOrUndefined(e.assignedUserId)) {
                                e.requestType = RequestType.SENDFORGROUPE;
                            }
                        });


                        // DataService.setTotal(res.totalElements);
                        if (this.entityList.length === 0 && this.pageIndex > 0) {
                            this.pageIndex -= 1;
                            this.navigate();
                        }
                    }

                },
                (error) => {
                    this.loading = false;
                }
            );

        }
    }

/// خواندن تعداد فرایند در انتظار تایید تصادفی
    countPendingActivityOfTheUser() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.entityService.countPendingActivityOfTheUser({userId: user.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    DataService.setTotal(res);
                }
            });
    }

    EmActivityGetPageForExcel() {
        this.entityService.EmActivityGetPageForExcel(this.getAllByFilterAndPagination,
            {
                userId: this.user.id
            }).pipe(takeUntilDestroyed(this)
        ).subscribe((res) => {
            this.loading = false;
            this.entityListForReport = res;
            this.entityListForReport.map(e => {
                e.workRequestTimeJalali = this.myMoment.convertIsoToJDateWithTimeEnToFa(e.workRequestTime);
                if (e.schedule === true) {
                    e.scheduleTitle = 'پیشگیرانه';
                } else {
                    e.scheduleTitle = 'اضطراری';
                }
            });

        }, error => {

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
                term: this.term,
            },
        });
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();
    }

    routerToAction(request: GetAllWorkTable) {
        this.selectedRequestType = request.requestType;
        this.activityWorkOrderId = request.workOrderId;
        this.activityActivityLevelId = request.activityLevelId;
        this.activityInstanceIdAction = request.instanceId;
        this.workRequestAcceptor = request.workRequestAcceptor;
        // this.showActionComponent();
        // return;
        if (this.loadingRouterToAction) {
            return;
        }
        this.selectedEntityForCheckIfActivityLevelIsPending = request;
        this.loadingRouterToAction = true;
        // if (request.requestType === RequestType.SENDFORGROUPE) {
        this.entityService.checkIfActivityLevelIsPending({
            activityInstanceId: request.instanceId,
            activityLevelId: request.activityLevelId,
        })
            .pipe(takeUntilDestroyed(this))
            .subscribe(
                (res: boolean) => {
                    this.loadingRouterToAction = false;

                    if (res === true) {
                        // this.router.navigate(['action'], {
                        //     queryParams: {entityId: request.instanceId, isView: true},
                        //     relativeTo: this.activatedRoute
                        // });
                        this.isViewAction = true;
                        this.activityInstanceIdAction = request.instanceId;
                        this.showActionComponent();
                        if (!request.seen) {
                            this.seenWorkTable(request);
                        }
                    } else {
                        DefaultNotify.notifyDanger(' این تعمیر  توسط شخص دیگری ثبت گردید .', '', NotiConfig.notifyConfig);
                        this.getPage();
                    }
                },
                (error) => {
                    this.loadingRouterToAction = false;
                }
            );
        // } else if (request.requestType === RequestType.SENDFORYOU) {
        //     this.loadingRouterToAction = false;
        //     // alert(request.requestType);
        //     // this.router.navigate(['action'], {
        //     //     queryParams: {entityId: request.instanceId, isView: false},
        //     //     relativeTo: this.activatedRoute
        //     // });
        //     this.isViewAction = false;
        //     this.activityInstanceIdAction = request.instanceId;
        //     this.showActionComponent();
        // }
    }

    seenWorkTable(request: GetAllWorkTable) {
        this.entityService.activitySampleSeen({
            activityInstanceId: request.instanceId,
            activityLevelId: request.activityLevelId
        }).pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            if (res) {
                request.seen = true;
            }
        });
    }

    showActionComponent() {
        setTimeout((e) => {
            this.listMode = false;
        }, 1);
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        if (!isNullOrUndefined(this.getAllByFilterAndPagination.from)) {
            $('#from')
                .val(
                    Toolkit2.Common.En2Fa(
                        this.myMoment.convertIsoToJDate(
                            new Date(this.getAllByFilterAndPagination.from).toISOString()
                        )
                    )
                )
                .trigger('change');
        }
        if (
            this.getAllByFilterAndPagination.from ||
            this.getAllByFilterAndPagination.requestTitle ||
            this.getAllByFilterAndPagination.assetId ||
            this.getAllByFilterAndPagination.fromSchedule ||
            this.getAllByFilterAndPagination.maintenanceType ||
            this.getAllByFilterAndPagination.priority
        ) {
            $('#workTable-search').addClass('show');
            if (this.getAllByFilterAndPagination.assetId) {
                this.getAssetList();
            }
            if (this.getAllByFilterAndPagination.priority) {
                this.priorityList = EnumHandle.getEnumObjectList(
                    EnumHandle.listEnums<Priority>(Priority)
                );
            }
            if (this.getAllByFilterAndPagination.maintenanceType) {
                this.maintenanceTypeList = EnumHandle.getEnumObjectList(
                    EnumHandle.listEnums<MaintenanceType>(MaintenanceType)
                );
            }
        }
        this.setJqueryDate();
    }

    setJqueryDate() {
        setTimeout((e1) => {
            $('#from')
                .azPersianDateTimePicker({
                    Placement: 'left', // default is 'bottom'
                    Trigger: 'focus', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#from'),
                    disableBeforeToday: false,
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                })
                .on('change', (e) => {
                    this.fromDate = $(e.currentTarget).val();
                    // this.getAllByFilterAndPagination.from =
                    //     this.myMoment.convertJaliliToIsoDateWithTime($(e.currentTarget).val());
                });
            $('#until')
                .azPersianDateTimePicker({
                    Placement: 'left', // default is 'bottom'
                    Trigger: 'focus', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#until'),
                    disableBeforeToday: false,
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                })
                .on('change', (e) => {
                    this.untilDate = $(e.currentTarget).val();

                    // this.getAllByFilterAndPagination.until =
                    //     this.myMoment.convertJaliliToIsoDateWithTime($(e.currentTarget).val());
                });
        }, 10);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    //////////////////////////////////////
    backEmit() {
        this.listMode = true;
        this.setJqueryDate();

        if (
            this.getAllByFilterAndPagination.assetId ||
            !isNullOrUndefined(this.getAllByFilterAndPagination.fromSchedule) ||
            this.getAllByFilterAndPagination.from ||
            this.getAllByFilterAndPagination.until
        ) {
            setTimeout((e) => {
                // $('#assets-search-btn').click();
                $('#workTable-search').addClass('show');
                setTimeout(() => {
                    if (!isNullOrUndefined(this.getAllByFilterAndPagination.from)) {
                        const jFrom = Toolkit2.Common.En2Fa(
                            this.myMoment.convertIsoToJDateWithTime(
                                new Date(this.getAllByFilterAndPagination.from).toISOString()
                            )
                        );
                        $('#from').val(jFrom).trigger('change');
                    }
                    if (!isNullOrUndefined(this.getAllByFilterAndPagination.until)) {
                        const jUntil = Toolkit2.Common.En2Fa(
                            this.myMoment.convertIsoToJDateWithTime(
                                new Date(this.getAllByFilterAndPagination.until).toISOString()
                            )
                        );
                        $('#until').val(jUntil).trigger('change');
                    }
                }, 5);
            }, 5);
        }
    }


    selectForRejectionReason(item: GetAllWorkTable) {
        this.selectedRejectionReason = item;
        setTimeout(e => {
            ModalUtil.showModal('rejectionReason_workTable_Modal');
        }, 10);

    }

}


export class GetAllWorkTable {
    workRequestTitle: string;
    workRequestTime: any;
    workRequestTimeJalali: any;
    assetId: string;
    assetName: string;
    pmSheetCode: string; // شماره برگه pm
    number: string; //em شماره برگه
    requesterId: string; // درخواست کننده
    requesterName: string; // درخواست کننده
    requesterFamily: string; // درخواست کننده
    assetCode: string;
    schedule: boolean;
    scheduleTitle: string;
    priority: Priority;
    maintenanceType: MaintenanceType;
    workOrderId: string;
    activityLevelId: string;
    instanceId: string;
    seen: boolean; // دیده شده یا نشده
    workRequestAcceptor: boolean; // مشخص میکند که کاربر تایید کننده هست یا نه
    requestStatus: RequestStatus; // وضعیت
    rejectionReason: string; // علت رد
    requestType: RequestType;
    assignedUserId: string;
    // ==================
    // activitySample: V;
    // assetId: string;
    // relevantAssetName: string;
    // requestTime: Date;
}

//
export enum RequestType {
    SENDFORYOU = ' ارسال شده به من' as any,
    SENDFORGROUPE = 'ارسال شده به گروه' as any,
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

//
export class GetAllByFilterAndPagination {
    requestTitle: string;
    from: any;
    until: any;
    requestType: RequestType;
    assetId: string;
    pmSheetCode: string = null; // شماره برگه pm
    number: string = null; // شماره برگه em
    fromSchedule: boolean;
    userId: string;
    priority: Priority;
    maintenanceType: MaintenanceType;
}

export enum RequestStatus {
    NEW_REQUEST = 'NEW_REQUEST' as any,    // درخواست جدید
    REJECTED_REQUEST = 'REJECTED_REQUEST' as any, // درخواست رد شده
    EMPTY = 'EMPTY' as any,
}
