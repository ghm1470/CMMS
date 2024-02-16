import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {
    BaseAnyComponentSeven,
} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import Scheduling = WorkOrderDto.Scheduling;
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {ExcelService} from "../../endpoint/excel.service";
import * as FileSaver from "file-saver";
import {NumberTools} from "../../../../shared/tools/numberTools";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;
import {RequestType} from "../../../worktable/feature/list/worktable-list.component";

declare var $: any;

@Component({
    selector: 'app-work-order-list',
    templateUrl: './work-order-list.component.html',
    styleUrls: ['./work-order-list.component.scss']
})
export class WorkOrderListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    constructor(private entityService: WorkOrderService,
                public router: Router,
                public excelService: ExcelService,
                public assetService: AssetService,
                public projectService: ProjectService,
                public workOrderStatusService: WorkOrderStatusService,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.schedulingList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Scheduling>(Scheduling));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getPage();

        });
    }

    @Input() readSearchService;
    getAllByFilterAndPagination: WorkOrderDto.GetAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
    priorityList = [] as EnumObject[];
    schedulingList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    workOrderSearchModal = ModalUtil.generateModalId();
    searchBoxSelected = new WorkOrderDto.SearchBoxSelected();
    searchBoxSelectedCopy = new WorkOrderDto.SearchBoxSelected();
    dateViewMode = DateViewMode;
    moment = Moment;
