import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ProjectDto} from '../../model/dto/projectDto';
import {ProjectService} from '../../endpoint/project.service';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
import {FileModel} from '../../../../shared/model/fileModel';
import {DownloadService} from '../../../../shared/service/download.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {ScheduleMaintenanceService} from '../../../scheduleMaintenance/endpoint/schedule-maintenance.service';
import {ScheduleMaintenanceDto} from '../../../scheduleMaintenance/model/dto/scheduleMaintenanceDto';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {UserType} from '../../../securityManagement/model/userType';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import ProjectGroupPersonnelDTO = ProjectDto.ProjectGroupPersonnelDTO;
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-project-action',
    templateUrl: './project-action.component.html',
    styleUrls: ['./project-action.component.scss']
})
export class ProjectActionComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(public location: Location,
                public projectService: ProjectService,
                public downloadService: DownloadService,
                public uploadService: UploadService,
                public userService: UserService,
                private activatedRoute: ActivatedRoute,
                public scheduleMaintenanceService: ScheduleMaintenanceService,
                public workOrderService: WorkOrderService,
                public userTypeService: UserTypeService,
                private router: Router) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.projectId = this.activatedRoute.snapshot.queryParams.entityId;
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
    }

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    myMoment = Moment;
    project = new ProjectDto.Create();
    projectCopy = new ProjectDto.Create();
    projectId: string;
    myPattern = MyPattern;
    doSave = false;
    documents: DocumentFile[] = [];
    selectedUser: UserDto.Create = new UserDto.Create();
    userList: UserDto.Create[] = [];
    projectUserList: UserDto.Create[] = [];
    projectUsers: UserDto.Create[] = [];
    projectGroup: ProjectGroupPersonnelDTO[] = [];
    files: any[];
    priorityL = [] as EnumObject[];
    maintenanceTypeL = [] as EnumObject[];
    fileModel: Array<FileModel> = [];
    scheduleMaintenanceList: ScheduleMaintenanceDto.GetAllByFilterAndPagination2[] = [];
    workOrderList: WorkOrderDto.GetAllByFilterAndPaginationTow[] = [];

    priorityList = [] as EnumObject[];
    maintenanceTypeList = [] as EnumObject[];
    showFileDocument = false;
    loading = false;
    codeExist = false;

// //////////////////////////////////////////////////////////////////////////
    userTypeList2: UserType[] = [];
    loadingUserTypeList2 = true;
    selectedUserTypeId2: string;
    parentUserId2 = '';
    userList2: UserDto.Create[] = [];
    loadingUserList2 = false;
