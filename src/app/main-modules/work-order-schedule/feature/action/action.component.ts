import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WorkOrderScheduleService} from '../../../work-table-schedule/endpoint/work-order-schedule.service';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScheduleDto} from '../../../scheduling/model/scheduleDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UserDto} from '../../../user/model/dto/user-dto';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../../part/model/dto/part';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {UserService} from '../../../user/endpoint/user.service';
import {TypeOfActivityService} from '../../../basicInformation/type-of-activity/endpoint/type-of-activity.service';
import {DegreeOfImportanceService} from '../../../basicInformation/degree-of-importance/endpoint/degree-of-importance.service';
import {WorkingFieldService} from '../../../basicInformation/working-field/endpoint/working-field.service';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {typeOfActivityDto} from '../../../basicInformation/type-of-activity/model/type-of-activity-dto';
import {DegreeOfImportanceDto} from '../../../basicInformation/degree-of-importance/model/degree-of-importance-dto';
import {workingField} from '../../../basicInformation/working-field/model/working-field-dto';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import GetOneUsedPart = WorkOrderDto.GetOneUsedPart;
import {WorkOrderSchedule} from '../../model/workOrderSchedule';

declare var $: any;

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() entityId: string;
    @Input() actionMode: ActionMode;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    ActionMode = ActionMode;
    myMoment = Moment;

    htmlForm: FormGroup;
    userList: UserDto.GetUserWithUserType[] = [];

    loadingGetUsers = false;


/////////////// قطعات
    getOneUsedPartList: GetOneUsedPart[] = [];                        // قطعات استفاده شده

    showModalBody = false;