///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    listMode = true;

    entityList: WorkOrderDto.GetAllByFilterAndPaginationTree [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    selectedWorkOrderIdForCheck: string;
    loadingForCheckUpdate = false;
    loadingForCheckDelete = false;

    selectedItemIdForAction: string;
    modeForAction = ActionMode.VIEW;

    startDateChecker = false;
    myMoment = Moment;
    MyModalSize = ModalSize;

    failureDateFrom: any;
    failureDateUntil: any;

    assetList: AssetDto.CreateAsset[] = [];

    projectList: ProjectDto.Create[] = [];

    workOrderStatusList: WorkOrderStatus[] = [];

    ngOnInit() {
        this.getRoleListKey();
        this.getAssetList();
        this.getProjectList();
        this.getWorkOrderStatusList();
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
        if (this.loading) {
            return;
        }
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        if (this.dateChek()) {
            this.getAllByFilterAndPagination.failureDateFrom = null;
            this.getAllByFilterAndPagination.failureDateUntil = null;
            if (this.failureDateFrom) {
                this.getAllByFilterAndPagination.failureDateFrom = this.myMoment.convertJaliliToIsoDateWithTime(this.failureDateFrom);
            }
            if (this.failureDateUntil) {
                this.getAllByFilterAndPagination.failureDateUntil = this.myMoment.convertJaliliToIsoDateWithTime(this.failureDateUntil);
            }
            this.loading = true;

            const dto = JSON.parse(JSON.stringify(this.getAllByFilterAndPagination));
            if (dto.pmSheetCode || dto.pmSheetCode === 0) {
                dto.pmSheetCode = +dto.pmSheetCode as any;
                dto.number = +dto.pmSheetCode as any;
            }
            this.entityService.getAllByFilterAndPagination(dto, {
                paging,
                totalElements: -1,
            })
                // this.entityService.getAll()
                .subscribe((res: any) => {
                    this.loading = false;
                    if (res) {
                        this.entityList = res.content;
                        this.length = res.totalElements;
                        this.entityList.map(e => {
                            if (e.number) {
                                e.pmSheetCode = '00000' + e.number;
                                e.pmSheetCode = e.pmSheetCode.slice(e.pmSheetCode.length - 5);
                            }

                        });

                    }
                }, error => {
                    this.loading = false;
                });
        }
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

    chooseSelectedItemForEdit(item: WorkOrderDto.GetAllByFilterAndPaginationTree) {
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
                this.selectedItemIdForAction = item.id;
                this.modeForAction = ActionMode.EDIT;
                this.showActionComponent();
                // this.router.navigate(['action'], {
                //     queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                //     relativeTo: this.activatedRoute
                // });
            }
        }, error => {
            this.loadingForCheckUpdate = false;
        });

    }

    chooseSelectedItemForView(item: WorkOrderDto.GetAllByFilterAndPaginationTree) {
        this.selectedItemIdForAction = item.id;
        this.modeForAction = ActionMode.VIEW;
        this.showActionComponent();
        // this.router.navigate(['action'], {
        //     queryParams: {mode: ActionMode.VIEW, entityId: item.id},
        //     relativeTo: this.activatedRoute
        // });
    }

    showActionComponent() {
        setTimeout(e => {
            this.listMode = false;
        }, 1);
    }

    showModalDelete(item: WorkOrderDto.GetAllByFilterAndPaginationTree, i) {
        if (this.loadingForCheckDelete) {
            return;
        }

        this.selectedWorkOrderIdForCheck = item.id;
        this.loadingForCheckDelete = true;
        this.entityService.checkIfWorkOrderIsInProcess({workOrderId: item.id}).subscribe((res: boolean) => {
            this.loadingForCheckDelete = false;
            if (res === true) {
                DefaultNotify.notifyDanger(' دستور کار فوق در روند تعمیرات قرار دارد و امکان حذف آن نمی باشد. ', '', NotiConfig.notifyConfig);
            } else {
                this.selectedItemForDelete.loading = false;
                this.selectedItemForDelete.id = item.id;
                this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
                this.selectedItemForDelete.index = i;
                setTimeout(e => {
                    ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
                }, 10);
            }
        }, error => {
            this.loadingForCheckDelete = false;
        });

    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({workOrderId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger('این آیتم قابل حذف نمی باشد.', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        this.setJqueryDate();
        // $('#startDate').azPersianDateTimePicker({
        //     Placement: 'left', // default is 'bottom'
        //     Trigger: 'focus', // default is 'focus',
        //     enableTimePicker: false, // default is true,
        //     TargetSelector: '', // default is empty,
        //     GroupId: '', // default is empty,
        //     ToDate: false, // default is false,
        //     FromDate: false, // default is false,
        //     targetTextSelector: $('#startDate'),
        //     disableBeforeToday: false,
        // }).on('change', (e) => {
        //     try {
        //         this.startDateChecker = false;
        //         this.getAllByFilterAndPagination.startDate =
        //             this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        //         if (!isNullOrUndefined(this.getAllByFilterAndPagination.startDate) && !
        //             isNullOrUndefined(this.getAllByFilterAndPagination.endDate)) {
        //             if (this.getAllByFilterAndPagination.endDate < this.getAllByFilterAndPagination.startDate) {
        //                 this.startDateChecker = true;
        //                 DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد');
        //             }
        //         }
        //     } catch (e) {
        //         DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
        //     }
        // });
        // $('#endDate').azPersianDateTimePicker({
        //     Placement: 'left', // default is 'bottom'
        //     Trigger: 'focus', // default is 'focus',
        //     enableTimePicker: false, // default is true,
        //     TargetSelector: '', // default is empty,
        //     GroupId: '', // default is empty,
        //     ToDate: false, // default is false,
        //     FromDate: false, // default is false,
        //     targetTextSelector: $('#endDate'),
        //     disableBeforeToday: false,
        // }).on('change', (e) => {
        //     try {
        //         this.startDateChecker = false;
        //         this.getAllByFilterAndPagination.endDate = this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        //         if (!isNullOrUndefined(this.getAllByFilterAndPagination.startDate) && !isNullOrUndefined(this.getAllByFilterAndPagination.endDate)) {
        //             if (this.getAllByFilterAndPagination.endDate < this.getAllByFilterAndPagination.startDate) {
        //                 this.startDateChecker = true;
        //                 DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد');
        //
        //             }
        //         }
        //     } catch (e) {
        //         DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
        //     }
        // });
    }

    setJqueryDate() {
        setTimeout(e1 => {

            $('#failureDateFrom').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: true, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#failureDateFrom'),
                disableBeforeToday: false,
                textFormat: 'yyyy/MM/dd  -  HH:mm',
            }).on('change', (e) => {
                this.failureDateFrom = $(e.currentTarget).val();
                // this.getAllByFilterAndPagination.from =
                //     this.myMoment.convertJaliliToIsoDateWithTime($(e.currentTarget).val());
            });
            $('#failureDateUntil').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: true, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#failureDateUntil'),
                disableBeforeToday: false,
                textFormat: 'yyyy/MM/dd  -  HH:mm',
            }).on('change', (e) => {
                this.failureDateUntil = $(e.currentTarget).val();

            });
        }, 10);

    }

    dateChek() {
        if (!this.failureDateFrom || !this.failureDateUntil) {
            return true;
        }
        if (this.failureDateFrom > this.failureDateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.', '', NotiConfig.notifyConfig);
            return false;
        } else {
            return true;
        }
    }

    ngOnChanges() {
        if (this.readSearchService) {
            this.getAssetList();
            this.getProjectList();
            this.getWorkOrderStatusList();
        }

    }

    getAssetList() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                    this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                    // this.setListData();
                }
            });
    }

    getProjectList() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                    // this.setListData();
                }
            });
    }

    getWorkOrderStatusList() {
        this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderStatus[]) => {
                if (res && res.length) {
                    this.workOrderStatusList = res;
                    // this.setListData();
                }
            });
    }

    hideModalAssetSearch() {
        this.startDateChecker = false;
        $('#startDate').val('');
        $('#endDate').val('');
        this.getAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
        ModalUtil.hideModal(this.workOrderSearchModal);
        this.searchBoxSelectedCopy = JSON.parse(JSON.stringify(this.searchBoxSelected));
    }

    backEmit() {
        this.listMode = true;
        this.setJqueryDate();
        if (this.getAllByFilterAndPagination.assetId ||
            !isNullOrUndefined(this.getAllByFilterAndPagination.fromSchedule) ||
            this.getAllByFilterAndPagination.failureDateUntil ||
            this.getAllByFilterAndPagination.failureDateFrom) {

            setTimeout(e => {
                $('#work-search').addClass('show');

                setTimeout(() => {
                    if (!isNullOrUndefined(this.getAllByFilterAndPagination.failureDateUntil)) {
                        const jFailureDateUntil = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                        (new Date(this.getAllByFilterAndPagination.failureDateUntil).toISOString()));
                        $('#failureDateUntil').val(jFailureDateUntil).trigger('change');

                    }
                    if (!isNullOrUndefined(this.getAllByFilterAndPagination.failureDateFrom)) {
                        const jFailureDateFrom = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                        (new Date(this.getAllByFilterAndPagination.failureDateFrom).toISOString()));
                        $('#failureDateFrom').val(jFailureDateFrom).trigger('change');

                    }
                }, 5);
            }, 5);
        }
    }

    // excel
    fireEvent() {
        if (this.dateChek()) {
            this.getAllByFilterAndPagination.failureDateFrom = null;
            this.getAllByFilterAndPagination.failureDateUntil = null;
            if (this.failureDateFrom) {
                this.getAllByFilterAndPagination.failureDateFrom = this.myMoment.convertJaliliToIsoDateWithTime(this.failureDateFrom);
            }
            if (this.failureDateUntil) {
                this.getAllByFilterAndPagination.failureDateUntil = this.myMoment.convertJaliliToIsoDateWithTime(this.failureDateUntil);
            }
            this.loading = true;
            this.excelService.downloadWorkOrder(this.getAllByFilterAndPagination)
                // this.entityService.getAll()
                .subscribe((res: any) => {
                    this.loading = false;
                    const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' -آرشیو دستور کار   ' + '.xlsx');
                    FileSaver.saveAs(res, name2);
                }, error => {
                    this.loading = false;
                });
        }

    }

    entityListForFile: any [] = [];


    getAllByFilterAndPaginationCopy: WorkOrderDto.GetAllByFilterAndPagination;

    getAllWorkOrderForExcel(type: string) {
        if (JSON.stringify(this.getAllByFilterAndPaginationCopy) === JSON.stringify(this.getAllByFilterAndPagination)) {
            if (this.entityListForFile.length > 0) {
                setTimeout(() => {
                    if (type === 'excel') {
                        this.fireEventBayType();
                    } else if (type === 'pdf') {
                        this.openPDF();
                    }
                }, 10);
            } else {
                DefaultNotify.notifyDanger('نتیجه ای یافت نشد.', '', NotiConfig.notifyConfig);
            }
        } else {
            this.getAllByFilterAndPaginationCopy = JSON.parse(JSON.stringify(this.getAllByFilterAndPagination))
            this.entityListForFile = [];
            this.entityService.getAllWorkOrderForExcel(this.getAllByFilterAndPagination).subscribe((res: any[]) => {
                if (res.length > 0) {
                    this.entityListForFile = res;
                    setTimeout(() => {
                        if (type === 'excel') {
                            this.fireEventBayType();
                        } else if (type === 'pdf') {
                            this.openPDF();

                        }
                    }, 0.0000000000000000000000000000000000000000000001);
                } else {
                    DefaultNotify.notifyDanger('نتیجه ای یافت نشد.', '', NotiConfig.notifyConfig);
                }
            });
        }
    }

    fireEventBayType() {
        let prefix = name || "آرشیو دستور کار ";
        let targetTableElm = document.getElementById('htmlData');
        let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{sheet: prefix});
        const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' -آرشیو دستور کار   ' + '.xlsx');

        XLSX.writeFile(wb, name2);
    }

    loadingOpenPdf = false;

    openPDF() {

        this.loadingOpenPdf = true;
        var imgData = document.getElementById('htmlData');


        html2canvas(imgData).then((canvas) => {

            var imgWidth = 210;
            var pageHeight = 290;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;


            var doc = new jsPDF('p', 'mm');
            var position = 0;
            var pageData = canvas.toDataURL('image/jpeg', 1.0);
            var imgData = encodeURIComponent(pageData);
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(5);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 210, 295);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                doc.setLineWidth(5);
                doc.setDrawColor(255, 255, 255);
                doc.rect(0, 0, 210, 295);
                heightLeft -= pageHeight;
            }
            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()) + ' - آرشیو دستور کار  ' + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;


        });


    }
}

