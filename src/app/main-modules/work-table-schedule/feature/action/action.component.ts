import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {typeOfActivityDto} from '../../../basicInformation/type-of-activity/model/type-of-activity-dto';
import {DegreeOfImportanceDto} from '../../../basicInformation/degree-of-importance/model/degree-of-importance-dto';
import {workingField} from '../../../basicInformation/working-field/model/working-field-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {TypeOfActivityService} from '../../../basicInformation/type-of-activity/endpoint/type-of-activity.service';
import {DegreeOfImportanceService} from '../../../basicInformation/degree-of-importance/endpoint/degree-of-importance.service';
import {WorkingFieldService} from '../../../basicInformation/working-field/endpoint/working-field.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {ScheduleDto} from '../../../scheduling/model/scheduleDto';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import GetOneUsedPart = WorkOrderDto.GetOneUsedPart;
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../../part/model/dto/part';
import {WorkOrderScheduleService} from '../../endpoint/work-order-schedule.service';
import {WorkTableSchedule} from '../../model/workTableSchedule';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {WorkTableScheduleService} from '../../endpoint/work-table-schedule.service';

declare var $: any;

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        private entityService: WorkOrderScheduleService,
        private workTableScheduleService: WorkTableScheduleService,
        private userService: UserService,
        private typeOfActivityService: TypeOfActivityService, // نوع فعایت
        private degreeOfImportanceService: DegreeOfImportanceService, //  درجه اهمیت
        private workingFieldService: WorkingFieldService, // رسته کاری

    ) {
    }

    @Input() entityId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: number;
    @Input() workRequestAcceptor: boolean; // مشخص میکند که کاربر تایید کننده هست یا نه
    @Input() actionMode: ActionMode;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    // نوع فعایت
    typeOfActivityList: typeOfActivityDto.GetAll[];
    loadingTypeOfActivityList: boolean;
    //  درجه اهمیت
    degreeOfImportanceList: DegreeOfImportanceDto.GetAll[];
    loadingDegreeOfImportanceList: boolean;
    // رسته کاری
    workingFieldList: workingField.GetAll[];
    loadingWorkingFieldList: boolean;

    AssetStatus = ScheduleDto.AssetStatus;

    userList: UserDto.GetUserWithUserType[] = [];
    loadingGetUsers = false;

    loadingAction = false;

    loadingGetOne = true;

    htmlForm: FormGroup;