/////////////// قطعات!!!
    inputEndDate: any;
    inputStartDate: any;

    // تناوب
    AssetStatus = ScheduleDto.AssetStatus;

    /// انتخاب دستگاه
    selectedAssetList: SelectedAsset[] = [];

    // نوع فعایت
    typeOfActivityList: typeOfActivityDto.GetAll[];
    loadingTypeOfActivityList: boolean;
    //  درجه اهمیت
    degreeOfImportanceList: DegreeOfImportanceDto.GetAll[];
    loadingDegreeOfImportanceList: boolean;
    // رسته کاری
    workingFieldList: workingField.GetAll[];
    loadingWorkingFieldList: boolean;

    loadingAction = false;

    constructor(private entityService: WorkOrderScheduleService,
                private userService: UserService,
                private typeOfActivityService: TypeOfActivityService, // نوع فعایت
                private degreeOfImportanceService: DegreeOfImportanceService, //  درجه اهمیت
                private workingFieldService: WorkingFieldService, // رسته کاری
                private assetService: AssetService) {
    }

    ngOnInit(): void {
        this.getUserWithUserType();
        this.creatForm();
        this.getAllTypeOfActivity();
        this.getAllDegreeOfImportanceList();
        this.getAllWorkingFieldList();
    }

    creatForm() {
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),
        this.htmlForm = new FormGroup({
            typeOfActivity: new FormControl(),  // نوع فعایت
            assetStatus: new FormControl(),  // وضعیت تجهیز
            requestDescription: new FormControl(),  // شرح فعالیت
            degreeOfImportance: new FormControl(),  //  درجه اهمیت
            workingField: new FormControl(), // رسته کاری
            activityTime: new FormControl(),  //  مدت زمان فعالیت
            estimateCompletionDate: new FormControl(),  //  تخمین  زمان  تکمیل  پس  از ساخت دستور کار
            userIdList: new FormControl(), //  افراد تعمیر کننده
            startDate: new FormControl({value: null, disabled: true}), // تاریخ شروع
            endDate: new FormControl({value: null, disabled: true}), // تاریخ پایان
        });

        if (this.actionMode === ActionMode.EDIT) {
            this.getOne();
        }
        if (this.actionMode === ActionMode.VIEW) {
            this.getOne();
            this.htmlForm.disable();

        }
    }

    getOne() {
        this.entityService.getOne({id: this.entityId}).subscribe((res: any) => {
            this.patchValue(res);
        });
    }

    patchValue(res) {
        const entity: ScheduleDto.GetOne = res.res[0];
        setTimeout(() => {
            if (entity.assetName) {
                const newAsset = new SelectedAsset();
                newAsset.id = entity.assetId;
                newAsset.title = entity.assetName;
                if (entity.activityId) {
                    newAsset.selectedActivity.id = entity.activityId;
                    newAsset.selectedActivity.title = entity.activityTitle;
                }
                if (entity.minorSubSystem) {
                    newAsset.selectedMinorPart = entity.minorSubSystem;
                }
                if (entity.mainSubSystemId) {
                    newAsset.selectedMajorPart.id = entity.mainSubSystemId;
                    newAsset.selectedMajorPart.title = entity.mainSubSystemName;
                }
                this.selectedAssetList.push(newAsset);
            }

            if (entity.usedPartList.length > 0) {
                for (const part of entity.usedPartList) {
                    const newPart = new GetOneUsedPart();
                    newPart.partId = part.partId;
                    newPart.partName = res.usePart.find(p => p.id === part.partId).name;
                    newPart.partCode = res.usePart.find(p => p.id === part.partId).partCode;
                    // newPart.partCode = part.partCode;
                    newPart.usedNumber = part.usedNumber;
                    this.getOneUsedPartList.push(newPart);
                }


            }


            if (!isNullOrUndefined(entity.startDate)) {
                const jStartDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(entity.startDate).toISOString()));
                $('#inputStartDate').val(jStartDate).trigger('change');

            }
            if (!isNullOrUndefined(entity.endDate)) {
                const jStartDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                (new Date(entity.endDate).toISOString()));
                $('#inputEndDate').val(jStartDate).trigger('change');

            }
            if (entity.activityTypeId) {
                this.htmlForm.patchValue({
                    typeOfActivity: entity.activityTypeId,
                });
            }
            if (entity.assetStatus) {
                this.htmlForm.patchValue({
                    assetStatus: entity.assetStatus,
                });
            }
            if (entity.workCategoryId) {
                this.htmlForm.patchValue({
                    workingField: entity.workCategoryId,
                });
            }
            if (entity.importanceDegreeId) {
                this.htmlForm.patchValue({
                    degreeOfImportance: entity.importanceDegreeId,
                });
            }
            if (entity.activityTime) {
                this.htmlForm.patchValue({
                    activityTime: entity.activityTime,
                });
            }
            if (entity.estimateCompletionDate) {
                this.htmlForm.patchValue({
                    estimateCompletionDate: entity.estimateCompletionDate,
                });
            }
            if (entity.solution) {
                this.htmlForm.patchValue({
                    requestDescription: entity.solution,
                });
            }
            if (entity.userIdList) {
                this.htmlForm.patchValue({
                    userIdList: entity.userIdList,
                });
            }
            // this.htmlForm.patchValue({
            //     // typeOfActivity: entity.activityTypeId,
            //     // assetStatus: entity.assetStatus,
            //     // workingField: entity.workCategoryId,
            //     // degreeOfImportance: entity.importanceDegreeId,
            //     // activityTime: entity.activityTime,
            //     // estimateCompletionDate: entity.estimateCompletionDate,
            //     // requestDescription: entity.solution,
            //     // userIdList: entity.userIdList,
            //
            // });


        }, 100);

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


    onSubmit() {
        if (this.loadingAction) {
            return;
        }

        const dto = new ScheduleDto.Create();

        dto.assetList = [];
        for (const asset of this.selectedAssetList) {
            const assetLight = new ScheduleDto.AssetLight();
            assetLight.assetId = asset.id;
            asset.selectedActivity.id ? assetLight.activityId = asset.selectedActivity.id : null;
            asset.selectedMajorPart ? assetLight.mainSubSystemId = asset.selectedMajorPart.id : null;
            asset.selectedMinorPart ? assetLight.minorSubSystem = asset.selectedMinorPart : null;
            dto.assetList.push(assetLight);
        }

        if (this.inputStartDate) {
            dto.startDate = this.myMoment.convertJaliliToGregorian(this.inputStartDate);
            dto.startDate = dto.startDate.replaceAll('/', '-');
            // + 'T00:00:00.000Z';
        }
        if (this.inputEndDate) {
            dto.endDate = this.myMoment.convertJaliliToGregorian(this.inputEndDate);
            dto.endDate = dto.endDate.replaceAll('/', '-');
            // + 'T23:59:59.000Z';
        }


        this.htmlForm.controls.typeOfActivity.value ? dto.activityTypeId = this.htmlForm.controls.typeOfActivity.value : null;
        this.htmlForm.controls.workingField.value ? dto.workCategoryId = this.htmlForm.controls.workingField.value : null;
        this.htmlForm.controls.degreeOfImportance.value ? dto.importanceDegreeId = this.htmlForm.controls.degreeOfImportance.value : null;
        this.htmlForm.controls.estimateCompletionDate.value ? dto.estimateCompletionDate = this.htmlForm.controls.estimateCompletionDate.value : null;
        this.htmlForm.controls.activityTime.value ? dto.activityTime = this.htmlForm.controls.activityTime.value : null;
        this.htmlForm.controls.requestDescription.value ? dto.solution = this.htmlForm.controls.requestDescription.value : null;
        this.htmlForm.controls.userIdList.value ? dto.userIdList = this.htmlForm.controls.userIdList.value : null;
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
        this.htmlForm.controls.assetStatus.value ? dto.assetStatus = this.htmlForm.controls.assetStatus.value : null;
        if (dto.assetList.length === 0) {
            DefaultNotify.notifyDanger('حداقل یک دستگاه انتخاب شود. ', '', NotiConfig.notifyConfig);
            return;
        }
        if (isNullOrUndefined(dto.estimateCompletionDate) || dto.estimateCompletionDate < 1) {
            DefaultNotify.notifyDanger('تخمین زمان تکمیل پس از ساخت دستور کار ،  وارد شود. ', '', NotiConfig.notifyConfig);
            return;
        }

        this.loadingAction = true;
        // if (this.actionMode === ActionMode.ADD) {
        //     this.entityService.create(dto).subscribe((res: any) => {
        //         this.loadingAction = false;
        //         if (res) {
        //             DefaultNotify.notifySuccess('با موفقیت ایجاد شد.', '', NotiConfig.notifyConfig);
        //             this.edit.emit(true);
        //             this.cancel();
        //         }
        //         console.log(dto);
        //     }, error => {
        //         this.loadingAction = false;
        //     });
        //
        // } else {
        const updateDto = new WorkOrderSchedule.Update();
        updateDto.id = this.entityId;
        updateDto.activityTypeId = dto.activityTypeId;
        updateDto.workCategoryId = dto.workCategoryId;
        updateDto.importanceDegreeId = dto.importanceDegreeId;
        updateDto.estimateCompletionDate = dto.estimateCompletionDate;
        updateDto.activityTime = dto.activityTime;
        updateDto.solution = dto.solution;
        updateDto.userIdList = dto.userIdList;
        updateDto.usedPartList = dto.usedPartList;
        updateDto.assetStatus = dto.assetStatus;

        this.entityService.update(updateDto).subscribe((res: any) => {
            this.loadingAction = false;
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                this.edit.emit(true);
                this.cancel();
            }
            console.log(dto);
        }, error => {
            this.loadingAction = false;
        });
        // }


    }

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

    setDateJquery() {
        setTimeout(t => {
            $('#inputEndDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputEndDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputEndDate = val;
                    console.log(val);
                });
            $('#inputStartDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputStartDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputStartDate = val;
                    console.log(val);
                });

        }, 50);
    }


    public ngAfterViewInit(): void {
        this.setDateJquery();
    }


///
    cancel() {
        this.back.emit(true);

    }

    ngOnDestroy(): void {
    }
}

export class SelectedAsset {
    id: string;
    title: string;
    selectedMajorPart = new MajorPart();
    selectedActivity = new ActivityPart();
    selectedMinorPart: string;
}


export class MajorPart {
    id: string;
    title: string;
}

export class ActivityPart {
    id: string;
    title: string;
}