//////////////////////////////////////

//
//     @Input() readSearchService;
//     totalElements = 0;
//     totalPages = 0;
//     dataOfWorkOrderList: WorkOrderDto.GetAllByFilterAndPaginationTree [] = [];
//     getAllByFilterAndPagination: WorkOrderDto.GetAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
//     assetList: AssetDto.CreateAsset[] = [];
//     projectList: ProjectDto.Create[] = [];
//     workOrderStatusList: WorkOrderStatus[] = [];
//     priorityList = [] as EnumObject[];
//     schedulingList = [] as EnumObject[];
//     maintenanceTypeList = [] as EnumObject[];
//     selectedItemForDelete = new DeleteModel();
//     myMoment = Moment;
//     MyModalSize = ModalSize;
//     roleList = new TokenRoleList();
//     workOrderSearchModal = ModalUtil.generateModalId();
//     searchBoxSelected = new WorkOrderDto.SearchBoxSelected();
//     searchBoxSelectedCopy = new WorkOrderDto.SearchBoxSelected();
//     dateViewMode = DateViewMode;
//     startDateChecker = false;
//     useStartDate = false;
//     useEndDate = false;
//     componentData = new ComponentData();
//     tools = Tools;
//
//     constructor(
//         protected _Router: Router,
//         protected _ActivatedRoute: ActivatedRoute,
//         public workOrderService: WorkOrderService,
//         public workOrderStatusService: WorkOrderStatusService,
//         public assetService: AssetService,
//         public projectService: ProjectService,
//         private cacheService: CacheService,
//     ) {
//         super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//         this.componentData = new ComponentData();
//         this.receiveData();
//
//         this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
//         this.schedulingList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Scheduling>(Scheduling));
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
//     ngOnChanges() {
//         if (this.readSearchService) {
//             this.getAssetList();
//             this.getProjectList();
//             this.getWorkOrderStatusList();
//         }
//
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
//     getWorkOrderStatusList() {
//         this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: WorkOrderStatus[]) => {
//                 if (res && res.length) {
//                     this.workOrderStatusList = res;
//                     // this.setListData();
//                 }
//             });
//     }
//
//     getProjectList() {
//         this.projectService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: ProjectDto.Create[]) => {
//                 if (res && res.length) {
//                     this.projectList = res;
//                     // this.setListData();
//                 }
//             });
//     }
//
//     getAssetList() {
//         this.assetService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: AssetDto.CreateAsset[]) => {
//                 if (res && res.length) {
//                     this.assetList = res;
//                     // this.setListData();
//                 }
//             });
//     }
//
//     ngAfterViewInit(): void {
//         const this = this;
//         $('#startDate').azPersianDateTimePicker({
//             Placement: 'left', // default is 'bottom'
//             Trigger: 'focus', // default is 'focus',
//             enableTimePicker: false, // default is true,
//             TargetSelector: '', // default is empty,
//             GroupId: '', // default is empty,
//             ToDate: false, // default is false,
//             FromDate: false, // default is false,
//             targetTextSelector: $('#startDate'),
//             disableBeforeToday: false,
//         }).on('change', (e) => {
//             try {
//                 this.startDateChecker = false;
//                 this.getAllByFilterAndPagination.startDate =
//                     this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//                 if (!isNullOrUndefined(this.getAllByFilterAndPagination.startDate) && !
//                     isNullOrUndefined(this.getAllByFilterAndPagination.endDate)) {
//                     if (this.getAllByFilterAndPagination.endDate < this.getAllByFilterAndPagination.startDate) {
//                         this.startDateChecker = true;
//                         DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد');
//                     }
//                 }
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
//             disableBeforeToday: false,
//         }).on('change', (e) => {
//             try {
//                 this.startDateChecker = false;
//                 this.getAllByFilterAndPagination.endDate = this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
//                 if (!isNullOrUndefined(this.getAllByFilterAndPagination.startDate) && !isNullOrUndefined(this.
//                 getAllByFilterAndPagination.endDate)) {
//                     if (this.getAllByFilterAndPagination.endDate < this.getAllByFilterAndPagination.startDate) {
//                         this.startDateChecker = true;
//                         DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد');
//
//                     }
//                 }
//             } catch (e) {
//                 DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
//             }
//         });
//     }
//
//     showModalAssetSearch() {
//         ModalUtil.showModal(this.workOrderSearchModal);
//     }
//
//     hideModalAssetSearch() {
//         this.startDateChecker = false;
//         $('#startDate').val('');
//         $('#endDate').val('');
//         this.getAllByFilterAndPagination = new WorkOrderDto.GetAllByFilterAndPagination();
//         ModalUtil.hideModal(this.workOrderSearchModal);
//         this.searchBoxSelectedCopy = JSON.parse(JSON.stringify(this.searchBoxSelected));
//     }
//
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.getWorkOrderList();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//     getWorkOrderList() {
//         if (this.startDateChecker) {
//             DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد');
//             return;
//         }
//         this.workOrderService.getAllByFilterAndPagination(this.getAllByFilterAndPagination, {
//             paging: this.componentData.myQuery.paging,
//             totalElements: this.totalElements
//         }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<WorkOrderDto.GetAllByFilterAndPaginationTree>) => {
//             if (res) {
//                 this.dataOfWorkOrderList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//     }
//
//     chooseSelectedItemForEdit(item: WorkOrderDto.GetAllByFilterAndPaginationTree) {
//         this._Router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, workOrderId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: WorkOrderDto.GetAllByFilterAndPaginationTree) {
//         this._Router.navigate(['action'], {
//             queryParams: {mode: ActionMode.VIEW, workOrderId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//
//     deleteItem(event) {
//         if (event) {
//             this.selectedItemForDelete.loading = true;
//             this.workOrderService.delete({workOrderId: this.selectedItemForDelete.id})
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//
//                 if (!res.message) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//                     this.dataOfWorkOrderList = this.dataOfWorkOrderList
//                         .filter((e) => {
//                             return e.id !== this.selectedItemForDelete.id;
//                         });
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
//     search() {
//         this.totalElements = 0;
//         this.totalPages = 0;
//         if (this.componentData.myQuery.paging.page === 0) {
//             this.getWorkOrderList();
//         } else {
//             this.componentData.myQuery.paging.page = 0;
//             this.router.navigate([], {
//                 queryParams: {
//                     page: this.componentData.myQuery.paging.page,
//                     size: this.componentData.myQuery.paging.size
//                 },
//                 relativeTo: this.activatedRoute
//             });
//         }
//     }
// }
//
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

