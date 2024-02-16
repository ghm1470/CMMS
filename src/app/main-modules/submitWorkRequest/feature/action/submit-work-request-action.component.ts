import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {SubmitWorkRequest} from '../../model/submit-work-request';
import {EnumHandle} from '../../../formBuilder/shared/utility/enum-array/enum-handle';

import {WorkOrderStatusEnum} from '../../../basicInformation/workOrderStatus/model/helper/workOrderStatusEnum';
import {EnumObject} from '../../../formBuilder/shared/utility/enum-array/enum-object';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FormService} from '../../../formBuilder/fb-service/form.service';
import {ActivityService} from '../../../activity/service/activity.service';
import {WorkRequestService} from '../../endpoint/work-request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDto} from '../../../user/model/dto/user-dto';
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {CategoryDto} from "../../../category/model/dto/categoryDto";
import CategoryType = CategoryDto.CategoryType;
import {WorkRequestSerialNumberService} from "../../endpoint/work-request-serial-number.service";

declare var $: any;

@Component({
    selector: 'app-submit-work-request-action',
    templateUrl: './submit-work-request-action.component.html',
    styleUrls: ['./submit-work-request-action.component.scss']
})
export class SubmitWorkRequestActionComponent implements OnInit, OnDestroy, AfterViewInit {
    doSave = false;
    submitWorkRequest = new SubmitWorkRequest();
    myMoment = Moment;
    notEAssetId = false;
    myPattern = MyPattern;
    workOrderStatusList: EnumObject[] = [];
    priorityList: EnumObject[] = [];
    maintenanceTypeList: EnumObject[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    activityList: ActivityForThisAsset [] = [];
    activityId: string;
    activityName: string;
    user: UserDto.Create = new UserDto.Create();
    AL = new ActivityForThisAsset();
    recipientOfTheRequest = new RecipientOfTheRequest();
    emSheetCode = '00000';

    activityInstanceId: string;
    @Input() workRequestId: string;
    @Output() back = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();

    constructor(private assetService: AssetService,
                private formService: FormService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private workRequestService: WorkRequestService,
                private workRequestSerialNumberService: WorkRequestSerialNumberService,
    ) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.workRequestId = this.activatedRoute.snapshot.queryParams.workRequestId;

    }

