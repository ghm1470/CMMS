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
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {WorkOrderAccess} from '../../../activity/model/work-order-access';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {Location} from '@angular/common';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {WorkOrderAccessService} from '../../../activity/service/work-order-access/work-order-access.service';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FileModel} from '../../../../shared/model/fileModel';
import {ModalUtil} from '@angular-boot/widgets';
import MaintenanceType = WorkOrderDto.MaintenanceType;
import Priority = WorkOrderDto.Priority;
import {CompanyDto} from '../../../company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-work-order-carsousel-view',
    templateUrl: './work-order-carsousel-view.component.html',
    styleUrls: ['./work-order-carsousel-view.component.scss']
})
export class WorkOrderCarsouselViewComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() formIdList: string[] = [];
    @Input() typeOfNotification: string
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
    @Input() workOrderIn = new WorkOrderDto.Create();

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

    ngOnInit() {
        if (!this.workOrderIn) {
            this.workOrderIn = new WorkOrderDto.Create();
        } else {
            if (!isNullOrUndefined(this.workOrderIn.assetName)) {
                this.parentAsset.name = this.workOrderIn.assetName;
            }


            if ((!isNullOrUndefined(this.workOrderIn.maintenanceType))) {
                this.maintenanceType = this.maintenanceTypeList.find
                (e => e._value === this.workOrderIn.maintenanceType)._title;
            }
            if ((!isNullOrUndefined(this.workOrderIn.priority))) {
                this.priority = this.priorityList.find(e => e._value === this.workOrderIn.priority)._title;
            }
            setTimeout(() => {
                if (!isNullOrUndefined(this.workOrderIn.requiredCompletionDate)) {
                    $('#requiredCompletionDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                    (new Date(this.workOrderIn.requiredCompletionDate).toISOString()))).trigger('change');
                }
                if (!isNullOrUndefined(this.workOrderIn.startDate)) {
                    $('#startDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                    (new Date(this.workOrderIn.startDate).toISOString()))).trigger('change');
                }
                if (!isNullOrUndefined(this.workOrderIn.endDate)) {
                    $('#endDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                    (new Date(this.workOrderIn.endDate).toISOString()))).trigger('change');
                }
            }, 100);
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
    }


    getOneAfterGetAllTow() {
        this.loading = true;
        setTimeout(() => {
            if (this.getWorkOrderStatusList && this.getAssetList && this.getProjectList) {
                this.getOneWithOtWorkOrderId();
            } else if (!this.getWorkOrderStatusList || !this.getAssetList || !this.getProjectList) {
                this.getOneAfterGetAllTow();
            }
        }, 50);
    }

    getOneAfterGetAll() {
        this.loading = true;
        setTimeout(() => {
            if (this.getWorkOrderStatusList && this.getAssetList && this.getProjectList) {
                if (!isNullOrUndefined(this.workOrderId) && !this.existedAlreadySaveForWAR) {
                    this.getOne();
                } else if ((isNullOrUndefined(this.workOrderId)) || (!isNullOrUndefined(this.workOrderId) && this.existedAlreadySaveForWAR)) {
                    // alert(16)
                    if (this.workOrderDTO.assetName) {
                        this.getOneWithOtWorkOrderId();
                    } else {
                        setTimeout(() => {
                            this.getOneAfterGetAll();
                        }, 50);
                        return;
                    }
                }
            } else if (!this.getWorkOrderStatusList || !this.getAssetList || !this.getProjectList) {
                this.getOneAfterGetAll();
            }
        }, 50);
    }


    ngAfterViewInit(): void {
        this.calendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes.sendInformationNumberOfTabs) {
        // }
        // if (changes.workOrderCreateDTO) {
        //     this.workOrder = this.workOrderCreateDTO;
        //     if (this.typeOfNotification === 'view') {
        //         this.getOneAfterGetAllTow();
        //     }
        //     // if (this.typeOfNotification === 'action') {
        //     //   this.getOneAfterGetAll();
        //     // }
        // }
        // if (changes.workOrderId) {
        //     if (this.typeOfNotification === 'view') {
        //         this.getOneAfterGetAllTow();
        //     }
        //     // if (this.typeOfNotification === 'action') {
        //     //   this.getOneAfterGetAll();
        //     // }
        // }
        // if (changes.sendInformationNumberOfTabs) {
        // }
    }


    checkDates() {
        if (!isNullOrUndefined(this.workOrder.startDate) && !isNullOrUndefined(this.workOrder.endDate)) {
            if (this.workOrder.endDate < this.workOrder.startDate) {
                DefaultNotify.notifyDanger('تاریخ پایان پروژه نباید قبل از تاریخ شروع پروژه باشد.', '', NotiConfig.notifyConfig);
                return false;
            }
        }
        return true;
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
                    if (!isNullOrUndefined(this.workOrderIn.projectId)) {
                        this.projectName = this.projectList.find(e => e.id === this.workOrderIn.projectId).name;
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
                    if (!isNullOrUndefined(this.workOrderIn.statusId)) {
                        this.status = this.workOrderStatusList.find(e => e.id === this.workOrderIn.statusId).name.toString();
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
        // this.workOrder = this.workOrderDTO;
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
        }, 100);
    }

    // });
    // }

    getOne() {
        this.workOrderService.getOne({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.Create) => {
            if (res) {
                this.workOrder = res;
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
                    this.projectName = this.projectList.find(e => e.id === this.workOrder.projectId).name;
                }
                if (!isNullOrUndefined(this.workOrder.statusId)) {
                    // if(){

                    this.status = this.workOrderStatusList.find(e => e.id === this.workOrder.statusId).name.toString();
                    // }
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
                }, 100);
            }
        });
    }

    action(form) {
        this.doSave = true;
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

        if (!this.workOrder.startDate && this.workOrderAccess.startDate) {
            DefaultNotify.notifyDanger('زمان شروع کار را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.workOrder.requiredCompletionDate && this.workOrderAccess.requiredCompletionDate) {
            DefaultNotify.notifyDanger('آخرین مهلت را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.checkDates()) {
            // this.workOrderService.update(this.workOrder, {workOrderId: this.workOrderId})
            //   .pipe(takeUntilDestroyed(this)).subscribe(res => {
            //   if (res) {
            // this.workOrderAndFormRepository.workOrderCreateDTO = this.workOrder;
            // =================ثبت کردن در ریپاسیتوری
            // this.workOrderAndFormRepository.workOrderCreateDTO.id = this.workOrderId;
            console.log('this.activityId', this.activityId);
            if ((!this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.createWorkOrderDto(this.workOrder,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityId, activityLevelId: this.activityLevelId,
                        numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    if (resOne) {
                        console.log('resOne', resOne);
                        DataService.setExistedAlreadySaveForWAR(true);
                        // this.workOrderAndFormRepository.id = resOne;
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
                    }
                });
            } else if (this.existedAlreadySaveForWAR) {
                this.workOrderRepositoryService.updateWorkOrderDto(this.workOrder, {
                    activityInstanceId: this.activityId,
                    activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation,
                    workOrderId: this.workOrder.id
                })
                    .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    if (resTow) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ,ویرایش شد', '', NotiConfig.notifyConfig);
                        console.log('res==>', resTow);
                    }
                });
            }
            // ===========================================
            //       // DataService.setWAFRepository(this.workOrderAndFormRepository);
            //       DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
            //       // console.log('this.workOrderAndFormRepository====>', this.workOrderAndFormRepository);
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
                            console.log($(e.currentTarget).val());
                            try {
                                mthis.workOrder.requiredCompletionDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                console.log(mthis.workOrder.startDate);
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
                            console.log($(e.currentTarget).val());
                            try {
                                mthis.workOrder.startDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                console.log(mthis.workOrder.startDate);
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
                            console.log($(e.currentTarget).val());
                            try {
                                mthis.workOrder.endDate =
                                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                                this.checkDates();
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

    onChangeUploader(input) {
        console.log('input', input);
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                console.log(i.size);
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

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadService.uploadFile(formData).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                if (data) {
                    this.workOrder.image = data;
                    console.log('workOrder documents => ', this.workOrder.image);
                }
            });
    }

    deleteImage() {
        this.workOrder.image = new DocumentFile();
        this.files = [];
    }

    changeAssetCode() {
        console.log('this.workOrder.code)))))', this.workOrder.code);
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
        console.log('eventOne====>>', event);
        this.workOrder.assetId = event.id;
        this.parentAsset.code = event.code;
        this.parentAsset.name = event.name;
    }


    nextOrPrev() {
        this.nextCarousel.emit(true);
    }


}

