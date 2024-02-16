import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {Location} from '@angular/common';
import {ProjectService} from '../../../project/endpoint/project.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FileModel} from '../../../../shared/model/fileModel';
import {ScheduleMaintenanceDto} from '../../model/dto/scheduleMaintenanceDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {ModalUtil} from '@angular-boot/widgets';
import DocumentFile = CompanyDto.DocumentFile;
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {WorkRequestService} from '../../../submitWorkRequest/endpoint/work-request.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-schedule-maintenance-action',
    templateUrl: './schedule-maintenance-action.component.html',
    styleUrls: ['./schedule-maintenance-action.component.scss']
})
export class ScheduleMaintenanceActionComponent implements OnInit, OnDestroy {
    disabledButton = false;
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    scheduleMaintenance = new ScheduleMaintenanceDto.Create();
    scheduleMaintenanceCopy = new ScheduleMaintenanceDto.Create();

    scheduleMaintenanceId: string;
    typeOfNotification = 'scheduleMaintenance';
    myPattern = MyPattern;
    files: Array<File> = [];
    fileModel: Array<any> = [];
    projectList: ProjectDto.Create[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    activityIdList: ActivityIdList[] = [];
    workOrderStatusList: WorkOrderStatus[] = [];
    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    parentAsset = new AssetDto.CreateAsset();
    openModal = false;

    doSave = false;
    menuStatus = false;
    scheduledWithMetering = false;
    scheduledWithTime = false;
    completionDetails = false;
    basicInformation = false;
    notification = false;
    file = false;
    parts = false;
    tasks = false;
    taskGroup = false;
    againGetT = false;
    againGetM = false;
    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
    ];
    fileLoader = false;
    codeExist;

    tabId;
    page;
    showBasic;

    constructor(public location: Location,
                public scheduleMaintenanceService: ScheduleMaintenanceService,
                public workOrderStatusService: WorkOrderStatusService,
                public projectService: ProjectService,
                public assetService: AssetService,
                public router: Router,
                public uploadService: UploadService,
                private activatedRoute: ActivatedRoute) {

        this.scheduleMaintenance.active = true;
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.scheduleMaintenanceId = this.activatedRoute.snapshot.queryParams.entityId;
        this.tabId = this.activatedRoute.snapshot.queryParams.tab;
        this.page = this.activatedRoute.snapshot.queryParams.page;
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
    }