//  ///////////////////
    assignedToUser = true;
    assignedToGroup = false;

    ngOnInit() {
        // this.getAllUserType();
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.projectId)) {
                this.loading = true;
                this.getOne();
            }
        }
    }

    getAllUser() {
        this.userService.getAllTow().pipe(takeUntilDestroyed(this))
            .subscribe((res: UserDto.Create[]) => {
                if (res && res.length) {
                    this.userList = res;
                    this.filterUserList();
                }
            });
    }

    filterUserList() {
        if (this.userList.length > 0 && this.project.users.length > 0) {
            if (this.projectUsers.length !== this.project.users.length) {
                for (const userId of this.project.users) {
                    // if (!isNullOrUndefined(this.userList.find(u => u.id === userId))) {
                    //     this.projectUsers.push(this.userList.find(u => u.id === userId));
                    // }

                }
            }
            for (const item of this.projectUsers) {
                this.userList = this.userList.filter(user => user.id !== item.id);
            }
        }
    }

    getOne() {
        this.projectService.getOne({projectId: this.projectId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: ProjectDto.Create) => {
            this.loading = false;
            console.log('getOne', res);
            if (res) {
                this.project = res;

                this.projectCopy = JSON.parse(JSON.stringify(res));
                // this.getScheduleMaintenanceList();

                if (!isNullOrUndefined(this.project.requiredCompletionDate)) {
                    $('#requiredCompletionDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate2
                    (new Date(this.project.requiredCompletionDate).toISOString()))).trigger('change');
                }
                if (!isNullOrUndefined(this.project.endDate)) {
                    $('#endDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate2
                    (new Date(this.project.endDate).toISOString()))).trigger('change');
                }

                if (!isNullOrUndefined(this.project.startDate)) {
                    $('#startDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate2
                    (new Date(this.project.startDate).toISOString()))).trigger('change');
                }
            }
        });
    }

    getPersonnelOfProjectAllow = true;

    getPersonnelOfProject() {
        if (this.getPersonnelOfProjectAllow) {
            // if (this.project.users.length > 0) {
            this.getPersonnelOfProjectAllow = false;
            this.projectService.getPersonnelOfProject({projectId: this.projectId}).subscribe((res: any) => {
                if (res) {
                    this.projectUsers = res;
                }
            });
            // }
        }
    }

    getGroupOfProjectAllow = true;

    getPersonnelGroupOfProject() {
        if (this.getGroupOfProjectAllow) {
            // if (this.project.users.length > 0) {
            this.getGroupOfProjectAllow = false;
            this.projectService.getPersonnelGroupOfProject({projectId: this.projectId}).subscribe((res: any) => {
                if (res) {
                    this.projectGroup = res;
                }
            });
            // }
        }
    }

    action(form) {
        // this.doSave = true;
        // console.log('this.project', this.project);
        // if (form.invalid) {
        //     DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.');
        //     return;
        // }
        this.project.users = this.projectUsers.map(e => e.id);
        if (this.mode === ActionMode.ADD) {
            this.loading = true;
            this.projectService.create(this.project)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            this.loading = true;
            this.projectService.update(this.project, {projectId: this.projectId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                console.log('update', res);
                if (res) {
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    this.cancel();
                }
            }, error => {
                this.loading = false;

            });
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    changeProjectCode(form) {

        this.doSave = true;
        console.log('this.project', this.project);
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.startDayChecker) {
            DefaultNotify.notifyDanger('تاریخ شروع بررسی شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.endDateChecker) {
            DefaultNotify.notifyDanger('تاریخ پایان بررسی شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.requiredCompletionDateChecker) {
            DefaultNotify.notifyDanger(' آخرین مهلت بررسی شود.', '', NotiConfig.notifyConfig);
            return;
        }
        this.loading = true;
        this.codeExist = true;
        if (this.project.code === this.projectCopy.code) {
            this.action(form);
        } else {
            this.projectService.checkProjectCode({code: this.project.code})
                .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                    if (isNullOrUndefined(this.project.id)) {
                        this.project.code = '';
                        this.codeExist = false;
                        this.codeExist = false;
                    } else {
                        this.project.code = this.projectCopy.code;
                        this.codeExist = false;
                    }
                } else {
                    this.action(form);
                }
            }, error => {
                this.loading = false;

            });
        }
    }

    startDayChecker = true;
    endDateChecker = true;
    requiredCompletionDateChecker = true;

    ngAfterViewInit(): void {
        const mthis = this;

        $('#startDate').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#startDate'),
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            this.startDayChecker = true;
            try {
                mthis.project.startDate =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                if (!isNullOrUndefined(mthis.project.startDate) && !
                    isNullOrUndefined(mthis.project.startDate)) {
                    if (mthis.project.startDate > mthis.project.endDate) {
                        DefaultNotify.notifyDanger('تاریخ شروع نمیتواند بعد از تاریخ پایان باشد.', '', NotiConfig.notifyConfig);
                        this.startDayChecker = false;
                        return;
                    } else {
                        this.endDateChecker = true;
                    }
                    if (mthis.project.startDate > mthis.project.requiredCompletionDate) {
                        DefaultNotify.notifyDanger('تاریخ شروع نمیتواند بعد از آخرین مهلت باشد.', '', NotiConfig.notifyConfig);
                        this.startDayChecker = false;
                    } else {
                        this.requiredCompletionDateChecker = true;
                    }
                }
                console.log(' mthis.project.startDate', mthis.project.startDate);
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                this.startDayChecker = false;
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
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            // this.endDateChecker = true;
            mthis.project.endDate =
                mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
            const date1 = (new Date(mthis.project.startDate).setHours(0, 0, 0));
            const date2 = new Date(date1).toISOString();
            const date3 = mthis.myMoment.convertJaliliToIsoDate(date2);
            try {
                mthis.project.endDate =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                if (!isNullOrUndefined(mthis.project.endDate) && !
                    isNullOrUndefined(mthis.project.endDate)) {
                    if (mthis.project.endDate < mthis.project.startDate) {
                        DefaultNotify.notifyDanger('تاریخ پایان نمیتواند قبل از تاریخ شروع باشد.', '', NotiConfig.notifyConfig);
                        this.endDateChecker = false;
                    } else {
                        this.startDayChecker = true;
                    }
                }
                const date = new Date(mthis.project.endDate).setHours(0, 0, 0);
                console.log(' mthis.project.endDate', mthis.project.endDate);
                console.log('date', date);
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                this.endDateChecker = false;
            }
        });
        $('#requiredCompletionDate').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#requiredCompletionDate'),
            disableBeforeToday: false
        }).on('change', (e) => {
            console.log($(e.currentTarget).val());
            this.requiredCompletionDateChecker = true;
            try {
                mthis.project.requiredCompletionDate =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                if (!isNullOrUndefined(mthis.project.requiredCompletionDate) && !
                    isNullOrUndefined(mthis.project.requiredCompletionDate)) {
                    if (mthis.project.requiredCompletionDate < mthis.project.startDate) {
                        DefaultNotify.notifyDanger('آخرین مهلت نمیتواند قبل از تاریخ شروع باشد.', '', NotiConfig.notifyConfig);
                        this.requiredCompletionDateChecker = false;
                    } else {
                        this.startDayChecker = true;
                    }
                }
                console.log(' mthis.project.requiredCompletionDate', mthis.project.requiredCompletionDate);

            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
                this.requiredCompletionDateChecker = false;
            }
        });

    }

    allowGetScheduleMaintenanceList = true;

     getScheduleMaintenanceList() {
        if (this.projectId) {
            if (this.allowGetScheduleMaintenanceList) {
                // if (this.project.users.length > 0 {
                this.allowGetScheduleMaintenanceList = false;
                this.scheduleMaintenanceService.getListByProjectId({projectId: this.projectId})
                    .pipe(takeUntilDestroyed(this)).subscribe((res: ScheduleMaintenanceDto.GetAllByFilterAndPagination2[]) => {
                    if (res && res.length) {
                        this.scheduleMaintenanceList = res;
                        for (let i = 0; i < this.scheduleMaintenanceList.length; i++) {
                            console.log(i);
                            if (!isNullOrUndefined(this.scheduleMaintenanceList[i].priority)) {
                                console.log(this.scheduleMaintenanceList[i].priority);
                                this.priorityL[i] = this.priorityList.find
                                (e => e._value === this.scheduleMaintenanceList[i].priority);
                                console.log(this.priorityL[i]);
                            } else {
                                this.priorityL[i] = null;
                            }
                            if (!isNullOrUndefined(this.scheduleMaintenanceList[i].maintenanceType)) {
                                this.maintenanceTypeL[i] = this.maintenanceTypeList.find
                                (e => e._value === this.scheduleMaintenanceList[i].maintenanceType);
                            } else {
                                this.priorityL[i] = null;
                            }
                        }
                    }
                });
            }
        }
    }

    findPriorityListType(item) {
    }

    findMaintenanceType(item) {
        // console.log(item.maintenanceType);
        // this.maintenanceType = this.maintenanceTypeList.find
        // (e => e._value = item.maintenanceType);
        // console.log(this.maintenanceType);
        // return this.maintenanceType._title;
    }

    allowGetWorkOrderList = true;

    getWorkOrderList() {
        if (this.allowGetWorkOrderList) {
            this.allowGetWorkOrderList = false;
            this.workOrderService.getListByProjectIdTow({projectId: this.projectId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.GetAllByFilterAndPaginationTow[]) => {
                if (res && res.length) {
                    this.workOrderList = res;

                }
            });
        }
    }

    chooseSelectedItemForView(item: WorkOrderDto.GetAllByFilterAndPaginationTow) {
        this.router.navigate(['/panel/workOrder/action'], {
            queryParams: {mode: ActionMode.VIEW, workOrderId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseWorkOrderForView(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
        this.router.navigate(['/panel/scheduleMaintenance/action'], {
            queryParams: {mode: ActionMode.VIEW, workOrderId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    stringLength(value, id) {
        // console.log('value', value)
        // console.log('id', id)
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid').removeClass('is-valid');
                $('#form').addClass('ng-invalid').removeClass('ng-valid');
                // this.disabledButton = true;
                return false;
            } else {
                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#form').addClass('ng-valid').removeClass('ng-invalid');
                // this.disabledButton = false;

                return true;

            }
        } else if (isNullOrUndefined(value)) {
            $('#' + id).addClass('is-invalid').removeClass('is-valid');
            $('#form').addClass('ng-invalid').removeClass('ng-valid');
            // this.disabledButton = false;

            // return false;
            return true;
        }
    }

    trimName() {
        this.project.name = this.project.name.trim();
    }

    allowGetAllUserType = true;

    getAllUserType() {
        if (this.allowGetAllUserType) {
            this.loadingUserTypeList2 = true;
            this.allowGetAllUserType = false;
            this.userTypeService.getAllRole()
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingUserTypeList2 = false;
                // console.log('getAllUserType', res);
                if (!isNullOrUndefined(res)) {
                    this.userTypeList2 = res;
                }
            });
        }
    }

    changeUserType(event: UserType) {
        this.parentUserId2 = null;
        this.userList2 = [];
        if (event) {
            this.selectedUserTypeId2 = event.id;
            if (this.assignedToGroup) {
                const item = {
                    userTypeId: event.id,
                    userTypeName: event.name
                };
                const exist = this.projectGroup.some(p => p.userTypeId === item.userTypeId);
                if (exist) {
                    DefaultNotify.notifyDanger('این پست قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (!exist) {
                    this.projectGroup.push(item);
                }
                setTimeout(e => {
                    this.selectedUserTypeId2 = null;
                }, 10);
                return;
            }
            this.getAllUsersOfUserType();
        }

    }

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList2 = true;
        this.userService.getAllUsersOfUserType({paging, totalElements: 0, userTypeId: this.selectedUserTypeId2})
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
            this.loadingUserList2 = false;
            if (this.userList2.length === 0) {
                this.userList2 = res.content;
            } else {
                this.userList2 = this.userList2.concat(res.content);
            }
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        });
    }

    selectUser() {
        if (this.parentUserId2 !== '-1' && this.parentUserId2) {
            if (this.projectUsers.some(user => user.id === this.parentUserId2)) {
                DefaultNotify.notifyDanger('کاربر قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                setTimeout(e => {
                    this.parentUserId2 = null;
                }, 10);
                return;
            }
            this.projectUsers.push(this.userList2.find(user => user.id === this.parentUserId2));
            setTimeout(e => {
                this.parentUserId2 = null;
            }, 10);
        }
    }

    addGroupPersonnelToProject() {

        this.projectService.addGroupPersonnelToProject(this.projectGroup,
            {projectId: this.projectId}).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            }
        });
    }

    addPersonnelToProject() {
        // this.project.users = this.projectUsers.map(e => e.id && e.userTypeId);

        const assignedToPersonList = [];
        for (const item of this.projectUsers) {
            const dto = {
                userId: item.id,
                userTypeId: item.userTypeId
            };
            assignedToPersonList.push(dto);
        }
        this.projectService.addPersonnelToProject(assignedToPersonList,
            {projectId: this.projectId}).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            }
        });
    }

    deleteUser2(id) {
        // this.userList2.push(this.projectUsers.find(user => user.id === id));
        this.projectUsers = this.projectUsers.filter(user => user.id !== id);
        setTimeout(e => {
            this.parentUserId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

    deleteGroup(id) {
        // this.userList2.push(this.projectUsers.find(user => user.id === id));
        this.projectGroup = this.projectGroup.filter(group => group.userTypeId !== id);
        setTimeout(e => {
            this.selectedUserTypeId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

// //////////////////////////////////////////////////////////////////////////!!!
    inventoryB = false;

    next() {
        this.inventoryB = true;
        setTimeout(() => {
            $('#projectCreate').carousel('next');
        }, 100);
    }

    prev() {
        $('#projectCreate').carousel('prev');
    }

    openAssignedToUserCard(event) {
        this.selectedUserTypeId2 = null;
        this.parentUserId2 = null;
        if (event.source._checked) {
            this.assignedToUser = true;
            this.assignedToGroup = false;
        }
    }

    openAssignedToGroupCard(event) {
        this.selectedUserTypeId2 = null;
        this.getPersonnelGroupOfProject();
        if (event.source._checked) {
            this.assignedToGroup = true;
            this.assignedToUser = false;
        }
    }
}
