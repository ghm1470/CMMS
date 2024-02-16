import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';

import {ModalUtil} from '@angular-boot/widgets';

import DocumentFile = CompanyDto.DocumentFile;
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {WorkOrderAccess} from '../../../activity/model/work-order-access';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {FileModel} from '../../../../shared/model/fileModel';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {WorkOrderAccessService} from '../../../activity/service/work-order-access/work-order-access.service';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {DataService} from '../../../../shared/service/data.service';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-work-order-carousel',
    templateUrl: './work-order-carousel.component.html',
    styleUrls: ['./work-order-carousel.component.scss']
})
export class WorkOrderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() staticFormsIdList: string[] = [];
    @Input() formIdList: string[] = [];
    @Input() typeOfNotification: string;
    @Input() workOrderAccessId: string;
    @Input() workOrderId: string;
    @Input() workOrderCreateDTO = new WorkOrderDto.Create();
    @Input() activityId: string;
    @Input() activityLevelId: string;
    @Input() numberOfParticipation: number;
    @Input() isView: boolean;
    @Input() workOrderDTO = new WorkOrderDto.Create();
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Output() nextCarousel = new EventEmitter<boolean>();
    @Output() getWorKOrderForm = new EventEmitter<boolean>();

    existedAlreadySaveForWAR: boolean;
    workOrderAndFormRepository = new WorkTableDto.ActivitySampleWorkOrderAndFormRepository();
    formIdDto = new WorkOrderDto.FormIdForView();
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    workOrder = new WorkOrderDto.Create();
    workOrderCopy = new WorkOrderDto.Create();
    myPattern = MyPattern;
    files: Array<File> = [];
    fileModel: Array<any> = [];
    doSave = false;
    projectList: ProjectDto.Create[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    workOrderStatusList: WorkOrderStatus[] = [];
    workOrderAccess = new WorkOrderAccess();
    openModal = false;
    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    parentAsset = new AssetDto.CreateAsset();
    myMoment = Moment;
    loading = false;
    projectName: string;
    status: string;
    maintenanceType: string;
    priority: string;
    t = 0;
    getProjectList = false;
    getAssetList = false;
    getWorkOrderStatusList = false;
    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
    ];
    constructor(
        public location: Location,
        public workOrderService: WorkOrderService,
        public workOrderAccessService: WorkOrderAccessService,
        public workOrderStatusService: WorkOrderStatusService,
        public projectService: ProjectService,
        public workOrderRepositoryService: WorkOrderRepositoryService,
        public assetService: AssetService,
        public uploadService: UploadService,
    ) {
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
        this.workOrderAndFormRepository.workOrderCreateDTO = new WorkOrderDto.Create();
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'information')) {
                this.enableItems = true;
            }
        }
        this.getAllWorkOrderStatus();
        this.getAllProject();
        this.getAllAsset();
        this.getOneWorkOrderAccess();
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            } else {
                this.existedAlreadySaveForWAR = false;
            }
        });
    }

    getOneAfterGetAll() {

        // this.loading = true;
        this.getOne();
        // if (this.getWorkOrderStatusList && this.getAssetList && this.getProjectList) {
        //     if (this.workOrderId && !this.existedAlreadySaveForWAR) {
        //         this.getOne();
        //     } else if ((isNullOrUndefined(this.workOrderId)) || (!isNullOrUndefined(this.workOrderId) && this.existedAlreadySaveForWAR)) {
        //         if (this.workOrderDTO.assetName) {
        //             this.getOneWithOtWorkOrderId();
        //         } else {
        //             setTimeout(() => {
        //                 this.getOneAfterGetAll();
        //             }, 50);
        //         }
        //     }
        // } else if (!this.getWorkOrderStatusList || !this.getAssetList || !this.getProjectList) {
        //     setTimeout(() => {
        //         this.getOneAfterGetAll();
        //     }, 50);
        // }
    }


    ngAfterViewInit(): void {
        // this.calendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.workOrderDTO.currentValue) {
            this.workOrder = changes.workOrderDTO.currentValue;
        }
        this.workOrderCopy = JSON.parse(JSON.stringify(this.workOrder));
        setTimeout(() => {
            if (!isNullOrUndefined(this.workOrder.requiredCompletionDate)) {
                const jRequiredCompletionDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.requiredCompletionDate).toISOString()));
                $('#requiredCompletionDate').val(jRequiredCompletionDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrder.startDate)) {
                const jStartDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.startDate).toISOString()));

                $('#startDate').val(jStartDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrder.endDate)) {
                const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.endDate).toISOString()));
                $('#endDate').val(jEndDate).trigger('change');
            }
        }, 100);
        this.getOneAfterGetAll();
        // if (changes.sendInformationNumberOfTabs) {
        // }
        // if (changes.workOrderCreateDTO) {
        //     this.workOrder = this.workOrderCreateDTO;
        //     this.getOneAfterGetAll();
        // }
        // if (changes.workOrderId) {
        //     this.getOneAfterGetAll();
        // }
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
            .subscribe((res) => {
                this.getAssetList = true;
                if (res && res.length) {
                    this.assetList = res;
                    this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);
                }
            });
    }

    getAllProject() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res) => {
                this.getProjectList = true;
                if (res && res.length) {
                    this.projectList = res;
                    if (!isNullOrUndefined(this.workOrder.projectId)) {
                        if (this.projectList.length > 0) {
                            this.projectName = this.projectList.find(e => e.id === this.workOrder.projectId).name;
                        }
                    }
                }
            });
    }

    getAllWorkOrderStatus() {
        this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res) => {
                this.getWorkOrderStatusList = true;
                if (res && res.length) {
                    this.workOrderStatusList = res;
                    if (this.workOrderStatusList.length > 0 && this.workOrder.statusId) {

                        this.status = this.workOrderStatusList.find(e => e.id === this.workOrder.statusId).name.toString();
                    }
                }
            });
    }

    getOneWorkOrderAccess() {

        this.workOrderAccessService.getOne({workOrderAccessId: this.workOrderAccessId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderAccess) => {
                if (res) {
                    this.workOrderAccess = res;
                }
            });
    }


    getOneWithOtWorkOrderId() {
        // this.workOrderService.getOne({workOrderId: this.workOrderId})
        //   .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.Create) => {
        //   if (res) {
        //     this.workOrder = res;
        // this.workOrderAndFormRepository.workOrderCreateDTO = this.workOrder;
        // DataService.setWAFRepository(this.workOrderAndFormRepository);
        // این بولین را به این خاطر به کامپوننت مادر میفرستیم تا اطلاع
// دهیم اطلاعات سفارش  کار از طریق سرویس دریافت شده وبعد اجازه نمایش در html رابدهیم===============================================

        this.workOrder = this.workOrderDTO;
        setTimeout(() => {
            this.getWorKOrderForm.emit(true);
        }, 100);
        // ========================================
        // ====================================================================
        if (!isNullOrUndefined(this.workOrder.assetName)) {
            this.parentAsset.name = this.workOrder.assetName;
        }
        if (!isNullOrUndefined(this.workOrder.projectId)) {
            this.projectName = this.projectList.find(e => e.id === this.workOrder.projectId).name;
        }
        if (!isNullOrUndefined(this.workOrder.statusId)) {
            this.status = this.workOrderStatusList.find(e => e.id === this.workOrder.statusId).name.toString();
        }
        if ((!isNullOrUndefined(this.workOrder.maintenanceType))) {
            this.maintenanceType = this.maintenanceTypeList.find
            (e => e._value === this.workOrder.maintenanceType)._title;
        }
        if ((!isNullOrUndefined(this.workOrder.priority))) {
            this.priority = this.priorityList.find(e => e._value === this.workOrder.priority)._title;
        }
        this.loading = false;
        // ====================================================================
        this.workOrderCopy = JSON.parse(JSON.stringify(this.workOrder));
        $('#informationInMenu').click();
        $('#informationInMenu').click();
        $('#informationInMenu').click();
        setTimeout(() => {
            if (!isNullOrUndefined(this.workOrder.requiredCompletionDate)) {
                const jDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.requiredCompletionDate).toISOString()));
                $('#requiredCompletionDate').val(jDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrder.startDate)) {
                const jDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.startDate).toISOString()));
                $('#startDate').val(Date).trigger('change');

            }
            if (!isNullOrUndefined(this.workOrder.endDate)) {
                const jDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(this.workOrder.endDate).toISOString()));
                $('#endDate').val(jDate).trigger('change');

            }
        }, 100);
    }

    // });
    // }

    getOne() {
        this.loading = true;
        this.workOrderService.getOne({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.Create) => {
            this.loading = false;
            if (res) {
                this.workOrder = res;
                this.calendar();

                // this.workOrderAndFormRepository.workOrderCreateDTO = this.workOrder;
                // DataService.setWAFRepository(this.workOrderAndFormRepository);
                // این بولین را به این خاطر به کامپوننت مادر میفرستیم تا اطلاع
// دهیم اطلاعات سفارش  کار از طریق سرویس دریافت شده وبعد اجازه نمایش در html رابدهیم===============================================
                this.getWorKOrderForm.emit(true);
                // ========================================
                // ====================================================================
                if (!isNullOrUndefined(this.workOrder.assetName)) {
                    this.parentAsset.name = this.workOrder.assetName;
                }
                if (!isNullOrUndefined(this.workOrder.projectId)) {
                    if (this.projectList.length > 0) {
                        this.projectName = this.projectList.find(e => e.id === this.workOrder.projectId).name;
                    }
                }
                if (!isNullOrUndefined(this.workOrder.statusId)) {
                    if (this.workOrderStatusList.length > 0) {
                        this.status = this.workOrderStatusList.find(e => e.id === this.workOrder.statusId).name.toString();
                    }
                }
                if ((!isNullOrUndefined(this.workOrder.maintenanceType))) {
                    this.maintenanceType = this.maintenanceTypeList.find
                    (e => e._value === this.workOrder.maintenanceType)._title;
                }
                if ((!isNullOrUndefined(this.workOrder.priority))) {
                    this.priority = this.priorityList.find(e => e._value === this.workOrder.priority)._title;
                }
                this.loading = false;
                // ====================================================================
                this.workOrderCopy = JSON.parse(JSON.stringify(this.workOrder));
                $('#informationInMenu').click();
                $('#informationInMenu').click();
                $('#informationInMenu').click();
                setTimeout(() => {
                    if (!isNullOrUndefined(this.workOrder.requiredCompletionDate)) {
                        const jRequiredCompletionDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.requiredCompletionDate).toISOString()));
                        $('#requiredCompletionDate').val(jRequiredCompletionDate).trigger('change');
                    }
                    if (!isNullOrUndefined(this.workOrder.startDate)) {
                        const jStartDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.startDate).toISOString()));
                        $('#startDate').val(jStartDate).trigger('change');

                    }
                    if (!isNullOrUndefined(this.workOrder.endDate)) {
                        const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                        (new Date(this.workOrder.endDate).toISOString()));
                        $('#endDate').val(jEndDate).trigger('change');

                    }
                }, 100);
            }
        }, error => {
            this.loading = false;
        });
    }

    loadingAction = false;

    action(form) {
        this.doSave = true;
        if (this.loadingAction) {
            return;
        }
        if (this.workOrderAccess.title && isNullOrUndefined(this.workOrderAccess.title)) {
            DefaultNotify.notifyDanger('عنوان دستور کار را وارد نمایید', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.workOrderAccess.code && isNullOrUndefined(this.workOrderAccess.code)) {
            DefaultNotify.notifyDanger('کد دستور کار را وارد نمایید', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }

        // if (!this.workOrder.startDate && this.workOrderAccess.startDate) {
        //     DefaultNotify.notifyDanger('زمان شروع کار را وارد کنید.');
        //     return;
        // }
        // if (!this.workOrder.requiredCompletionDate && this.workOrderAccess.requiredCompletionDate) {
        //     DefaultNotify.notifyDanger('آخرین مهلت را وارد کنید.');
        //     return;
        // }
        if (this.checkDates()) {
            // this.workOrderService.update(this.workOrder, {workOrderId: this.workOrderId})
            //   .pipe(takeUntilDestroyed(this)).subscribe(res => {
            //   if (res) {
            // this.workOrderAndFormRepository.workOrderCreateDTO = this.workOrder;
            // =================ثبت کردن در ریپاسیتوری
            // this.workOrderAndFormRepository.workOrderCreateDTO.id = this.workOrderId;
            if ((!this.existedAlreadySaveForWAR)) {
                this.loadingAction = true;
                this.workOrderRepositoryService.createWorkOrderDto(this.workOrder,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityId, activityLevelId: this.activityLevelId,
                        numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    this.loadingAction = false;
                    if (resOne) {
                        DataService.setExistedAlreadySaveForWAR(true);
                        // this.workOrderAndFormRepository.id = resOne;
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
                        this.workOrderCopy = JSON.parse(JSON.stringify(this.workOrder));

                    }
                }, error => {
                    this.loadingAction = false;
                });
            } else if (this.existedAlreadySaveForWAR) {
                if (JSON.stringify(this.workOrderCopy) === JSON.stringify(this.workOrder)) {
                    DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);

                    return;
                }
                this.loadingAction = true;
                this.workOrderRepositoryService.updateWorkOrderDto(this.workOrder, {
                    activityInstanceId: this.activityId,
                    activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation,
                    workOrderId: this.workOrderId,
                })
                    .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    this.loadingAction = false;
                    if (resTow) {
                        this.workOrderCopy = JSON.parse(JSON.stringify(this.workOrder));
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ,ویرایش شد', '', NotiConfig.notifyConfig);
                    }
                }, error => {
                    this.loadingAction = false;
                });
            }
            // ===========================================
            //       // DataService.setWAFRepository(this.workOrderAndFormRepository);
            //       DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
            //     } else {
            //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            //     }
            //   });
        }
    }

    cancel() {
        this.location.back();
    }


    calendar() {
        setTimeout(() => {
            if (this.loading === false) {
                setTimeout(() => {
                    const mthis = this;
                    if (this.workOrderAccess.requiredCompletionDate) {
                        $('#requiredCompletionDate').azPersianDateTimePicker({
                            Placement: 'bottom', // default is 'bottom'
                            Trigger: 'focus', // default is 'focus',
                            enableTimePicker: false, // default is true,
                            TargetSelector: '', // default is empty,
                            GroupId: '', // default is empty,
                            ToDate: false, // default is faalerlse,
                            FromDate: false, // default is false,
                            targetTextSelector: $('#requiredCompletionDate'),
                            disableBeforeToday: false
                        }).on('change', (e) => {
                            try {
                                mthis.workOrder.requiredCompletionDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                // this.checkDates();

                            } catch (e) {
                                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                            }
                        });
                    }
                    if (this.workOrderAccess.startDate) {
                        $('#startDate').azPersianDateTimePicker({
                            Placement: 'bottom', // default is 'bottom'
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
                                mthis.workOrder.startDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                // this.checkDates();

                            } catch (e) {
                                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.....', '', NotiConfig.notifyConfig);
                            }
                        });
                    }
                    if (this.workOrderAccess.endDate) {
                        $('#endDate').azPersianDateTimePicker({
                            Placement: 'bottom', // default is 'bottom'
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
                                mthis.workOrder.endDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                // this.checkDates();
                            } catch (e) {
                                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                            }
                        });
                    }
                }, 500);
            } else {
                this.calendar();
            }
        }, 500);
    }

    ngOnDestroy(): void {
    }

    onChangeUploader1(input) {
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                if (i.size < 100000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
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
            if (res && res.exist) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.workOrder.id)) {
                    this.workOrder.code = '';
                } else {
                    this.workOrder.code = this.workOrderCopy.code;
                }
            }
        });
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


    nextOrPrev() {
        this.nextCarousel.emit(true);
    }


}

