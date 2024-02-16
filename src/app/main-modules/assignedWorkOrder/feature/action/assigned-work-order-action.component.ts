import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {ProjectDto} from '../../../project/model/dto/projectDto';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {WorkOrderStatus} from '../../../basicInformation/workOrderStatus/model/dto/workOrderStatus';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {Location} from '@angular/common';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {WorkOrderStatusService} from '../../../basicInformation/workOrderStatus/endpoint/work-order-status.service';
import {ProjectService} from '../../../project/endpoint/project.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {ActivatedRoute} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FileModel} from '../../../../shared/model/fileModel';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {CompanyDto} from '../../../company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
declare var $: any;
@Component({
  selector: 'app-assigned-work-order-action',
  templateUrl: './assigned-work-order-action.component.html',
  styleUrls: ['./assigned-work-order-action.component.scss']
})
export class AssignedWorkOrderActionComponent implements OnInit, OnDestroy, AfterViewInit {

  // mode: ActionMode = ActionMode.ADD;
  // actionMode = ActionMode;
  // workOrder = new WorkOrderDto.Create();
  // workOrderCopy = new WorkOrderDto.Create();
  //
  // workOrderId: string;
  // myPattern = MyPattern;
  // files: Array<File> = [];
  // fileModel: Array<any> = [];
  // doSave = false;
  // menuStatus = false;
  // projectList: ProjectDto.Create[] = [];
  // assetList: AssetDto.CreateAsset[] = [];
  // workOrderStatusList: WorkOrderStatus[] = [];
  //
  // priorityList = [] as EnumObject[];
  // maintenanceTypeList = [] as EnumObject[];
  //
  // myMoment = Moment;
  //
  // basicInformation = false;
  // completionDetails = false;
  // tasks = false;
  // parts = false;
  // miscCost = false;
  // notification = false;
  // reports = false;
  // file = false;
  // taskGroup = false;

  constructor(
    public location: Location,
    public workOrderService: WorkOrderService,
    public workOrderStatusService: WorkOrderStatusService,
    public projectService: ProjectService,
    public assetService: AssetService,
    public uploadService: UploadService,
    private activatedRoute: ActivatedRoute
  ) {
    // this.mode = this.activatedRoute.snapshot.queryParams.mode;
    // this.workOrderId = this.activatedRoute.snapshot.queryParams.assignedWorkOrderId;
    // this.workOrder.assetId = '-1';
    // this.workOrder.projectId = '-1';
    // this.workOrder.statusId = '-1';
    // this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
    // this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
  }