    ngOnInit() {
        // this.getAssetList();
        // this.getProjectList();
        // this.getWorkOrderStatusList();
        this.getAllProject();
        this.getAllAsset();
        this.getAllWorkOrderStatus();

        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.scheduleMaintenanceId)) {
                this.getOne();
                this.menuStatus = true;
            }
            if (this.mode === ActionMode.VIEW) {
                $('.form-control').attr('disabled', 'disabled');
                $('input').attr('disabled', 'disabled');
                $('select').attr('disabled', 'disabled');
            }
        }
    }

    getAllAsset() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
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

    getAllProject() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                }
            });
    }

    getOne() {
        this.scheduleMaintenanceService.getOne({scheduleMaintenanceId: this.scheduleMaintenanceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: ScheduleMaintenanceDto.Create) => {
            if (res) {
                this.scheduleMaintenance = res;
                this.getAllActivity();
                this.parentAsset.name = this.scheduleMaintenance.assetName;
                this.parentAsset.code = this.scheduleMaintenance.code;
                this.scheduleMaintenanceCopy = JSON.parse(JSON.stringify(res));
                this.setListData();
                if (this.page === '2') {
                    $('#scheduleCreate').carousel('next');
                    if (this.tabId) {
                        if (this.tabId === 'taskGroupB') {
                            this.taskGroup = true;
                        } else if (this.tabId === 'tasksB') {
                            this.tasks = true;
                        } else if (this.tabId === 'partsB') {
                            this.parts = true;
                        } else if (this.tabId === 'completionDetailsB') {
                            this.completionDetails = true;
                        } else if (this.tabId === 'informationB') {
                            this.basicInformation = true;
                        } else if (this.tabId === 'fileB') {
                            this.file = true;
                        } else if (this.tabId === 'scheduledWithMeteringB') {
                            this.changeMethodMetering();
                        } else if (this.tabId === 'scheduledWithTimeB') {
                            this.changeMethodTime();
                        }
                        $('#' + this.tabId).click();
                    }

                }
            }
        });
    }

    setListData() {
        if (this.scheduleMaintenance && this.projectList.length &&
            this.workOrderStatusList.length && this.assetList.length) {
            // for (const item of this.scheduleMaintenance) {
            const item = this.scheduleMaintenance;
            try {
                item.assetName = this.assetList.find(asset => asset.id === item.assetId).name;
                item.projectName = this.projectList.find(project => project.id === item.projectId).name;
                item.statusName = this.workOrderStatusList.find(wos => wos.id === item.statusId).name;
            } catch (e) {
            }
            // }
        }
    }

    getWorkOrderStatusList() {
        this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkOrderStatus[]) => {
                if (res && res.length) {
                    this.workOrderStatusList = res;
                    this.setListData();
                }
            });
    }

    getProjectList() {
        this.projectService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ProjectDto.Create[]) => {
                if (res && res.length) {
                    this.projectList = res;
                    this.setListData();
                }
            });
    }

    getAssetList() {
        this.assetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                if (res && res.length) {
                    this.assetList = res;
                    this.setListData();
                }
            });
    }

    loadingAction = false;

    action(form) {
        this.doSave = true;
        if (this.loadingAction) {
            return;
        }
        if (form.invalid || isNullOrUndefined(this.scheduleMaintenance.assetId)) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.parentAsset.name) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.mode === ActionMode.ADD) {
            this.disabledButton = true;
            this.loadingAction = true;
            this.scheduleMaintenanceService.create(this.scheduleMaintenance)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loadingAction = false;
                this.disabledButton = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.menuStatus = true;
                    this.scheduleMaintenanceId = res.id;
                    this.scheduleMaintenance.id = res.id;
                    this.mode = ActionMode.EDIT;
                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingAction = false;
            });
        } else if (this.mode === ActionMode.EDIT) {
            this.loadingAction = true;
            this.scheduleMaintenanceService.update(this.scheduleMaintenance, {scheduleMaintenanceId: this.scheduleMaintenanceId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.disabledButton = true;
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

    cancel() {
        // this.location.back();
        this.router.navigate(['/panel/scheduleMaintenance'], {
            relativeTo: this.activatedRoute
        });
    }

    ngOnDestroy(): void {
    }

    onChangeUploader(input) {

        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();
            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
        }
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

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.fileLoader = false;
                if (data) {
                    this.scheduleMaintenance.image = data;
                }
            });
    }

    deleteImage() {
        this.scheduleMaintenance.image = new DocumentFile();
        this.files = [];
    }

    changeDocumentList($event: any) {

    }

    changeScheduleMaintenanceStatus(event: any) {
        this.scheduleMaintenance.active = event.target.checked;
    }

    changeMethodTime() {
        this.scheduledWithTime = true;
        this.againGetT = !this.againGetT;
    }

    changeMethodMetering() {
        this.scheduledWithMetering = true;
        this.againGetM = !this.againGetM;
    }

    openGetAllModal() {
        this.openModal = true;
        ModalUtil.showModal('viewAssetForScheduleMaintenance');
    }

    setParentMethod(event) {
        this.scheduleMaintenance.assetId = event.id;
        this.parentAsset.code = event.code;
        this.parentAsset.name = event.name;
        this.getAllActivity();
    }

    getAllActivity() {
        this.scheduleMaintenanceService.getActivityIdListForThisAsset({assetId: this.scheduleMaintenance.assetId}).subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.activityIdList = res;

            }
        });
    }

    next() {
        $('#scheduleCreate').carousel('next');
        this.basicInformation = true;
        this.setParamToRoute('informationB');
    }

    prev() {
        $('#scheduleCreate').carousel('prev');
        this.router.navigate([], {
            queryParams: {mode: this.mode, entityId: this.scheduleMaintenance.id},
            relativeTo: this.activatedRoute
        });
    }

    checkCodeExist() {
        this.codeExist = true;
        this.scheduleMaintenanceService.checkCodeExist({code: this.scheduleMaintenance.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.scheduleMaintenanceId)) {
                    this.scheduleMaintenance.code = '';
                    this.codeExist = false;
                } else {
                    this.scheduleMaintenance.code = this.scheduleMaintenanceCopy.code;
                    this.codeExist = false;
                }
            } else {
                this.codeExist = false;
            }
        });
    }

    setParamToRoute(tabId: string) {
        this.router.navigate([], {
            queryParams: {mode: this.mode, entityId: this.scheduleMaintenance.id, page: 2, tab: tabId},
            relativeTo: this.activatedRoute
        });
    }
}

export class ActivityIdList {
    id: string;
    title: string;
}
