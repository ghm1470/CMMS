import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {ProjectDto} from '../../model/dto/projectDto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {UserDto} from '../../../user/model/dto/user-dto';
import {FileModel} from '../../../../shared/model/fileModel';
import {ScheduleMaintenanceDto} from '../../../scheduleMaintenance/model/dto/scheduleMaintenanceDto';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {Location} from '@angular/common';
import {ProjectService} from '../../endpoint/project.service';
import {DownloadService} from '../../../../shared/service/download.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {UserService} from '../../../user/endpoint/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ScheduleMaintenanceService} from '../../../scheduleMaintenance/endpoint/schedule-maintenance.service';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import * as FileSaver from 'file-saver';
import DocumentFile = UserDto.DocumentFile;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import Priority = WorkOrderDto.Priority;
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import ProjectGroupPersonnelDTO = ProjectDto.ProjectGroupPersonnelDTO;
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit, OnDestroy, AfterViewInit {


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
  files: any[];
  fileModel: Array<FileModel> = [];
  scheduleMaintenanceList: ScheduleMaintenanceDto.GetAllByFilterAndPagination2[] = [];
  workOrderList: WorkOrderDto.GetAllByFilterAndPaginationTow[] = [];

  priorityList = [] as EnumObject[];
  maintenanceTypeList = [] as EnumObject[];
  toolkit2 = Toolkit2;
  dateViewMode = DateViewMode;
  showFileDocument;

  priorityL = [] as EnumObject[];
  maintenanceTypeL = [] as EnumObject[];

  constructor(public location: Location,
              public projectService: ProjectService,
              public downloadService: DownloadService,
              public uploadService: UploadService,
              public userService: UserService,
              private activatedRoute: ActivatedRoute,
              public scheduleMaintenanceService: ScheduleMaintenanceService,
              public workOrderService: WorkOrderService,
              private router: Router) {
    this.selectedUser.id = '-1';
    this.mode = this.activatedRoute.snapshot.queryParams.mode;
    this.projectId = this.activatedRoute.snapshot.queryParams.entityId;
    this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
    this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
  }

  ngOnInit() {
    if (this.mode === ActionMode.VIEW) {
      if (!isNullOrUndefined(this.projectId)) {
        this.getOne();
      }
    }
    // this.getAllUser();
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
          if (!isNullOrUndefined(this.userList.find(u => u.id === userId))) {
            this.projectUsers.push(this.userList.find(u => u.id === userId));
          }

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
      if (res) {
        this.project = res;
        this.projectCopy = JSON.parse(JSON.stringify(res));
        this.getScheduleMaintenanceList();
        this.getWorkOrderList();
        this.filterUserList();
        if (!isNullOrUndefined(this.project.actualStartDate)) {
          $('#startDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
          (new Date(this.project.actualStartDate).toISOString()))).trigger('change');
        }
        if (!isNullOrUndefined(this.project.actualEndDate)) {
          $('#endDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
          (new Date(this.project.actualEndDate).toISOString()))).trigger('change');
        }

        if (!isNullOrUndefined(this.project.endDate)) {
          $('#requiredCompletionDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
          (new Date(this.project.endDate).toISOString()))).trigger('change');
        }

        // if (!isNullOrUndefined(this.project.actualStartDate)) {
        //   $('#actualStartDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
        //   (new Date(this.project.actualStartDate).toISOString()))).trigger('change');
        // }
        // if (!isNullOrUndefined(this.project.actualEndDate)) {
        //   $('#actualEndDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
        //   (new Date(this.project.actualEndDate).toISOString()))).trigger('change');
        // }
      }
    });
  }

  chooseSelectedItemForVieWorkOrder(item: WorkOrderDto.GetAllByFilterAndPaginationTow) {
    this.router.navigate(['/panel/workOrder/action'], {
      queryParams: {mode: ActionMode.VIEW, workOrderId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForViewScheduleMaintenance(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination2) {
    this.router.navigate(['/panel/scheduleMaintenance/action'], {
      queryParams: {mode: ActionMode.VIEW, scheduleMaintenanceId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  action(form) {
    this.doSave = true;
    if (form.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.mode === ActionMode.ADD) {
      this.projectService.create(this.project)
        .pipe(takeUntilDestroyed(this)).subscribe(res => {
        if (res) {
          DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
          form.reset();
          this.cancel();
        }
      });
    } else if (this.mode === ActionMode.EDIT) {
      this.projectService.update(this.project, {projectId: this.projectId})
        .pipe(takeUntilDestroyed(this)).subscribe(res => {
        if (res) {
          DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
          this.cancel();
        }
      });
    }
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

  changeProjectCode() {
    this.projectService.checkProjectCode({code: this.project.code})
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
        if (isNullOrUndefined(this.project.id)) {
          this.project.code = '';
        } else {
          this.project.code = this.projectCopy.code;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const mthis = this;
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
        mthis.project.requiredCompletionDate =
          mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
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
    }).on('change', (e) => {
      mthis.project.startDate =
        mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
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
      mthis.project.endDate =
        mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    });
    // $('#actualStartDate').azPersianDateTimePicker({
    //   Placement: 'left', // default is 'bottom'
    //   Trigger: 'focus', // default is 'focus',
    //   enableTimePicker: false, // default is true,
    //   TargetSelector: '', // default is empty,
    //   GroupId: '', // default is empty,
    //   ToDate: false, // default is false,
    //   FromDate: false, // default is false,
    //   targetTextSelector: $('#actualStartDate'),
    // }).on('change', (e) => {
    //   mthis.project.actualStartDate =
    //     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    // });
    // $('#actualEndDate').azPersianDateTimePicker({
    //   Placement: 'left', // default is 'bottom'
    //   Trigger: 'focus', // default is 'focus',
    //   enableTimePicker: false, // default is true,
    //   TargetSelector: '', // default is empty,
    //   GroupId: '', // default is empty,
    //   ToDate: false, // default is false,
    //   FromDate: false, // default is false,
    //   targetTextSelector: $('#actualEndDate'),
    // }).on('change', (e) => {
    //   mthis.project.actualEndDate =
    //     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    // });
  }

  onChangeUploader(input) {
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
    this.uploadService.uploadFile(formData).pipe(takeUntilDestroyed(this))
      .subscribe((data: any) => {
        if (data) {
          this.project.documents.push(data);
        }
      });
  }

  deleteItem(id: string) {
    this.project.documents = this.project.documents.filter(doc => doc.id !== id);
  }

  downloadFile(item: DocumentFile) {
    this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
      .subscribe((res: any) => {
        if (!isNullOrUndefined(res)) {
          FileSaver.saveAs(res, item.fileName);
        }
      });
  }

  changeUser() {
    if (this.selectedUser.id !== '-1') {
      this.projectUsers.push(this.userList.find(user => user.id === this.selectedUser.id));
      this.project.users.push(this.userList.find(user => user.id === this.selectedUser.id).id);
      this.userList = this.userList.filter(user => user.id !== this.selectedUser.id);
      this.selectedUser.id = '-1';
    }
  }

  deleteUser(id) {
    this.userList.push(this.projectUsers.find(user => user.id === id));
    this.project.users = this.project.users.filter(user => user !== id);
    this.projectUsers = this.projectUsers.filter(user => user.id !== id);
    this.selectedUser.id = '-1';
  }

  private getScheduleMaintenanceList() {
    this.scheduleMaintenanceService.getListByProjectId({projectId: this.projectId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: ScheduleMaintenanceDto.GetAllByFilterAndPagination2[]) => {
      if (res && res.length) {
        this.scheduleMaintenanceList = res;
        for (let i = 0 ; i < this.scheduleMaintenanceList.length; i++) {
          if (!isNullOrUndefined(this.scheduleMaintenanceList[i].priority)) {
            this.priorityL[i] = this.priorityList.find
            (e => e._value === this.scheduleMaintenanceList[i].priority);
          } else {
            this.priorityL[i] = null;
          }
          if (!isNullOrUndefined(this.scheduleMaintenanceList[i].maintenanceType)) {
            this.maintenanceTypeL[i] = this.maintenanceTypeList.find
            (e => e._value === this.scheduleMaintenanceList[i].maintenanceType);
          }  else {
            this.priorityL[i] = null;
          }
        }
      }
    });
  }

  private getWorkOrderList() {
    this.workOrderService.getListByProjectIdTow({projectId: this.projectId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.GetAllByFilterAndPaginationTow[]) => {
      if (res && res.length) {
        this.workOrderList = res;

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
  projectGroup: ProjectGroupPersonnelDTO[] = [];

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
  assignedToUser = true;
  assignedToGroup = false;
  openAssignedToUserCard(event) {
    if (event.source._checked) {
      this.assignedToUser = true;
      this.assignedToGroup = false;
    }
  }

  openAssignedToGroupCard(event) {
    this.getPersonnelGroupOfProject();
    if (event.source._checked) {
      this.assignedToGroup = true;
      this.assignedToUser = false;
    }
  }
}
