import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
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
import MaintenanceType = WorkOrderDto.MaintenanceType;
import Priority = WorkOrderDto.Priority;
import {ModalUtil} from '@angular-boot/widgets';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {Province} from "../../../dashboard/model/dto/province";
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-assigned-work-order-list',
    templateUrl: './assigned-work-order-list.component.html',
    styleUrls: ['./assigned-work-order-list.component.scss']
})
export class AssignedWorkOrderListComponent implements OnInit, OnDestroy, AfterViewInit {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    userId: string;

    entityList: WorkOrderDto.GetAllByFilterAndPagination [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    getAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
    myMoment = Moment;
    userList: UserDto.Create[] = [];
    dontUser = false;
    workOrderStatusList: WorkOrderStatus[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    projectList: ProjectDto.Create[] = [];
    moment = Moment;

    constructor(private entityService: WorkOrderService,
                public router: Router,
                private userService: UserService,
                private workOrderStatusService: WorkOrderStatusService,
                private assetService: AssetService,
                private projectService: ProjectService,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.userId ? this.userId = params.userId : '';
            if (this.userId) {
                this.getPage();
            }

        });
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
    }

    ngOnInit() {
        this.getRoleListKey();
        this.getAllUser();

    }

    SearchItems = false;

    openSearchItems() {
        if (this.SearchItems) {
            return;
        }
        this.SearchItems = true;
        this.getWorkOrderStatusList();
        this.getProjectList();
        this.getAssetList();

    }