/////////////// قطعات
    getOneUsedPartList: GetOneUsedPart[] = [];                        // قطعات استفاده شده

    showModalBody = false;
    myMoment = Moment;
    entity = new WorkTableSchedule.WorkOrderScheduleDTO();

    inputActionDate: any; // تاریخ اقدام

    ngOnInit(): void {
        this.creatForm();
        this.getUserWithUserType();
        this.getAllTypeOfActivity();
        this.getAllDegreeOfImportanceList();
        this.getAllWorkingFieldList();
    }

    creatForm() {
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),
        this.htmlForm = new FormGroup({
            assetId: new FormControl({value: null, disabled: true}), // نام دستگاه
            majorPart: new FormControl({value: null, disabled: true}), // قطعه اصلی
            minorPart: new FormControl({value: null, disabled: true}), // قطعه جزئی
            startDate: new FormControl({value: null, disabled: true}), // تاریخ سررسید

            typeOfActivity: new FormControl(),  // نوع فعایت
            assetStatus: new FormControl(),  // وضعیت تجهیز
            workingField: new FormControl(), // رسته کاری
            degreeOfImportance: new FormControl(),  //  درجه اهمیت

            actionDate: new FormControl(),  // تاریخ اقدام
            activityTime: new FormControl(),  //  مدت زمان فعالیت

            requestDescription: new FormControl(),  //// شرح فعالیت
            userIdList: new FormControl(), //  افراد تعمیر کننده
        });

        if (this.actionMode === ActionMode.EDIT) {
            this.getOne();
        }
    }

    getUserWithUserType() {
        this.loadingGetUsers = true;

        this.userService.getUserWithUserType().subscribe((res: UserDto.GetUserWithUserType[]) => {
            if (res) {
                this.userList = res;
                for (const user of this.userList) {
                    user.nameForShow = user.name + ' ' + user.family + ' - ' + user.userTypeName;
                    this.htmlForm.addControl(user.id, new FormControl(null, Validators.required));
                }
                this.loadingGetUsers = false;
            }
        }, error => {
            this.loadingGetUsers = false;
        });
    }

    // نوع فعایت
    getAllTypeOfActivity() {
        this.loadingTypeOfActivityList = true;
        this.typeOfActivityService.getAll().subscribe((res) => {
            this.loadingTypeOfActivityList = false;
            if (res) {
                this.typeOfActivityList = res;
            }
        }, error => {
            this.loadingTypeOfActivityList = false;
        });

    }

    //  درجه اهمیت
    getAllDegreeOfImportanceList() {
        this.loadingDegreeOfImportanceList = true;
        this.degreeOfImportanceService.getAll().subscribe((res) => {
            this.loadingDegreeOfImportanceList = false;
            if (res) {
                this.degreeOfImportanceList = res;
            }
        }, error => {
            this.loadingDegreeOfImportanceList = false;
        });
    }

    // رسته کاری
    getAllWorkingFieldList() {
        this.loadingWorkingFieldList = true;
        this.workingFieldService.getAll().subscribe((res) => {
            this.loadingWorkingFieldList = false;
            if (res) {
                this.workingFieldList = res;
            }
        }, error => {
            this.loadingWorkingFieldList = false;
        });
    }

    getOne() {
        this.entityService.getOneScheduleWorkOrder(
            {workOrderId: this.entityId}).subscribe((res: any) => {
            if (res.res.usedPartList) {
                if (res.res.usedPartList.length > 0) {
                    for (const part of res.res.usedPartList) {
                        const newPart = new GetOneUsedPart();
                        newPart.partId = part.partId;
                        newPart.partName = res.usePart.find(p => p.id === part.partId).name;
                        newPart.partCode = res.usePart.find(p => p.id === part.partId).partCode;
                        newPart.partCode = part.partCode;
                        newPart.usedNumber = part.usedNumber;
                        this.getOneUsedPartList.push(newPart);
                    }
                }
            }
            this.entity = res.res;
            this.entity.activityLevelId = this.activityLevelId;
            this.entity.activityInstanceId = this.activityInstanceId;
            this.patchValue(res.res);
        }, error => {
            DefaultNotify.notifyDanger(' خطا در  خواندن اطلاعات زمانبندی   . ', '', NotiConfig.notifyConfig);
            this.cancel();

        });
    }

    patchValue(entity: WorkTableSchedule.WorkOrderScheduleDTO) {
        entity.assetName ? this.htmlForm.patchValue({assetId: entity.assetName}) : null;
        entity.mainSubSystemName ? this.htmlForm.patchValue({majorPart: entity.mainSubSystemName}) : null;
        entity.minorSubSystem ? this.htmlForm.patchValue({minorPart: entity.minorSubSystem}) : null;
        if (entity.startDate) {
            const startDate = Toolkit2.Common.En2Fa(this.myMoment.getJaliliDateFromIso(entity.startDate));
            // $('#inputStartDate').val(startDate).trigger('change');
            entity.startDate ? this.htmlForm.patchValue({startDate}) : null;
        }


        entity.activityTypeId ? this.htmlForm.patchValue({typeOfActivity: entity.activityTypeId}) : null;
        entity.assetStatus ? this.htmlForm.patchValue({assetStatus: entity.assetStatus}) : null;
        entity.workCategoryId ? this.htmlForm.patchValue({workingField: entity.workCategoryId}) : null;
        entity.importanceDegreeId ? this.htmlForm.patchValue({degreeOfImportance: entity.importanceDegreeId}) : null;

        if (entity.endDate) {
            const actionDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
            (new Date(entity.endDate).toISOString()));
            $('#inputActionDate').val(actionDate).trigger('change');
        }

        entity.activityTime ? this.htmlForm.patchValue({activityTime: entity.activityTime}) : null;
        entity.solution ? this.htmlForm.patchValue({requestDescription: entity.solution}) : null;
        entity.userIdList ? this.htmlForm.patchValue({userIdList: entity.userIdList}) : null;

    }


    loadingRouterToAction = false;

    checkIfActivityLevelIsPending(type: string) {
        this.loadingRouterToAction = true;
        this.workTableScheduleService.checkIfActivityLevelIsPending({
            activityInstanceId: this.entity.activityInstanceId,
            activityLevelId: this.entity.activityLevelId,
        }).subscribe((res: boolean) => {
            this.loadingRouterToAction = false;
            if (res === true) {
                this.onSubmit(type);
            } else {
                DefaultNotify.notifyDanger(' فرایند توسط شخص دیگری ثبت گردید .', '', NotiConfig.notifyConfig);
                return;
            }
        }, error => {
            this.loadingRouterToAction = false;
        });

    }


    onSubmit(type: string) {
        const dto = new WorkTableSchedule.WorkOrderScheduleDTO();
        // dto = JSON.parse(JSON.stringify(this.entity));
        dto.id = this.entity.id;
        dto.assetId = this.entity.assetId;
        dto.assetName = this.entity.assetName;
        dto.mainSubSystemId = this.entity.mainSubSystemId;
        dto.mainSubSystemName = this.entity.mainSubSystemName;
        dto.minorSubSystem = this.entity.minorSubSystem;
        dto.startDate = this.entity.startDate;


        this.htmlForm.controls.typeOfActivity.value ? dto.activityTypeId = this.htmlForm.controls.typeOfActivity.value : null;
        dto.activityTypeId ? dto.activityTypeName = this.typeOfActivityList.find(a => a.id === dto.activityTypeId).name : null;

        this.htmlForm.controls.workingField.value ? dto.workCategoryId = this.htmlForm.controls.workingField.value : null;
        dto.workCategoryId ? dto.workCategoryName = this.workingFieldList.find(a => a.id === dto.workCategoryId).name : null;

        this.htmlForm.controls.degreeOfImportance.value ? dto.importanceDegreeId = this.htmlForm.controls.degreeOfImportance.value : null;
        dto.importanceDegreeId ? dto.importanceDegreeName = this.degreeOfImportanceList.find(a => a.id === dto.importanceDegreeId).name : null;

        this.htmlForm.controls.assetStatus.value ? dto.assetStatus = this.htmlForm.controls.assetStatus.value : null;

        if (this.inputActionDate) {
            dto.endDate = this.myMoment.convertJaliliToGregorian(this.inputActionDate);
            dto.endDate = dto.endDate.replaceAll('/', '-') + 'T00:00:00.000Z';
        } else {
            dto.endDate = null;
            // DefaultNotify.notifyDanger('تاریخ اقدام وارد شود  . ', '', NotiConfig.notifyConfig);
            // return;

        }
        this.htmlForm.controls.activityTime.value ? dto.activityTime = this.htmlForm.controls.activityTime.value : null;
        this.htmlForm.controls.requestDescription.value ? dto.solution = this.htmlForm.controls.requestDescription.value : null;
        this.htmlForm.controls.userIdList.value ? dto.userIdList = this.htmlForm.controls.userIdList.value : [];
        dto.usedPartList = [];
        for (const part of this.getOneUsedPartList) {
            const usedPart = new ScheduleDto.UsedPart();
            usedPart.partId = part.partId;
            if (part.usedNumber) {

                if (part.usedNumber.toString().length === 0) {
                    usedPart.usedNumber = 0;
                } else {
                    usedPart.usedNumber = +part.usedNumber;
                }
                if (usedPart.usedNumber === 0) {
                    DefaultNotify.notifyDanger('    تعداد قطعه   ' + part.partName + ' وارد شود. ', '', NotiConfig.notifyConfig);
                    return;
                }
            } else {
                DefaultNotify.notifyDanger('    تعداد قطعه   ' + part.partName + ' وارد شود. ', '', NotiConfig.notifyConfig);
                return;
            }
            dto.usedPartList.push(usedPart);
        }
        this.loadingAction = true;
        if (type === 'accept') {
            this.workOrderAcceptedByManager(true);

        } else if (type === 'reject') {
            this.workOrderAcceptedByManager(false);
        }
        this.entityService.updateScheduleWorkOrder(dto).subscribe((res: boolean) => {
            this.loadingAction = false;
            // if (res) {
            DefaultNotify.notifySuccess(' با موفقیت ویرایش شد . ', '', NotiConfig.notifyConfig);
            if (type === 'accept') {
                this.whenUserPushesTheAcceptButtonInConstantForm();
            } else if (type === 'reject') {
                this.whenUserPushesTheRejectButtonInConstantForm();
            }
            // } else {
            //     DefaultNotify.notifyDanger(' خطا در  ویرایش  . ', '', NotiConfig.notifyConfig);
            // }
        }, error => {
            DefaultNotify.notifyDanger(' خطا در  ویرایش  . ', '', NotiConfig.notifyConfig);
            this.loadingAction = false;
        });
    }

    workOrderAcceptedByManager(workOrderAccepted: boolean) {
        if (this.workRequestAcceptor) {
            this.workTableScheduleService.workOrderAcceptedByManager({
                workOrderId: this.entity.id,
                workRequestId: this.entity.workRequestId,
                activityInstanceId: this.entity.activityInstanceId,
                workOrderAccepted

            }).subscribe();
        }

    }

    // تایید //
    whenUserPushesTheAcceptButtonInConstantForm() {
        this.loadingAction = true;
        this.workTableScheduleService.whenUserPushesTheAcceptButtonInConstantForm({
            activityLevelId: this.entity.activityLevelId,
            instanceId: this.entity.activityInstanceId
        }).subscribe(() => {
            this.cancel();
            this.edit.emit(true);
        }, error => {
            this.cancel();
            this.edit.emit(true);
        });
    }

    // رد //
    whenUserPushesTheRejectButtonInConstantForm() {
        this.workTableScheduleService.whenUserPushesTheRejectButtonInConstantForm({
            activityLevelId: this.entity.activityLevelId,
            instanceId: this.entity.activityInstanceId
        }).subscribe(() => {
            this.cancel();
            this.edit.emit(true);
        }, error => {
            this.cancel();
            this.edit.emit(true);
        });
    }

    cancel() {
        this.back.emit(true);

    }

    setDateJquery() {
        setTimeout(t => {

            $('#inputActionDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputActionDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputActionDate = val;
                    console.log(val);
                });

        }, 50);
    }

/// قطعات
    openViewPartModal() {
        this.showModalBody = false;
        setTimeout(() => {
            this.showModalBody = true;
            setTimeout(() => {
                ModalUtil.showModal('viewPartForPartWhitUsageCount');
            }, 100);
        }, 10);
    }

    receiveSelectedPart(event: PartDto.GetAll) {

        const newPart = new GetOneUsedPart();
        newPart.partId = event.partId;
        newPart.partName = event.partName;
        newPart.partCode = event.partCode;
        newPart.usedNumber = null;
        this.getOneUsedPartList.push(newPart);


        console.log(event);
    }

    deletePart(part: GetOneUsedPart, index) {
        if (this.getOneUsedPartList.some(p => p.partId === part.partId)) {
            this.getOneUsedPartList.splice(index, 1);

        }

    }

    keydownUsedNumber(event: any, item: GetOneUsedPart) {
        if (event.key === 'ArrowUp') {
            item.usedNumber++;
        } else if (event.key === 'ArrowDown') {
            if (item.usedNumber > 0) {
                item.usedNumber--;
            }
        }
    }

    public ngAfterViewInit(): void {
        this.setDateJquery();
    }

    ngOnDestroy(): void {
    }

}