  ngOnInit() {
    // if (this.mode !== ActionMode.ADD) {
    //   if (!isNullOrUndefined(this.workOrderId)) {
    //     this.getOne();
    //     this.menuStatus = true;
    //   }
    // }
    // this.getAllWorkOrderStatus();
    // this.getAllProject();
    // this.getAllAsset();
  }
  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    const mthis = this;
    // $('#requiredCompletionDate').azPersianDateTimePicker({
    //   Placement: 'left', // default is 'bottom'
    //   Trigger: 'focus', // default is 'focus',
    //   enableTimePicker: false, // default is true,
    //   TargetSelector: '', // default is empty,
    //   GroupId: '', // default is empty,
    //   ToDate: false, // default is false,
    //   FromDate: false, // default is false,
    //   targetTextSelector: $('#requiredCompletionDate'),
    //   disableBeforeToday: true
    // }).on('change', (e) => {
    //   console.log($(e.currentTarget).val());
    //   try {
    //     mthis.workOrder.requiredCompletionDate =
    //       mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    //   } catch (e) {
    //     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
    //   }
    // });
    // $('#startDate').azPersianDateTimePicker({
    //   Placement: 'left', // default is 'bottom'
    //   Trigger: 'focus', // default is 'focus',
    //   enableTimePicker: false, // default is true,
    //   TargetSelector: '', // default is empty,
    //   GroupId: '', // default is empty,
    //   ToDate: false, // default is false,
    //   FromDate: false, // default is false,
    //   targetTextSelector: $('#startDate'),
    //   disableBeforeToday: true
    // }).on('change', (e) => {
    //   console.log($(e.currentTarget).val());
    //   try {
    //     mthis.workOrder.startDate =
    //       mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    //   } catch (e) {
    //     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
    //   }
    // });
    // $('#endDate').azPersianDateTimePicker({
    //   Placement: 'left', // default is 'bottom'
    //   Trigger: 'focus', // default is 'focus',
    //   enableTimePicker: false, // default is true,
    //   TargetSelector: '', // default is empty,
    //   GroupId: '', // default is empty,
    //   ToDate: false, // default is false,
    //   FromDate: false, // default is false,
    //   targetTextSelector: $('#endDate'),
    //   disableBeforeToday: true
    // }).on('change', (e) => {
    //   console.log($(e.currentTarget).val());
    //   try {
    //     mthis.workOrder.endDate =
    //       mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
    //     this.checkDates();
    //   } catch (e) {
    //     DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.');
    //   }
    // });
  }

  // checkDates() {
  //   if (!isNullOrUndefined(this.workOrder.startDate) && !isNullOrUndefined(this.workOrder.endDate)) {
  //     if (this.workOrder.endDate < this.workOrder.startDate) {
  //       DefaultNotify.notifyDanger('تاریخ پایان پروژه نباید قبل از تاریخ شروع پروژه باشد.');
  //       return false;
  //     }
  //   }
  //   return true;
  // }
  //
  // getAllAsset() {
  //   this.assetService.getAll().pipe(takeUntilDestroyed(this))
  //     .subscribe( (res: AssetDto.CreateAsset[]) => {
  //       if (res && res.length) {
  //         this.assetList = res;
  //       }
  //     });
  // }
  //
  // getAllProject() {
  //   this.projectService.getAll().pipe(takeUntilDestroyed(this))
  //     .subscribe( (res: ProjectDto.Create[]) => {
  //       if (res && res.length) {
  //         this.projectList = res;
  //       }
  //     });
  // }
  //
  // getAllWorkOrderStatus() {
  //   this.workOrderStatusService.getAll().pipe(takeUntilDestroyed(this))
  //     .subscribe( (res: WorkOrderStatus[]) => {
  //       if (res && res.length) {
  //         this.workOrderStatusList = res;
  //       }
  //     });
  // }
  //
  // getOne() {
  //   this.workOrderService.getOne({workOrderId: this.workOrderId})
  //     .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.Create) => {
  //     console.log('getOne', res);
  //     if (res) {
  //       this.workOrder = res;
  //       this.workOrderCopy = JSON.parse(JSON.stringify(res));
  //       $('#informationInMenu').click();
  //       $('#informationInMenu').click();
  //       $('#informationInMenu').click();
  //       if (!isNullOrUndefined(this.workOrder.requiredCompletionDate)) {
  //         $('#requiredCompletionDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.workOrder.requiredCompletionDate)));
  //       }
  //       if (!isNullOrUndefined(this.workOrder.startDate)) {
  //         $('#startDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.workOrder.startDate)));
  //       }
  //       if (!isNullOrUndefined(this.workOrder.endDate)) {
  //         $('#endDate').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(this.workOrder.endDate)));
  //       }
  //     }
  //   });
  // }
  //
  // action(form) {
  //   this.doSave = true;
  //   if (form.invalid) {
  //     DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.');
  //     return;
  //   }
  //   if (!this.workOrder.startDate) {
  //     DefaultNotify.notifyDanger('زمان شروع کار را وارد کنید.');
  //     return;
  //   }
  //   if (!this.workOrder.requiredCompletionDate) {
  //     DefaultNotify.notifyDanger('آخرین مهلت را وارد کنید.');
  //     return;
  //   }
  //   if (this.checkDates()) {
  //     if (this.mode === ActionMode.ADD) {
  //       this.workOrderService.create(this.workOrder)
  //         .pipe(takeUntilDestroyed(this)).subscribe(res => {
  //         if (res && res.id) {
  //           DefaultNotify.notifySuccess('با موفقیت افزوده شد.');
  //           this.menuStatus = true;
  //           this.workOrderId = res.id;
  //           this.workOrder.id = res.id;
  //           this.mode = ActionMode.EDIT;
  //           $('#informationInMenu').click();
  //         } else {
  //           DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
  //         }
  //       });
  //     } else if (this.mode === ActionMode.EDIT) {
  //       this.workOrderService.update(this.workOrder, {workOrderId: this.workOrderId})
  //         .pipe(takeUntilDestroyed(this)).subscribe(res => {
  //         if (res) {
  //           DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
  //         } else {
  //           DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
  //         }
  //       });
  //     }
  //   }
  // }
  //
  // cancel() {
  //   this.location.back();
  // }



  // onChangeUploader(input) {
  //   if (input.files.length > 0) {
  //     this.files = [];
  //     for (const i of input.files) {
  //       console.log(i.size);
  //       if (i.size < 100000000) {
  //         const file: FileModel = new FileModel();
  //         const f = i.type.split('/');
  //         file.name = i.name;
  //         file.type = f[0];
  //         file.lastModified = i.lastModified;
  //         this.fileModel.push(file);
  //         this.onUploadFile(i);
  //       } else {
  //         DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.');
  //       }
  //     }
  //     if (this.files.length > 0) {
  //     }
  //   }
  // }
  //
  // onUploadFile(file) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   this.uploadService.uploadFile(formData).pipe(takeUntilDestroyed(this))
  //     .subscribe((data: any) => {
  //       if (data) {
  //         this.workOrder.image = data;
  //         console.log('workOrder documents => ', this.workOrder.image);
  //       }
  //     });
  // }
  //
  // deleteImage() {
  //   this.workOrder.image = new DocumentFile();
  //   this.files = [];
  // }
  //
  // changeAssetCode() {
  //   this.workOrderService.checkWorkOrderCode({workOrderCode: this.workOrder.code})
  //     .pipe(takeUntilDestroyed(this)).subscribe( (res: any) => {
  //     if (res && res.exist) {
  //       DefaultNotify.notifyDanger('کد وارد شده موجود است.');
  //       if (isNullOrUndefined(this.workOrder.id)) {
  //         this.workOrder.code = '';
  //       } else {
  //         this.workOrder.code = this.workOrderCopy.code;
  //       }
  //     }
  //   });
  // }
  //
  // changeDocumentList($event: any) {
  //
  // }
}
