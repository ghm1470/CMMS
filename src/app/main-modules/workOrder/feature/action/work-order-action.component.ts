import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {UploadService} from '../../../../shared/service/upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FileModel} from '../../../../shared/model/fileModel';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkOrderAccessService} from '../../../activity/service/work-order-access/work-order-access.service';
import {WorkOrderAccess} from '../../../activity/model/work-order-access';
import {Moment} from "../../../../shared/shared/tools/date/moment";
import MaintenanceType = WorkOrderDto.MaintenanceType;
import Priority = WorkOrderDto.Priority;
import DocumentFile = CompanyDto.DocumentFile;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-work-order-action',
    templateUrl: './work-order-action.component.html',
    styleUrls: ['./work-order-action.component.scss']
})
export class WorkOrderActionComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Output('workOrderIdForWorkTable') private workOrderIdForWorkTable = new EventEmitter<any>();
    @Input() formIdList: string[] = [];
    @Input() modeFromAHistory: ActionMode;
    @Input() workOrderAccessId: string;
    @Input() from: string;
    formIdDto = new WorkOrderDto.FormIdForView();
    @Input() mode: ActionMode = ActionMode.ADD;
    @Input() workOrderId: string;
    actionMode = ActionMode;
    workOrder = new WorkOrderDto.Create();
    workOrderCopy = new WorkOrderDto.Create();
    typeOfNotification = 'workOrder';
    disabledButton = false;
    myPattern = MyPattern;
    files: Array<File> = [];
    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
    ];
    fileModel: Array<any> = [];
    doSave = false;
    menuStatus = false;
    projectList: ProjectDto.Create[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    workOrderStatusList: WorkOrderStatus[] = [];
    workOrderAccess = new WorkOrderAccess();
    openModal = false;
    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    parentAsset = new AssetDto.CreateAsset();

    myMoment = Moment;

    basicInformation = false;
    completionDetails = false;
    tasks = false;
    parts = false;
    miscCost = false;
    notification = false;
    reports = false;
    file = false;
    taskGroup = false;
    loading = false;
    selectableTab = false;
    fromWorkOrder = false;

    SecondaryInformation = false;
    startDateChecker = false;
    deadDateChecker = false;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();

    constructor(
        public location: Location,
        public workOrderService: WorkOrderService,
        public workOrderAccessService: WorkOrderAccessService,
        public workOrderStatusService: WorkOrderStatusService,
        public projectService: ProjectService,
        public assetService: AssetService,
        public uploadService: UploadService,
        private activatedRoute: ActivatedRoute,
        public router: Router
    ) {
        // this.workOrder.assetId = '-1';
        // this.workOrder.statusId = '-1';
        if (this.activatedRoute.snapshot.queryParams.mode) {
            this.mode = this.activatedRoute.snapshot.queryParams.mode;
        }
        if (this.activatedRoute.snapshot.queryParams.entityId) {
            this.workOrderId = this.activatedRoute.snapshot.queryParams.entityId;
        }

        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
    }

    ngOnInit() {

        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW || this.workOrderId) {
            if (!isNullOrUndefined(this.workOrderId)) {
                // this.getOne();
                this.menuStatus = true;
            }
        }
        // this.getAllWorkOrderStatus();
        // this.getAllProject();
        // this.getAllAsset();

        ////////// دسترسی فرم ها///
        for (const item of this.formIdList) {
            if (item === 'workOrder') {
                this.formIdDto.workOrder = true;

            }
            if (item === 'information') {
                this.formIdDto.information = true;
                if (this.selectableTab === true) {
                    this.basicInformation = true;
                }

            }
            if (item === 'completionDetails') {
                this.formIdDto.completionDetails = true;
                if (this.selectableTab === true) {
                    this.completionDetails = true;
                }
            }
            if (item === 'tasks') {
                this.formIdDto.tasks = true;
                if (this.selectableTab === true) {
                    this.tasks = true;
                }
            }
            if (item === 'taskGroup') {
                this.formIdDto.taskGroup = true;
                if (this.selectableTab === true) {
                    this.taskGroup = true;
                }
            }
            if (item === 'workOrderPart') {
                this.formIdDto.workOrderPart = true;
                if (this.selectableTab === true) {
                    this.parts = true;
                }
            }
            if (item === 'miscCost') {
                this.formIdDto.miscCost = true;
                if (this.selectableTab === true) {
                    this.miscCost = true;
                }
            }
            if (item === 'notification') {
                this.formIdDto.notification = true;
                if (this.selectableTab === true) {
                    this.notification = true;
                }
            }
            if (item === 'reports') {
                this.formIdDto.reports = true;
                if (this.selectableTab === true) {
                    this.reports = true;
                }
            }
            if (item === 'file') {
                this.formIdDto.file = true;
                if (this.selectableTab === true) {
                    this.file = true;
                }
            }
            console.table('this.formIdDto', this.formIdDto);
        }
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //   $('#informationInMenu2').click();
        //   this.basicInformation = true;
        // }, 500);
        if (!this.fromWorkOrder) {
            this.calendar();
        }
    }

    checkDates() {
        const requiredCompletionDate: any = document.getElementById('requiredCompletionDate');
        const startDate: any = document.getElementById('startDate');
        const endDate: any = document.getElementById('endDate');
        let resEnd = true;
        let resReq = true;
        if (startDate.value && endDate.value) {
            resEnd = startDate.value <= endDate.value;
        }
        if (startDate.value && requiredCompletionDate.value) {
            resReq = startDate.value <= requiredCompletionDate.value;
        }
        if (resEnd === false) {
            DefaultNotify.notifyDanger('تاریخ شروع کار باید قبل از تاریخ پایان کار باشد.', '', NotiConfig.notifyConfig);

        } else if (resReq === false) {
            DefaultNotify.notifyDanger('تاریخ شروع کار باید قبل ازآخرین مهلت باشد.', '', NotiConfig.notifyConfig);
        }
        return resReq && resEnd;
    }

    getAllAsset() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                    this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                }
            });
    }

    getAllProject() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                }
            });
    }

    getAllWorkOrderStatus() {
        this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderStatus[]) => {
                if (res && res.length) {
                    this.workOrderStatusList = res;
                }
            });
    }

    getOneWorkOrderAccess() {
        this.workOrderAccessService.getOne({workOrderAccessId: this.workOrderAccessId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderAccess) => {
                if (res) {
                    this.workOrderAccess = res;
                    setTimeout(() => {
                        if (this.workOrderAccess.requiredCompletionDate) {
                            $('#requiredCompletionDate').azPersianDateTimePicker({
                                Placement: 'left', // default is 'bottom'
                                Trigger: 'focus', // default is 'focus',
                                enableTimePicker: false, // default is true,
                                TargetSelector: '', // default is empty,
                                GroupId: '', // default is empty,
                                ToDate: false, // default is faalerlse,
                                FromDate: false, // default is false,
                                targetTextSelector: $('#requiredCompletionDate'),
                                disableBeforeToday: true
                            }).on('change', (e) => {
                                try {
                                    this.workOrder.requiredCompletionDate =
                                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                } catch (e) {
                                    DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                                }
                            });
                        }
                        if (this.workOrderAccess.startDate) {
                            $('#startDate').azPersianDateTimePicker({
                                Placement: 'left', // default is 'bottom'
                                Trigger: 'focus', // default is 'focus',
                                enableTimePicker: false, // default is true,
                                TargetSelector: '', // default is empty,
                                GroupId: '', // default is empty,
                                ToDate: false, // default is false,
                                FromDate: false, // default is false,
                                targetTextSelector: $('#startDate'),
                                disableBeforeToday: true
                            }).on('change', (e) => {
                                try {
                                    this.workOrder.startDate =
                                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                    if (!isNullOrUndefined(this.workOrder.startDate) && !
                                        isNullOrUndefined(this.workOrder.endDate)) {
                                        if (this.workOrder.endDate < this.workOrder.startDate) {
                                            this.startDateChecker = true;
                                            DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد', '', NotiConfig.notifyConfig);
                                        }
                                    }
                                } catch (e) {
                                    DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                                }
                            });
                        }
                        if (this.workOrderAccess.endDate) {
                            $('#endDate').azPersianDateTimePicker({
                                Placement: 'left', // default is 'bottom'
                                Trigger: 'focus', // default is 'focus',
                                enableTimePicker: false, // default is true,
                                TargetSelector: '', // default is empty,
                                GroupId: '', // default is empty,
                                ToDate: false, // default is false,
                                FromDate: false, // default is false,
                                targetTextSelector: $('#endDate'),
                                disableBeforeToday: true
                            }).on('change', (e) => {
                                try {
                                    this.workOrder.endDate =
                                        this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                    if (!isNullOrUndefined(this.workOrder.startDate) && !
                                        isNullOrUndefined(this.workOrder.endDate)) {
                                        if (this.workOrder.endDate < this.workOrder.startDate) {
                                            this.startDateChecker = true;
                                            DefaultNotify.notifyDanger('تاریخ شروع نمی تواند جلوتر از تاریخ پایان باشد', '', NotiConfig.notifyConfig);
                                        }
                                    }
                                } catch (e) {
                                    DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                                }
                            });
                        }

                    }, 50);
                }
            });
    }

    getOne() {
        this.loading = true;
        this.workOrderService.getOne({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.Create) => {
            this.loading = false;

            if (res) {
                this.workOrder = res;
                this.parentAsset.name = res.assetName;
                this.workOrderCopy = JSON.parse(JSON.stringify(res));
                this.basicInformation = true;
                $('#informationInMenu').click();
                $('#informationInMenu').click();
                $('#informationInMenu').click();
                setTimeout(e => {

                    if (!isNullOrUndefined(this.workOrder.requiredCompletionDate)) {
                        $('#requiredCompletionDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.requiredCompletionDate).toISOString()))).trigger('change');
                    }
                    if (!isNullOrUndefined(this.workOrder.startDate)) {
                        $('#startDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.startDate).toISOString()))).trigger('change');
                    }
                    if (!isNullOrUndefined(this.workOrder.endDate)) {
                        $('#endDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.endDate).toISOString()))).trigger('change');
                    }
                    this.calendar();
                }, 100);

                this.setActiveTab();
            }
        });

    }

    ///// خواندن تب فعال

    setActiveTab() {
        ///// خواندن تب فعال
        const tabTitle = this.activatedRoute.snapshot.queryParams.tabTitle;
        const tabIndex = +this.activatedRoute.snapshot.queryParams.tabIndex;
        if (tabTitle && tabIndex) {
            // this.workOrder = false;
            switch (tabIndex) {
                case 0: {
                    // this.workOrder = true;
                    // this.setCarousel(1, 'completionDetailsB');
                    break;
                }
                case 1: {
                    this.completionDetails = true;
                    // this.setCarousel(tabIndex, 'completionDetailsB');
                    break;
                }
                case 2: {
                    this.basicInformation = true;
                    // this.setCarousel(tabIndex, 'basicInformationB');
                    break;
                }
                case 3: {
                    this.tasks = true;
                    // this.setCarousel(tabIndex, 'tasksB');
                    break;
                }
                case 4: {
                    this.taskGroup = true;
                    // this.setCarousel(tabIndex, 'taskGroupB');
                    break;
                }
                case 5: {
                    this.parts = true;
                    // this.setCarousel(tabIndex, 'partsB');
                    break;
                }
                case 6: {
                    this.miscCost = true;
                    // this.setCarousel(tabIndex, 'miscCostB');
                    break;
                }
                case 7: {
                    this.file = true;
                    // this.setCarousel(tabIndex, 'fileB');
                    break;
                }
                case 8: {
                    // this.formComplete = true;
                    break;
                }
            }

            $('.carousel-item').removeClass('active');
            setTimeout(e => {
                $('#' + tabTitle).click();
            }, 10);
        }
        ///// خواندن تب فعال!!!!!!!!!!!!
    }

    navigate(index, id) {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                entityId: this.workOrderId,
                mode: this.mode,
                tabTitle: id,
                tabIndex: index
            }
        });

    }

    loadingAction = false;

    action(form) {
        if (this.loadingAction) {
            return;
        }
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // if (!this.workOrder.startDate) {
        //     DefaultNotify.notifyDanger('زمان شروع کار را وارد کنید.');
        //     return;
        // }
        // if (!this.workOrder.requiredCompletionDate) {
        //     DefaultNotify.notifyDanger('آخرین مهلت را وارد کنید.');
        //     return;
        // }

        if (this.deadDateChecker) {
            DefaultNotify.notifyDanger('تاریخ پایان کار نمی تواند جلوتر از تاریخ اخرین مهلت باشد', '', NotiConfig.notifyConfig);

            return;
        }
        if (this.startDateChecker) {
            DefaultNotify.notifyDanger('تاریخ شروع کار نمی تواند جلوتر از تاریخ پایان کار باشد', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.checkDates()) {

            if (this.mode === ActionMode.ADD) {
                this.loadingAction = true;
                this.workOrderService.create(this.workOrder)
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    if (res && res.id) {
                        DefaultNotify.notifySuccess('با موفقیت افزوده شد.'), '', NotiConfig.notifyConfig;
                        this.menuStatus = true;
                        this.workOrderId = res.id;
                        this.workOrderIdForWorkTable.emit(res.id);
                        this.workOrder.id = res.id;
                        this.mode = ActionMode.EDIT;
                        $('#informationInMenu').click();
                    } else {
                        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                    }
                }, error => {
                    this.loadingAction = false;

                });
            } else if (this.mode === ActionMode.EDIT) {
                this.loadingAction = true;
                this.workOrderService.update(this.workOrder, {workOrderId: this.workOrderId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loadingAction = false;

                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    } else {
                        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                    }
                }, error => {
                    this.loadingAction = false;

                });
            }
        }
    }

    cancel() {
        this.location.back();
    }

    calendar() {

        $('#requiredCompletionDate').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#requiredCompletionDate'),
            disableBeforeToday: true
        }).on('change', (e) => {
            try {
                this.workOrder.requiredCompletionDate =
                    this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                // if (!isNullOrUndefined(this.workOrder.requiredCompletionDate) && !
                //   isNullOrUndefined(this.workOrder.endDate)) {
                //   if (this.workOrder.endDate > this.workOrder.requiredCompletionDate) {
                //     this.deadDateChecker = true;
                //     DefaultNotify.notifyDanger('تاریخ پایان کار نمی تواند جلوتر از تاریخ اخرین مهلت باشد');
                //   }
                // }
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
        });
        $('#startDate').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#startDate'),
            disableBeforeToday: true
        }).on('change', (e) => {
            try {
                this.workOrder.startDate =
                    this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                // if (!isNullOrUndefined(this.workOrder.startDate) && !
                //   isNullOrUndefined(this.workOrder.endDate)) {
                //   if (this.workOrder.endDate < this.workOrder.startDate) {
                //     this.startDateChecker = true;
                //     DefaultNotify.notifyDanger('تاریخ شروع کار نمی تواند جلوتر از تاریخ پایان کار باشد');
                //   }
                // }
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
            disableBeforeToday: true
        }).on('change', (e) => {
            try {
                this.workOrder.endDate =
                    this.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                // if (!isNullOrUndefined(this.workOrder.startDate) && !
                //   isNullOrUndefined(this.workOrder.endDate)) {
                //   if (this.workOrder.endDate < this.workOrder.startDate) {
                //     this.startDateChecker = true;
                //     DefaultNotify.notifyDanger('تاریخ شروع کار نمی تواند جلوتر از تاریخ پایان کار باشد');
                //   }
                // }
                //
                //
                // if (!isNullOrUndefined(this.workOrder.requiredCompletionDate) && !
                //   isNullOrUndefined(this.workOrder.endDate)) {
                //   if (this.workOrder.endDate > this.workOrder.requiredCompletionDate) {
                //     this.deadDateChecker = true;
                //     DefaultNotify.notifyDanger('تاریخ پایان کار نمی تواند جلوتر از تاریخ اخرین مهلت باشد');
                //   }
                // }
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
        });

    }


    ngOnDestroy(): void {
    }

    onChangeUploader(input) {
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                const fe = i.name.split('.').pop();
                if (this.ext.includes(fe) === false) {
                    DefaultNotify.notifyWarning('نوع فایل انتخابی مورد قبول نیست.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (i.size < 10485760) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    loadingUploadFile = false;

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.loadingUploadFile = true;
        this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.loadingUploadFile = false;

                if (data) {
                    this.workOrder.image = data;
                }
            }, error => {
                this.loadingUploadFile = false;

            });
    }

    deleteImage() {
        this.workOrder.image = new DocumentFile();
        this.files = [];
    }

    changeAssetCode() {
        this.workOrderService.checkWorkOrderCode({workOrderCode: this.workOrder.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.workOrderId)) {
                    this.workOrder.code = '';
                } else {
                    this.workOrder.code = this.workOrderCopy.code;
                }
            }
        });
    }

    changeDocumentList($event: any) {

    }

    mOne() {
        this.completionDetails = true;
        this.mode = ActionMode.ADD;
        setTimeout(() => {
            this.mode = ActionMode.VIEW;
        }, 500);
    }

    mTow() {
        this.tasks = true;
        this.mode = ActionMode.ADD;
        setTimeout(() => {
            this.mode = ActionMode.VIEW;
        }, 500);
    }

    openGetAllModal() {
        this.openModal = true;
        ModalUtil.showModal('viewAssetForScheduleMaintenance');
    }

    setParentMethod(event) {
        this.workOrder.assetId = event.id;
        this.parentAsset.code = event.code;
        this.parentAsset.name = event.name;
    }

    next() {
        $('#workOrderCreate').carousel('next');
        $('#informationInMenu2').click();
        this.basicInformation = true;
    }

    prev() {
        if (this.from === 'assignedWorkOrder') {
            this.router.navigateByUrl('/panel/assignedWorkOrder?page=0&size=10');
        } else if (this.from === 'workOrder') {
            this.back.emit(true);
        } else {
            this.router.navigateByUrl('/panel/workOrder?page=0&size=10');
        }

        // $('#workOrderCreate').carousel('prev');
    }

    backEmitNewForm() {
        this.back.emit(true);
        this.edit.emit(true);
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.workOrderAccessId) {
            this.mode = this.actionMode.VIEW;
            this.fromWorkOrder = true;
        }
        if (this.modeFromAHistory === ActionMode.VIEW) {
            $('input').attr('disabled', 'disabled');
            // $('select').attr('disabled', 'disabled');
            $('.form-control-sm').attr('disabled', 'disabled');
        }
    }

}
