import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkRequestDto} from '../../model/work-request-dto';
import {UserType} from '../../../securityManagement/model/userType';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {WorkRequestService} from '../../endpoint/work-request.service';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {Province} from "../../../dashboard/model/dto/province";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {TechnicianAssessmentService} from "../../endpoint/technician-assessment.service";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;


declare var $: any;

@Component({
    selector: 'app-submit-work-request-list',
    templateUrl: './submit-work-request-list.component.html',
    styleUrls: ['./submit-work-request-list.component.scss']
})
export class SubmitWorkRequestListComponent implements OnInit, OnChanges, OnDestroy {


///////////////////////////////
    @Input() readService;
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    name: string;
    assetId: string;

    entityList: WorkRequestDto.GetWorkRequest [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    myMoment = Moment;
    MyToolkit = Toolkit;
    MyToolkit2 = Toolkit2;
    assetList: AssetDto.CreateAsset[] = [];
    moment = Moment;
    listMode = true;
    MyModalSize = ModalSize;

    constructor(private entityService: WorkRequestService,
                public router: Router,
                public technicianAssessmentService: TechnicianAssessmentService,
                private cacheService: CacheService,
                protected assetService: AssetService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.name = params.term : '';
            params.assetId ? this.assetId = params.assetId : '';
            this.getPage();

        });
    }

    ngOnInit() {
        this.getAssetList();
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
        const user = JSON.parse(sessionStorage.getItem('user'));
        const dtoForSearch = new WorkRequestDto.GetAllByFilter();
        dtoForSearch.assetId = this.assetId;
        dtoForSearch.name = Toolkit2.Common.Fa2En(this.name);
        this.entityService.getAllWorkRequest(dtoForSearch, {
            paging,
            totalElements: -1,
            term: this.name,
            userId: user.id
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                    this.entityList.map(e => {
                        e.emSheetCode = '00000' + e.number;
                        e.emSheetCode = e.emSheetCode.slice(e.emSheetCode.length - 5);
                    });
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
                term: this.name,
                assetId: this.assetId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    selectedItemForView(item: WorkRequestDto.GetWorkRequest) {
        this.selectedWorkRequestId = item.id;
        this.showActionComponent('edit');
        // this.router.navigate(['action'], {
        //     queryParams: {workRequestId: item.id, mode: ActionMode.VIEW},
        //     relativeTo: this.activatedRoute
        // });
    }

    // ارزیابی
    getWorkRequestTechnician: WorkRequestDto.GetWorkRequestTechnician[];
    selectedWorkRequestIdForAssessment: string;
    AssessmentValueList = [
        {
            title: '5 (ضعیف)',
            value: 5
        },
        {
            title: '10 (متوسط)',
            value: 10
        },
        {
            title: '15 (خوب)',
            value: 15
        },
        {
            title: '20 (عالی)',
            value: 20
        }
    ];

    selectedItemForAssessment(item: WorkRequestDto.GetWorkRequest) {
        this.entityService.getWorkRequestTechnician(
            {workRequestId: item.id}).subscribe(
            (res: WorkRequestDto.GetWorkRequestTechnician[]) => {
                if (res) {
                    this.getWorkRequestTechnician = res;
                    if (this.getWorkRequestTechnician.length > 0) {
                        this.selectedWorkRequestIdForAssessment = item.id;
                        setTimeout(() => {
                            ModalUtil.showModal('assessmentListModal');
                        }, 10);
                    } else {
                        DefaultNotify.notifyDanger('کاربری برای تعمیر تعریف نگردیده است. ', '', NotiConfig.notifyConfig);
                        item.hasAssessment = false;
                    }

                }
            });
    }

    saveAssessment() {
        const dto: WorkRequestDto.SaveAssessment[] = [];
        const user = JSON.parse(sessionStorage.getItem('user'));
        for (const technician of this.getWorkRequestTechnician) {
            if (!technician.point) {
                DefaultNotify.notifyDanger('برای کاربر  ' + technician.userName + ' '
                    + technician.userFamily + ' ' + ' امتیاز انتخاب نشده است.', '', NotiConfig.notifyConfig);
                return;
            }
            const d = new WorkRequestDto.SaveAssessment();
            d.commenter = user.id;
            d.point = technician.point;
            d.userId = technician.userId;
            d.workRequestId = this.selectedWorkRequestIdForAssessment;
            dto.push(d)
        }
        this.technicianAssessmentService.saveAssessment(dto).subscribe((res: any) => {
            if (res) {
                const index = this.entityList.findIndex(e => e.id === this.selectedWorkRequestIdForAssessment);
                if (index !== -1) {
                    this.entityList[index].hasAssessment = false;
                }
                ModalUtil.hideModal('assessmentListModal');
            }
        });
    }

    showModalDelete(item: WorkRequestDto.GetWorkRequest, i) {
        console.log(item);
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.assetName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.deleteWorkRequest({workRequestId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === 'true') {
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
                    DefaultNotify.notifyDanger('این درخواست به دلیل قرار گرفتن در فرایند تعمیر قابل حذف نمی باشد. ', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    showProcessStepsModal = false;
    activityInstanceId: string;

    showProcessSteps(id) {
        this.activityInstanceId = id;
        this.showProcessStepsModal = true;
        setTimeout(() => {
            ModalUtil.showModal('showProcessStepsModal');
        }, 50);
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(): void {
        if (this.readService) {
            // this.getAssetList();
        }
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

    selectedWorkRequestId: string;

    showActionComponent(type) {
        if (type === 'add') {
            this.selectedWorkRequestId = null;
        }
        setTimeout(e => {
            this.listMode = false;
        }, 1);
    }

    backEmit() {
        console.log('backEmit');
        this.listMode = true;
        if (this.assetId) {
            setTimeout(e => {
                // $('#assets-search-btn').click();
                $('#submit-search').addClass('show');
            }, 5);
        }
    }

//// مقدار دهی درخواست رد شده
    selectedRejectionReason: WorkRequestDto.GetWorkRequest;

    selectForRejectionReason(item: WorkRequestDto.GetWorkRequest) {
        this.selectedRejectionReason = item;
        setTimeout(e => {
            ModalUtil.showModal('rejectionReasonModal');
        }, 10);

    }

//////////////////////////////////////
//
//   @Input() readService ;
//   componentData: ComponentData;
//   totalElements = 0;
//   assetId = '';
//   totalPages = 0;
//   count = 0;
//   userTypeList: UserType[] = [];
//   MyModalSize = ModalSize;
//   loading = false;
//   openModal = false;
//   getAllWorkRequestFilter = new WorkRequestDto.GetAllByFilter();
//   organizationsByAUserIdList: any[] = [];
//   parentAsset = new AssetDto.CreateAsset();
//   dateViewMode = DateViewMode;
//   tools = Tools;
//
//   roleList = new TokenRoleList();
//   selectedItemForDelete = new DeleteModel();
//   assetList: AssetDto.CreateAsset[] = [];
//   dataOfWorkRequestList: WorkRequestDto.GetWorkRequest [] = [];
//   myMoment = Moment;
//   MyToolkit = Toolkit;
//   MyToolkit2 = Toolkit2;
//   toolkit2 = Toolkit2;
//
//   constructor(
//     protected workRequestService: WorkRequestService,
//     protected userTypeService: UserTypeService,
//     protected assetService: AssetService,
//     protected activatedRoute: ActivatedRoute,
//     private cacheService: CacheService,
//     protected router: Router
//   ) {
//
//
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   ngOnInit() {
//     this.getRoleListKey();
//   }
//
//   ngOnChanges() {
//     if (this.readService) {
//       this.getAssetList();
//     }
//   }
//
//   getRoleListKey() {
//     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//       if (res) {
//         this.roleList = res;
//       }
//     });
//   }
//
//   getAssetList() {
//     this.assetService.getAll().pipe(takeUntilDestroyed(this))
//       .subscribe((res: AssetDto.CreateAsset[]) => {
//         if (res && res.length) {
//           this.assetList = res;
//         }
//       });
//   }
//
//   onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//   }
//
//   onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//     this.componentData.myQuery = queryParam;
//     this.loading = true;
//     this.getSubmitWorkList();
//   }
//
//   onReceiveRouteData(routeData: any) {
//   }
//
//   getSubmitWorkList() {
//     this.dataOfWorkRequestList = [];
//     const user = JSON.parse(sessionStorage.getItem('user'));
//     this.loading = true;
//     this.getAllWorkRequestFilter.name = this.componentData.myQuery.name;
//     this.getAllWorkRequestFilter.assetId = this.componentData.myQuery.assetId;
//     this.workRequestService.getAllWorkRequest(this.getAllWorkRequestFilter, {
//       paging: this.componentData.myQuery.paging,
//       totalElements: this.totalElements,
//       userId: user.id
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<WorkRequestDto.GetWorkRequest>) => {
//       this.loading = false;
//       if (res) {
//         this.dataOfWorkRequestList = res.content;
//         this.count = res.totalElements;
//         this.totalElements = res.totalElements;
//         this.totalPages = res.totalPages;
//       }
//     });
//   }
//
//
//   setPage(page) {
//     super.setToQueryParams({page: page, size: this.componentData.myQuery.paging.size});
//   }
//
//
//   search() {
//     this.totalElements = 0;
//     super.setToQueryParams({
//       page: 0,
//       size: 10,
//       name: this.getAllWorkRequestFilter.name,
//       assetId: this.getAllWorkRequestFilter.assetId
//     });
//   }
//
//   selectedItemForView(item: WorkRequestDto.GetWorkRequest) {
//     this.router.navigate(['action'], {
//       queryParams: {workRequestId: item.id, mode: ActionMode.VIEW},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   showModalDelete(item, i) {
//     console.log(item);
//     this.selectedItemForDelete.loading = false;
//
//     this.selectedItemForDelete.id = item.id;
//     this.selectedItemForDelete.title = ' آیا    ' + item.workRequestTitle + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.workRequestService.deleteWorkRequest({workRequestId: this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//         if (res.message) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         } else if (res === 'true') {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfWorkRequestList = this.dataOfWorkRequestList.filter((e) => {
//             return e.id !== this.selectedItemForDelete.id;
//           });
//           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//         } else if (res !== 'true') {
//           DefaultNotify.notifyDanger(res);
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//       }, error => {
//       });
//
//     } else {
//       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//     }
//   }
//
//
//   setParentMethod(event) {
//     console.log('eventOne====>>', event);
//     this.getAllWorkRequestFilter.assetId = event.id;
//     console.log('eventOne2====>>', this.getAllWorkRequestFilter.assetId);
//     this.parentAsset.code = event.code;
//     this.parentAsset.name = event.name;
//   }
//
//   ngOnDestroy(): void {
//   }
//
}


export class ComponentData {
    myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
}

export namespace CourseParam {
    export class RouteParam {

    }

    export class QueryParam {
        paging: Paging;
        name;
        assetId;

        constructor() {
            this.name = null;
            this.assetId = null;
            this.paging = new Paging();
            this.paging.page = 0;
            this.paging.size = 10;
        }
    }
}