    ngOnInit() {
        this.activityList = [];
        this.assetList = [];
        if (!isNullOrUndefined(this.workRequestId)) {
            this.getRequesterUser();
        }
        this.getAllAsset();
        this.workOrderStatusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<WorkOrderStatusEnum>(WorkOrderStatusEnum));
        // this.submitWorkRequest.workOrderStatus = this.workOrderStatusList[6].value;
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
        if (this.workRequestId) {
            this.getOneWorkRequest();
        } else {
            // خواندن آخرین شماره برگه em
            this.workRequestSerialNumberService.workRequestSerialNumber().subscribe((res: number) => {
                this.emSheetCode = this.emSheetCode + res;
                this.emSheetCode = this.emSheetCode.slice(this.emSheetCode.length - 5);
            });
        }


    }

    ngAfterViewInit(): void {
        this.setDateJquery();
    }

    inputFailureDate: any;

    setDateJquery() {
        $('#inputFailureDate').azPersianDateTimePicker({
            Placement: 'bottom', // default is 'bottom'
            Trigger: 'click', // default is 'focus',
            enableTimePicker: true, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#inputFailureDate'),
            textFormat: 'yyyy/MM/dd  -  HH:mm',
        }).on('change', (e) => {
            const val = $(e.currentTarget).val();
            this.inputFailureDate = val;
        });
    }

    getAllAsset() {
        this.assetService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.CreateAsset[]) => {
            if (!isNullOrUndefined(res)) {
                this.assetList = res;
                this.assetList = this.assetList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);

            }
        });
    }

    getRequesterUser() {
        this.workRequestService.getRequesterUser({requestId: this.workRequestId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: RecipientOfTheRequest) => {
            if (!isNullOrUndefined(res)) {
                this.recipientOfTheRequest = res;
                if (!isNullOrUndefined(this.recipientOfTheRequest.userTypeName)) {
                    this.recipientOfTheRequest.userTypeName = '/' + this.recipientOfTheRequest.userTypeName;
                }
            }
        });
    }

    getOneWorkRequest() {
        this.workRequestService.getOneWorkRequest({workRequestId: this.workRequestId})
            .subscribe(res => {
                if (!isNullOrUndefined(res)) {
                    this.emSheetCode = this.emSheetCode + res.number;
                    this.emSheetCode = this.emSheetCode.slice(this.emSheetCode.length - 5);

                    this.submitWorkRequest = JSON.parse(JSON.stringify(res));
                    this.getAllActivity();
                    this.activityId = res.activityId;
                    this.activityInstanceId = this.submitWorkRequest.activityInstanceId;
                    if (!isNullOrUndefined(this.submitWorkRequest.failureDate)) {
                        const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                        (new Date(this.submitWorkRequest.failureDate).toISOString()));
                        $('#inputFailureDate').val(jEndDate).trigger('change');

                    }

                }
            });
    }

    loading = false;

    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // if (!this.submitWorkRequest.emSheetCode) {
        //     DefaultNotify.notifyDanger('شماره برگه em وارد شود .', '', NotiConfig.notifyConfig);
        //     return;
        // }
        if (!this.submitWorkRequest.description) {
            DefaultNotify.notifyDanger('شرح درخواست  وارد شود .', '', NotiConfig.notifyConfig);
            return;
        }
        if (isNullOrUndefined(this.submitWorkRequest.assetId)) {
            this.notEAssetId = true;
            this.doSave = false;
            DefaultNotify.notifyDanger('دستگاه وارد شود', '', NotiConfig.notifyConfig);
            return;
        } else {
            this.notEAssetId = false;
        }
        if (this.activityList.length === 0) {
            DefaultNotify.notifyDanger(' دستگاه انتخاب شده فرایند ندارد و نمیتوان درخواست ثبت نموند.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.submitWorkRequest.activityId) {
            DefaultNotify.notifyDanger('جریان تعمیر انتخاب  شود .', '', NotiConfig.notifyConfig);
            return;
        }
        this.submitWorkRequest.userId = this.user.id;
        if (!this.workRequestId) {
            // this.submitWorkRequest.title = Toolkit2.Common.Fa2En(this.submitWorkRequest.title);


            ////////////////////////////////    ///////////////////////////
            // if (this.activityList.length > 0) {
            //     this.submitWorkRequest.activityId = this.activityList[0].id;
            // }
            if (this.inputFailureDate) {

                this.submitWorkRequest.failureDate = this.myMoment.convertJaliliToIsoDateWithTime(this.inputFailureDate);
            } else {

                DefaultNotify.notifyDanger('لطفا تاریخ و ساعت وقوع خرابی را وارد نمایید.', '', NotiConfig.notifyConfig);
                return;
            }
            this.loading = true;
            // چک کردن تکراری بودن برگه EM
            // this.workRequestService.checkPmSheetCode(
            //     {pmSheetCode: this.submitWorkRequest.pmSheetCode}).subscribe((resCheck: boolean) => {
            //     if (resCheck) {
            //         this.loading = false;
            //         DefaultNotify.notifyDanger('شماره برگه  EM وارد شده تکراری است .', '', NotiConfig.notifyConfig);
            //         return;
            //     } else {
            this.workRequestService.createWorkRequest(this.submitWorkRequest).subscribe(res => {
                this.loading = false;

                DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                this.backToList(true);
                // }
            }, error => {
                this.loading = false;
            });

            // }
            // }, error => {
            //     this.loading = false;
            // });


        }
    }


    getAllActivity() {
        this.notEAssetId = false;
        this.submitWorkRequest.activityId = null;
        this.activityList = [];
        this.workRequestService.getActivityIdListForThisAsset({assetId: this.submitWorkRequest.assetId}).subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.activityList = res;
                if (this.activityList.length === 1) {
                    this.AL = this.activityList[0];
                    this.submitWorkRequest.activityId = this.AL.id;
                    this.activityName = this.AL.title;
                }

            }
        });
    }

    backToList(save?) {
        this.back.emit(true);
        if (save) {
            this.save.emit(true);
        }
        // this.router.navigateByUrl('/panel/submitWorkRequest');

    }


    ngOnDestroy(): void {
    }


}

export class ActivityForThisAsset {
    id: string;
    title: string;
}

export class RecipientOfTheRequest {
    id: string;
    name: string;
    family: string;
    userTypeName: string;
}
