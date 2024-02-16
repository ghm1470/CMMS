import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {ScheduleMaintenanceDto} from '../../model/dto/scheduleMaintenanceDto';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import ExpirationStatus = ScheduleMaintenanceDto.ExpirationStatus;
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {Province} from "../../../dashboard/model/dto/province";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";


declare var $: any;

@Component({
    selector: 'app-schedule-maintenance-list',
    templateUrl: './schedule-maintenance-list.component.html',
    styleUrls: ['./schedule-maintenance-list.component.scss']
})
export class ScheduleMaintenanceListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() readService;
///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: ScheduleMaintenanceDto.GetAllByFilterAndPagination2 [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    getAllByFilterAndPagination: ScheduleMaintenanceDto.GetAllByFilterAndPagination =
        new ScheduleMaintenanceDto.GetAllByFilterAndPagination();
    priorityList = [] as EnumObject[];
    expirationStatusList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;
    MyModalSize = ModalSize;
    myMoment = Moment;

    constructor(public router: Router,
                private cacheService: CacheService,
                public entityService: ScheduleMaintenanceService,
                public assetService: AssetService,
                public projectService: ProjectService,
                public workOrderStatusService: WorkOrderStatusService,
                private activatedRoute: ActivatedRoute) {
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.expirationStatusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<ExpirationStatus>(ExpirationStatus));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getPage();

        });
    }

    ngOnInit() {
        this.getRoleListKey();
    }

    ngAfterViewInit(): void {
        const mthis = this;
        $('#dueDate').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#dueDate'),
            disableBeforeToday: false
        }).on('change', (e) => {
            try {
                mthis.getAllByFilterAndPagination.dueDate =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
        });
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

        this.entityService.getAllByFilterAndPagination(this.getAllByFilterAndPagination, {
            paging,
            totalElements:-1,
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

    chooseSelectedItemForView(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForEdit(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({scheduleMaintenanceId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === true) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                } else {
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(): void {
        if (this.readService) {
            this.getAssetList();
            this.getProjectList();
            this.getWorkOrderStatusList();
        }
    }

    assetList: AssetDto.CreateAsset[] = [];
    projectList: ProjectDto.Create[] = [];
    workOrderStatusList: WorkOrderStatus[] = [];

    getAssetList() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                }
            });
    }

    getProjectList() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                }
            });
    }

    getWorkOrderStatusList() {
        this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderStatus[]) => {
                if (res && res.length) {
                    this.workOrderStatusList = res;
                }
            });
    }

    // تاریخ های سررسید
    loadingGetAllFutureDatesOfScheduleMaintenance = false;
    selectedEntity = new ScheduleMaintenanceDto.GetAllByFilterAndPagination2();
    dateLis: any[] = [];

    getAllFutureDatesOfScheduleMaintenance(entity) {
        if (this.loadingGetAllFutureDatesOfScheduleMaintenance) {
            return;
        }
        this.selectedEntity = entity;
        this.loadingGetAllFutureDatesOfScheduleMaintenance = true;
        this.entityService.getAllFutureDatesOfScheduleMaintenance({
            scheduleMaintenanceId: this.selectedEntity.id
        }).pipe(takeUntilDestroyed(this)).subscribe((res) => {
            this.loadingGetAllFutureDatesOfScheduleMaintenance = false;
            if (res) {

                this.dateLis = res;
            } else {

                this.dateLis = [];
            }
            ModalUtil.showModal('selectedEntityDateLisModal');
        }, error => {
            this.loadingGetAllFutureDatesOfScheduleMaintenance = false;
        });

    }

    // تاریخ های سررسید!!!
    //             مسافت های   راه اندازی

    loadingGetAllFutureMeteringScheduleMaintenance = false;
    meteringLis: any[] = [];

    getAllFutureMeteringOfScheduleMaintenance(entity) {
        if (this.loadingGetAllFutureMeteringScheduleMaintenance) {
            return;
        }
        this.selectedEntity = entity;
        this.loadingGetAllFutureMeteringScheduleMaintenance = true;
        this.meteringLis = [];
        if (this.selectedEntity.scheduledMeteringCycle) {

            this.entityService.getAllFutureMeteringOfScheduleMaintenance({
                per: this.selectedEntity.scheduledMeteringCycle.per,
                endDistance: this.selectedEntity.scheduledMeteringCycle.endDistance,
                startDistance: this.selectedEntity.scheduledMeteringCycle.startDistance
            }).pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.loadingGetAllFutureMeteringScheduleMaintenance = false;
                if (res) {

                    this.meteringLis = res;
                    ModalUtil.showModal('selectedEntityMeteringLisModal');
                }
            }, error => {
                this.loadingGetAllFutureMeteringScheduleMaintenance = false;
            });
        } else {
            ModalUtil.showModal('selectedEntityMeteringLisModal');
            this.loadingGetAllFutureMeteringScheduleMaintenance = false;
        }

    }