    getAllUser() {
        const parentUser: UserDto.Create = JSON.parse(sessionStorage.getItem('user'));
        this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: UserDto.Create[]) => {
                console.log('res--->', res);
                let myUser = new UserDto.Create();
                myUser = parentUser;
                myUser.name = 'من';
                myUser.family = '';
                console.log(' this.userList--->', this.userList);

                if (res && res.length) {
                    this.userList = res;
                    this.userList.unshift(myUser);
                } else if (!res || res.length === 0) {
                    this.userList = [myUser];
                    this.dontUser = true;
                    // parentUser.name = 'من';
                    // parentUser.family = '';
                    // this.userList[0] = parentUser;
                }


                for (const item of this.userList) {
                    item.name = item.name + ' ' + item.family;
                }
                if (!this.userId) {
                    this.userId = this.userList[0].id;
                    this.getPage();
                }
                // this.userId = parentUser.id;
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

    getAssetList() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                    this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);

                }
            });
    }

    getProjectList() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                    console.log(this.projectList, ' this.projectList');
                }
            });
    }

    ngAfterViewInit(): void {
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
                this.getAllByFilterAndPagination.startDate =
                    this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                // const dateSplit = this.getAllByFilterAndPagination.startDate.split('T');
                // this.getAllByFilterAndPagination.startDate = dateSplit[0] + 'T00:00:00.000Z';
                // console.log(this.getAllByFilterAndPagination.startDate)
            } catch (e) {
                // DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
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
                this.getAllByFilterAndPagination.endDate =
                    this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                // const dateSplit = this.getAllByFilterAndPagination.endDate.split('T');
                // this.getAllByFilterAndPagination.endDate = dateSplit[0] + 'T23:59:59.000Z';
            } catch (e) {
                // DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
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
        this.entityService.getAllByFilterAndPaginationWithUserId(this.getAllByFilterAndPagination, {
            paging,
            totalElements:-1,
            userId: this.userId
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                }
                ;
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
                userId: this.userId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    selectedWorkOrderIdForCheck: string;
    loadingForCheckUpdate = false;

    chooseSelectedItemForEdit(item: WorkOrderDto.GetAllByFilterAndPagination) {
        if (this.loadingForCheckUpdate) {
            return;
        }
        this.selectedWorkOrderIdForCheck = item.id;
        this.loadingForCheckUpdate = true;
        this.entityService.checkIfWorkOrderIsInProcess({workOrderId: item.id}).subscribe((res: boolean) => {
            this.loadingForCheckUpdate = false;
            if (res === true) {
                DefaultNotify.notifyDanger(' دستور کار فوق در روند تعمیرات قرار دارد و امکان ویرایش آن نمی باشد. ', '', NotiConfig.notifyConfig);
            } else {
                this.router.navigate(['action'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            }
        }, error => {
            this.loadingForCheckUpdate = false;
        });


    }

    chooseSelectedItemForView(item: WorkOrderDto.GetAllByFilterAndPagination) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    ngOnDestroy(): void {
    }


    //////////////////////////////////////

//     userId: string;
//     componentData: ComponentData;
//     totalElements = 0;
//     totalPages = 0;
//     toolkit2 = Toolkit2;
//     loading: boolean;
//     dataOfAssignedWorkOrderList: WorkOrderDto.GetAllByFilterAndPagination [] = [];
//
//     myMoment = Moment;
//     assetList: AssetDto.CreateAsset[] = [];
//     projectList: ProjectDto.Create[] = [];
//     workOrderStatusList: WorkOrderStatus[] = [];
//     priorityList = [] as EnumObject[];
//     maintenanceTypeList = [] as EnumObject[];
//     roleList = new TokenRoleList();
//     workOrderStatus = new WorkOrderStatus();
//     A = new AssetDto.CreateAsset();
//     P = new ProjectDto.Create();
//     S = new WorkOrderStatus();
//     actionMode = ActionMode;
//     userList: UserDto.Create[] = [];
//     dontUser = false;
//     tools = Tools;
//
//     // userId: string;
//
//     constructor(
//         protected router: Router,
//         protected activatedRoute: ActivatedRoute,
//         private workOrderService: WorkOrderService,
//         private workOrderStatusService: WorkOrderStatusService,
//         private assetService: AssetService,
//         private projectService: ProjectService,
//         private cacheService: CacheService,
//         private userService: UserService,
//     ) {
//         this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
//         this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
//     }
//
//
//     ngOnInit() {
//         this.getAllUser();
//         this.getAssetList();
//         this.getProjectList();
//         this.getWorkOrderStatusList();
//         this.getRoleListKey();
//     }
//
//     getAllUser() {
//
//         const parentUser: UserDto.Create = JSON.parse(sessionStorage.getItem('user'));
//         this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
//             .subscribe((res: UserDto.Create[]) => {
//                 console.log('res--->', res);
//                 if (res && res.length) {
//                     this.userList = res;
//                     for (const item of this.userList) {
//                         item.name = item.name + ' ' + item.family;
//                     }
//                     this.userId = this.userList[0].id;
//                 } else if (!res || res.length === 0) {
//                     this.dontUser = true;
//                     // parentUser.name = 'من';
//                     // parentUser.family = '';
//                     // this.userList[0] = parentUser;
//                 }
//                 // this.userId = parentUser.id;
//             });
//
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
//                     console.log(this.projectList, ' this.projectList');
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
//     getRoleListKey() {
//         this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             if (res) {
//                 this.roleList = res;
//             }
//         });
//     }
//
//     setListData() {
//         if (this.dataOfAssignedWorkOrderList && this.projectList.length > 0 &&
//             this.workOrderStatusList.length > 0 && this.assetList.length > 0) {
//             for (const item of this.dataOfAssignedWorkOrderList) {
//                 this.A = this.assetList.find(asset => asset.id === item.assetId);
//                 item.assetTitle = this.A.name;
//                 this.P = this.projectList.find(project => project.id === item.projectId);
//                 item.projectTitle = this.P.name;
//                 this.S = this.workOrderStatusList.find(wos => wos.id === item.statusId);
//                 item.statusTitle = this.S.name;
//             }
//         }
//     }
//
//
//     ngAfterViewInit(): void {
//         const mthis = this;
//         $('#startDate').azPersianDateTimePicker({
//             Placement: 'left', // default is 'bottom'
//             Trigger: 'focus', // default is 'focus',
//             enableTimePicker: false, // default is true,
//             TargetSelector: '', // default is empty,
//             GroupId: '', // default is empty,
//             ToDate: false, // default is false,
//             FromDate: false, // default is false,
//             targetTextSelector: $('#startDate'),
//             disableBeforeToday: true
//         }).on('change', (e) => {
//             console.log($(e.currentTarget).val());
//             try {
//                 mthis.componentData.myQuery.getAllByFilterAndPagination.startDate =
//                     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//             } catch (e) {
//                 DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//             }
//         });
//         $('#endDate').azPersianDateTimePicker({
//             Placement: 'left', // default is 'bottom'
//             Trigger: 'focus', // default is 'focus',
//             enableTimePicker: false, // default is true,
//             TargetSelector: '', // default is empty,
//             GroupId: '', // default is empty,
//             ToDate: false, // default is false,
//             FromDate: false, // default is false,
//             targetTextSelector: $('#endDate'),
//             disableBeforeToday: true
//         }).on('change', (e) => {
//             console.log($(e.currentTarget).val());
//             try {
//                 mthis.componentData.myQuery.getAllByFilterAndPagination.endDate =
//                     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//             } catch (e) {
//                 DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//             }
//         });
//     }
//
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.loading = true;
//         if (isNullOrUndefined(queryParam.userId)) {
//             const users = JSON.parse(sessionStorage.getItem('user'));
//             this.userId = users.id;
//         } else {
//             this.userId = queryParam.userId;
//         }
//         this.getAssignedWorkOrderList();
//
//     }
//
//     getAssignedWorkOrderList() {
//         this.dataOfAssignedWorkOrderList = [];
//
//         if (!isNullOrUndefined(this.userId)) {
//             console.log('--userId--', this.userId);
//
//             const getAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
//             if (this.componentData.myQuery.getAllByFilterAndPagination.title !== null) {
//                 getAllByFilterAndPagination.title = this.componentData.myQuery.getAllByFilterAndPagination.title;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.code !== null) {
//                 getAllByFilterAndPagination.code = this.componentData.myQuery.getAllByFilterAndPagination.code;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.statusId !== null) {
//                 getAllByFilterAndPagination.statusId = this.componentData.myQuery.getAllByFilterAndPagination.statusId;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.assetId !== null) {
//                 getAllByFilterAndPagination.assetId = this.componentData.myQuery.getAllByFilterAndPagination.assetId;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.projectId !== null) {
//                 getAllByFilterAndPagination.projectId = this.componentData.myQuery.getAllByFilterAndPagination.projectId;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.priority !== null) {
//                 getAllByFilterAndPagination.priority = this.componentData.myQuery.getAllByFilterAndPagination.priority;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.startDate !== null) {
//                 getAllByFilterAndPagination.startDate = this.componentData.myQuery.getAllByFilterAndPagination.startDate;
//             }
//             if (this.componentData.myQuery.getAllByFilterAndPagination.endDate !== null) {
//                 getAllByFilterAndPagination.endDate = this.componentData.myQuery.getAllByFilterAndPagination.endDate;
//             }
//             this.workOrderService.getAllByFilterAndPaginationWithUserId(getAllByFilterAndPagination, {
//                 paging: this.componentData.myQuery.paging,
//                 totalElements: this.totalElements,
//                 userId: this.userId
//             }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<WorkOrderDto.GetAllByFilterAndPagination>) => {
//                 this.loading = false;
//                 if (res) {
//                     this.dataOfAssignedWorkOrderList = res.content;
//                     this.totalElements = res.totalElements;
//                     this.totalPages = res.totalPages;
//                 }
//             });
//         }
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//
//     chooseSelectedItemForEdit(item: WorkOrderDto.GetAllByFilterAndPagination) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, workOrderId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: WorkOrderDto.GetAllByFilterAndPagination) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.VIEW, workOrderId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     ngOnDestroy(): void {
//     }
//
//     getAssetTitle(assetId: string) {
//         const assetF = this.assetList.find(asset => asset.id === assetId);
//         if (assetF) {
//             return assetF.name;
//         } else {
//             return '---';
//         }
//     }
//
//     getProjectTitle(projectId: string) {
//         const P = this.projectList.find(project => project.id === projectId);
//         if (P) {
//             return P.name;
//         } else {
//             return '---';
//         }
//     }
//
//     getStatusTitle(statusId: string) {
//         const S = this.workOrderStatusList.find(wos => wos.id === statusId);
//         if (S) {
//             return S.name;
//         } else {
//             return '---';
//         }
//     }
// }
//
//
// export namespace CourseParam {
//     export class RouteParam {
//
//     }
//
//     export class QueryParam {
//         paging: Paging;
//         getAllByFilterAndPagination: WorkOrderDto.GetAllByFilterAndPagination;
//         userId;
//
//         constructor() {
//             this.paging = new Paging();
//             this.paging.page = 0;
//             this.paging.size = 10;
//             this.userId = null;
//             this.getAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
//             this.getAllByFilterAndPagination.title = null;
//             this.getAllByFilterAndPagination.code = null;
//             this.getAllByFilterAndPagination.statusId = null;
//             this.getAllByFilterAndPagination.assetId = null;
//             this.getAllByFilterAndPagination.projectId = null;
//             this.getAllByFilterAndPagination.priority = null;
//             this.getAllByFilterAndPagination.startDate = null;
//             this.getAllByFilterAndPagination.endDate = null;
//
//         }
//     }
}