// !!! //             مسافت های   راه اندازی

}


//////////////////////////////////////
//
//     @Input() readService;
//     totalElements = 0;
//     totalPages = 0;
//     componentData = new ComponentData();
//     loading = false;
//     actionMode = ActionMode;
//     dataOfScheduleMaintenanceList: ScheduleMaintenanceDto.GetAllByFilterAndPagination2 [] = [];
//     getAllByFilterAndPagination: ScheduleMaintenanceDto.GetAllByFilterAndPagination =
//         new ScheduleMaintenanceDto.GetAllByFilterAndPagination();
//     assetList: AssetDto.CreateAsset[] = [];
//     projectList: ProjectDto.Create[] = [];
//     workOrderStatusList: WorkOrderStatus[] = [];
//     priorityList = [] as EnumObject[];
//     expirationStatusList = [] as EnumObject[];
//     maintenanceTypeList = [] as EnumObject[];
//     selectedItemForDelete = new DeleteModel();
//     myMoment = Moment;
//     roleList = new TokenRoleList();
//     MyToolkit = Toolkit;
//     MyToolkit2 = Toolkit2;
//     tools = Tools;
//
//     constructor(
//         protected _Router: Router,
//         protected _ActivatedRoute: ActivatedRoute,
//         public workOrderService: ScheduleMaintenanceService,
//         public assetService: AssetService,
//         public projectService: ProjectService,
//         public workOrderStatusService: WorkOrderStatusService,
//         private cacheService: CacheService,
//     ) {
//         super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//         this.componentData = new ComponentData();
//         this.receiveData();
//
//
//         this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
//         this.expirationStatusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<ExpirationStatus>(ExpirationStatus));
//         this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
//
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     ngOnInit() {
//         this.getRoleListKey();
//     }
//
//     getWorkOrderStatusList() {
//         this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: WorkOrderStatus[]) => {
//                 if (res && res.length) {
//                     this.workOrderStatusList = res;
//                 }
//             });
//     }
//
//     getProjectList() {
//         this.projectService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: ProjectDto.Create[]) => {
//                 if (res && res.length) {
//                     this.projectList = res;
//                 }
//             });
//     }
//
//     getAssetList() {
//         this.assetService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: AssetDto.CreateAsset[]) => {
//                 if (res && res.length) {
//                     this.assetList = res;
//                 }
//             });
//     }
//
//
//     ngOnChanges() {
//         if (this.readService) {
//             this.getAssetList();
//             this.getProjectList();
//             this.getWorkOrderStatusList();
//         }
//     }
//
//     getRoleListKey() {
//         this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             if (res) {
//                 this.roleList = res;
//             }
//         });
//     }
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.getListSelf();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//
//     getListSelf(options?: any) {
//         this.loading = true;
//         this.workOrderService.getAllByFilterAndPagination(this.getAllByFilterAndPagination, {
//             paging: this.componentData.myQuery.paging,
//             totalElements: this.totalElements
//         }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<ScheduleMaintenanceDto.GetAllByFilterAndPagination2>) => {
//             if (res) {
//                 this.loading = false;
//
//                 this.dataOfScheduleMaintenanceList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//     }
//
//     getListByFilter() {
//         this.componentData.myQuery.paging.page = 0;
//         this.totalElements = 0;
//         this.totalPages = 0;
//         this.getListSelf();
//
//     }
//
//     chooseSelectedItemForEdit(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, scheduleMaintenanceId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.VIEW, scheduleMaintenanceId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//
//     deleteItem(event) {
//         if (event) {
//             this.selectedItemForDelete.loading = true;
//             this.workOrderService.delete({scheduleMaintenanceId: this.selectedItemForDelete.id})
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//                 if (res.message) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                     DefaultNotify.notifyDanger(res.message);
//                 } else if (!res.message) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//                     this.dataOfScheduleMaintenanceList = this.dataOfScheduleMaintenanceList.filter((e) => {
//                         return e.id !== this.selectedItemForDelete.id;
//                     });
//
//                     DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//                 } else {
//                     DefaultNotify.notifyDanger(res.message);
//                 }
//             }, error => {
//             });
//
//         } else {
//             ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//     }
//
//
//     showModalDelete(item, i) {
//         this.selectedItemForDelete.loading = false;
//
//         this.selectedItemForDelete.id = item.id;
//         this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
//         this.selectedItemForDelete.index = i;
//         setTimeout(e => {
//             ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//         }, 10);
//     }
//
//     setPage(pageN) {
//         super.setToQueryParams({page: pageN, size: this.componentData.myQuery.paging.size});
//     }
//
//
//     ngOnDestroy(): void {
//     }
//
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
//
//         constructor() {
//             this.paging = new Paging();
//             this.paging.page = 0;
//             this.paging.size = 10;
//         }
//     }
// }




