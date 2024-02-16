import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDto} from '../../user/model/dto/user-dto';
import {UserService} from '../../user/endpoint/user.service';
import {AssetDto} from '../../asset/model/dto/assetDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {CategoryDto} from '../../category/model/dto/categoryDto';
import {AssetService} from '../../asset/endpoint/asset.service';
import {WorkOrderDto} from '../../workOrder/model/dto/workOrderDto';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../part/model/dto/part';
import {NotiConfig} from '../../../shared/tools/notifyConfig';
import {DegreeOfImportanceService} from '../../basicInformation/degree-of-importance/endpoint/degree-of-importance.service';
import {TypeOfActivityService} from '../../basicInformation/type-of-activity/endpoint/type-of-activity.service';
import {WorkingFieldService} from '../../basicInformation/working-field/endpoint/working-field.service';
import {typeOfActivityDto} from '../../basicInformation/type-of-activity/model/type-of-activity-dto';
import {DegreeOfImportanceDto} from '../../basicInformation/degree-of-importance/model/degree-of-importance-dto';
import {workingField} from '../../basicInformation/working-field/model/working-field-dto';
import {ScheduleService} from '../endpoint/schedule.service';
import {ScheduleDto} from '../model/scheduleDto';
import {Moment} from '../../../shared/shared/tools/date/moment';
import CategoryType = CategoryDto.CategoryType;
import GetOneUsedPart = WorkOrderDto.GetOneUsedPart;
import RunStatus = ScheduleDto.RunStatus;
import Frequency = ScheduleDto.Frequency;

declare var $: any;

@Component({
    selector: 'app-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private entityService: ScheduleService,
                private userService: UserService,
                private typeOfActivityService: TypeOfActivityService, // نوع فعایت
                private degreeOfImportanceService: DegreeOfImportanceService, //  درجه اهمیت
                private workingFieldService: WorkingFieldService, // رسته کاری
                private assetService: AssetService) {
    }

    @Input() entityId: string;
    @Input() actionMode: ActionMode;
    ActionMode = ActionMode;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    myMoment = Moment;

    htmlForm: FormGroup;
    userList: UserDto.GetUserWithUserType[] = [];
    assetList: AssetDto.CreateAsset[] = [];
    majorPartList: AssetDto.CreateAsset[] = [];
    activityList: ActivityPart[] = [];
    loadingActivityList = false;
    loadingMajorPartList = false;
    loadingMinorPartList = false;

    loadingGetUsers = false;

    loadingAllAsset = false;

/////////////// قطعات
    getOneUsedPartList: GetOneUsedPart[] = [];                        // قطعات استفاده شده

    showModalBody = false;

/////////////// قطعات!!!
    inputEndDate: any;
    inputStartDate: any;

    // تناوب
    AssetStatus = ScheduleDto.AssetStatus;
    Frequency = ScheduleDto.Frequency;
    Mode = ScheduleDto.Mode;
    selectedMode = ScheduleDto.Mode.FLOAT;
    alternation = this.Frequency.DAILY;
    everyNumber = 1;

    /// انتخاب دستگاه
    selectedAssetList: SelectedAsset[] = [];

    loadingMajorPart = false;
    status = true;
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

    ngOnInit(): void {
        this.getAllFacility();
        this.getUserWithUserType();
        this.creatForm();
        this.getAllTypeOfActivity();
        this.getAllDegreeOfImportanceList();
        this.getAllWorkingFieldList();
    }

    creatForm() {
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),
        this.htmlForm = new FormGroup({
            assetId: new FormControl(), // نام دستگاه
            activityId: new FormControl({value: null, disabled: true}), // نام فرآیند
            typeOfActivity: new FormControl(),  // نوع فعایت
            assetStatus: new FormControl(),  // وضعیت تجهیز
            requestDescription: new FormControl(),  // شرح فعالیت
            degreeOfImportance: new FormControl(),  //  درجه اهمیت
            workingField: new FormControl(), // رسته کاری
            activityTime: new FormControl(),  //  مدت زمان فعالیت
            estimateCompletionDate: new FormControl(),  //  تخمین  زمان  تکمیل  پس  از ساخت دستور کار
            runStatus: new FormControl({value: true, disabled: true}),  //   وضعیت اجرا
            majorPart: new FormControl({value: null, disabled: true}), // قطعه اصلی
            minorPart: new FormControl({value: null, disabled: true}), // قطعه جزئی
            userIdList: new FormControl(), //  افراد تعمیر کننده
            inTermsOf: new FormControl(), //  برجسب {زمان/متراژ}
            alternation: new FormControl(), //  تناوب
            alternationMode: new FormControl(), //  نوع تناوب
            startDate: new FormControl(), // تاریخ شروع
            endDate: new FormControl(), // تاریخ پایان
            everyNumber: new FormControl(), //  هر چند روز/ماه/سال/هفته
        });
        // فعلا پون متراژ هنوز اضافه نشده
        this.htmlForm.patchValue({
            inTermsOf: 'time'
        });
        if (this.actionMode === ActionMode.VIEW) {
            this.getOne();
            this.htmlForm.disable();
        }
        if (this.actionMode === ActionMode.EDIT) {
            this.getOne();
        }
    }

    restForm() {
        this.htmlForm.controls.activityId.reset();// نام فرآیند
        this.htmlForm.controls.typeOfActivity.reset(); // نوع فعایت
        this.htmlForm.controls.assetStatus.reset(); // وضعیت تجهیز
        this.htmlForm.controls.requestDescription.reset(); // شرح فعالیت
        this.htmlForm.controls.degreeOfImportance.reset();//  درجه اهمیت
        this.htmlForm.controls.workingField.reset();// رسته کاری
        this.htmlForm.controls.activityTime.reset(); //  مدت زمان فعالیت
        this.htmlForm.controls.estimateCompletionDate.reset(); //  تخمین  زمان  تکمیل  پس  از ساخت دستور کار
        this.htmlForm.controls.runStatus.reset();  //   وضعیت اجرا
        this.htmlForm.controls.userIdList.reset();   //  افراد تعمیر کننده
        this.htmlForm.controls.inTermsOf.reset();   //  برجسب {زمان/متراژ}
        this.htmlForm.controls.alternation.reset();   //  تناوب
        this.htmlForm.controls.alternationMode.reset();   //  نوع تناوب
        this.htmlForm.controls.startDate.reset();  // تاریخ شروع
        this.htmlForm.controls.endDate.reset();   // تاریخ پایان
        this.htmlForm.controls.everyNumber.reset();   //  هر چند روز/ماه/سال/هفته
        this.getOneUsedPartList = [];
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),

        // فعلا پون متراژ هنوز اضافه نشده
        this.htmlForm.patchValue({
            inTermsOf: 'time'
        });
        this.htmlForm.patchValue({
            runStatus: true,
            alternation: this.Frequency.DAILY,
            alternationMode: ScheduleDto.Mode.FLOAT,
            everyNumber: 1
        });

    }


    getOne() {
        this.entityService.getOne({id: this.entityId}).subscribe((res: any) => {
            this.patchValue(res);
        });
    }

    nexDate: any;

    patchValue(res) {
        this.nexDate = res.res[0].nexDate;
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
            if (entity.runStatus === RunStatus.ACTIVE) {
                this.status = true;
                this.htmlForm.patchValue({
                    runStatus: true
                });
            } else {
                this.status = false;
                this.htmlForm.patchValue({
                    runStatus: false
                });
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
            if (entity.frequency) {
                this.everyNumber = entity.per;
                this.htmlForm.patchValue({
                    inTermsOf: 'time',
                    alternation: entity.frequency,
                    everyNumber: entity.per,
                    alternationMode: entity.mode,
                });
                this.selectedMode = entity.mode;
                this.alternation = entity.frequency;
            } else {
                this.htmlForm.patchValue({
                    inTermsOf: 'meter',
                });
            }

        }, 100);

    }


    getAllFacility() {

        this.loadingAllAsset = true;
        this.assetService.getAllFacility()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAllAsset = false;

            if (!isNullOrUndefined(res)) {
                this.assetList = res.data;

            }
        }, error => {
            this.loadingAllAsset = false;
        });
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

    // لیست فرآیندهای دستگاه انتخاب شده
    getListActivityByAssetId(assetId) {
        this.loadingActivityList = true;
        this.activityList = [];
        this.htmlForm.controls.activityId.reset();
        this.assetService.getListActivityByAssetId({assetId}).subscribe((res) => {
            this.htmlForm.controls.activityId.enable();
            this.activityList = res;
            this.loadingActivityList = false;
        }, error => {
            this.loadingActivityList = false;
        });
    }

    checkDiffDate() {

        const StartDate = new Date(this.myMoment.convertJaliliToIsoDate(this.inputStartDate));
        const EndDate = new Date(this.myMoment.convertJaliliToIsoDate(this.inputEndDate));

        const timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        console.log(diffDays);
        if (this.htmlForm.controls.inTermsOf.value === 'time') {
            if (this.alternation === Frequency.DAILY) {
                if (diffDays < this.everyNumber) {
                    DefaultNotify.notifyDanger(' بازه زمانی درست نیست. ', '', NotiConfig.notifyConfig);
                    return false;
                }
            } else if (this.alternation === Frequency.WEEKLY) {
                if (diffDays < this.everyNumber * 7) {
                    DefaultNotify.notifyDanger(' بازه زمانی درست نیست. ', '', NotiConfig.notifyConfig);
                    return false;
                }
            } else if (this.alternation === Frequency.MONTHLY) {
                if (diffDays < this.everyNumber * 30) {
                    DefaultNotify.notifyDanger(' بازه زمانی درست نیست. ', '', NotiConfig.notifyConfig);
                    return false;
                }
            } else if (this.alternation === Frequency.YEARLY) {
                if (diffDays < this.everyNumber * 365) {
                    DefaultNotify.notifyDanger(' بازه زمانی درست نیست. ', '', NotiConfig.notifyConfig);
                    return false;
                }
            }

        }
        return true;
    }

    onSubmit(type?) {
        if (!this.htmlForm.controls.inTermsOf.value) {
            DefaultNotify.notifyDanger('     لطفا فیلدهای اجباری را پرکنید. ', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.htmlForm.controls.inTermsOf.value === 'time') {
            if (!this.alternation
                || !this.everyNumber
                || !this.selectedMode
                || !this.inputEndDate
                || !this.inputStartDate) {
                DefaultNotify.notifyDanger('     لطفا فیلدهای اجباری را پرکنید. ', '', NotiConfig.notifyConfig);
                return;
            }


            if (this.inputEndDate && this.inputStartDate) {
                if (this.inputStartDate > this.inputEndDate) {
                    DefaultNotify.notifyDanger(' از تاریخ  باید قبل از تا تاریخ  باشد. ', '', NotiConfig.notifyConfig);
                    return;
                }

            }
        }
        // else if (!this.inputStartDate) {
        //     DefaultNotify.notifyDanger('  از تاریخ  وارد شود. ', '', NotiConfig.notifyConfig);
        //     return;
        // }
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
            // dto.startDate = dto.startDate.replaceAll('/', '-') + 'T00:00:00.000+03:30';
        }
        if (this.inputEndDate) {
            dto.endDate = this.myMoment.convertJaliliToGregorian(this.inputEndDate);
            dto.endDate = dto.endDate.replaceAll('/', '-');
            // + 'T23:59:59.000Z';
            // dto.endDate = dto.endDate.replaceAll('/', '-') + 'T23:59:00.000+03:30';

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
        this.htmlForm.controls.alternation.value ? dto.frequency = this.htmlForm.controls.alternation.value : null;
        this.htmlForm.controls.everyNumber.value ? dto.per = this.htmlForm.controls.everyNumber.value : null;
        this.htmlForm.controls.assetStatus.value ? dto.assetStatus = this.htmlForm.controls.assetStatus.value : null;
        if (this.htmlForm.controls.runStatus.value) {
            dto.runStatus = ScheduleDto.RunStatus.ACTIVE;
        } else {
            dto.runStatus = ScheduleDto.RunStatus.DE_ACTIVE;
        }
        if (this.htmlForm.controls.alternationMode.value) {
            dto.mode = this.htmlForm.controls.alternationMode.value;
        } else {
            dto.mode = ScheduleDto.Mode.FLOAT;
        }
        if (dto.assetList.length === 0) {
            DefaultNotify.notifyDanger('حداقل یک دستگاه انتخاب شود. ', '', NotiConfig.notifyConfig);
            return;
        }
        if (isNullOrUndefined(dto.estimateCompletionDate) || dto.estimateCompletionDate < 1) {
            DefaultNotify.notifyDanger('تخمین زمان تکمیل پس از ساخت دستور کار وارد شود. ', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.checkDiffDate()) {
            return;
        }
        this.loadingAction = true;
        if (this.actionMode === ActionMode.ADD) {
            this.entityService.create(dto).subscribe((res: any) => {
                this.loadingAction = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ایجاد شد.', '', NotiConfig.notifyConfig);
                    this.edit.emit(true);
                    this.restForm();
                    if (type !== 'createAndNew') {
                        this.cancel();
                    }
                }
                console.log(dto);
            }, error => {
                this.loadingAction = false;
            });

        } else {
            const updateDto = new ScheduleDto.Update();
            updateDto.id = this.entityId;
            updateDto.assetId = dto.assetList[0].assetId;
            updateDto.mainSubSystemId = dto.assetList[0].mainSubSystemId;
            updateDto.minorSubSystem = dto.assetList[0].minorSubSystem;
            updateDto.activityId = dto.assetList[0].activityId;
            updateDto.startDate = dto.startDate;
            updateDto.endDate = dto.endDate;
            updateDto.activityTypeId = dto.activityTypeId;
            updateDto.workCategoryId = dto.workCategoryId;
            updateDto.importanceDegreeId = dto.importanceDegreeId;
            updateDto.estimateCompletionDate = dto.estimateCompletionDate;
            updateDto.activityTime = dto.activityTime;
            updateDto.solution = dto.solution;
            updateDto.userIdList = dto.userIdList;
            updateDto.usedPartList = dto.usedPartList;
            updateDto.frequency = dto.frequency;
            updateDto.per = dto.per;
            updateDto.assetStatus = dto.assetStatus;
            updateDto.runStatus = dto.runStatus;
            updateDto.mode = dto.mode;
            updateDto.nexDate = this.nexDate;


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
        }


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
            // disableBeforeToday: true
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
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
                disableBeforeDate: tomorrow

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
                disableBeforeDate: tomorrow

            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputStartDate = val;
                    console.log(val);
                });

        }, 50);
    }

    keydownEveryNumber(event: any) {
        if (event.key === 'ArrowUp') {
            this.everyNumber++;
        } else if (event.key === 'ArrowDown') {
            if (this.everyNumber > 0) {
                this.everyNumber--;
            }
        }
    }

    public ngAfterViewInit(): void {
        this.setDateJquery();
    }

//// دستگاهها
    changeAssetIdList(event: AssetDto.CreateAsset) {
        console.log(event);
        this.htmlForm.controls.minorPart.reset();
        this.htmlForm.controls.minorPart.disable();
        if (event) {
            this.getMajorPartList(event.id);
            this.getListActivityByAssetId(event.id);
        } else {
            this.majorPartList = [];
            this.activityList = [];
            this.htmlForm.controls.majorPart.reset();
            this.htmlForm.controls.majorPart.disable();
            this.htmlForm.controls.activityId.reset();
            this.htmlForm.controls.activityId.disable();
            this.htmlForm.controls.minorPart.disable();
            this.htmlForm.controls.minorPart.reset();
        }

    }

    getMajorPartList(parentId) {
        this.loadingMajorPart = true;
        this.majorPartList = [];
        this.htmlForm.controls.majorPart.reset();
        this.assetService.getAllAssetByParentId({parentId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.CreateAsset[]) => {
            this.loadingMajorPart = false;

            if (!isNullOrUndefined(res)) {
                this.htmlForm.controls.majorPart.enable();
                this.majorPartList = res;
                this.majorPartList = this.majorPartList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);

            }
        }, error => {
            this.loadingMajorPart = false;
        });
    }

    changeMajorPartList(event: AssetDto.CreateAsset) {
        this.htmlForm.controls.minorPart.reset();
        console.log(event);
        if (event) {
            this.htmlForm.controls.minorPart.enable();
        } else {
            this.htmlForm.controls.minorPart.disable();
            this.htmlForm.controls.minorPart.reset();

        }
    }

    deleteSelectedAsset(asset: SelectedAsset, index) {
        if (this.selectedAssetList.some(p => p.id === asset.id)) {
            this.selectedAssetList.splice(index, 1);
            this.htmlForm.patchValue({
                assetIdList: this.selectedAssetList.map(e => e.id),
            });
        }
    }

    addAsset() {
        if (this.actionMode === ActionMode.EDIT) {
            if (this.selectedAssetList.length > 0) {
                DefaultNotify.notifyDanger('در حالت ویرایش فقط یک دستگاه میتوان اضافه کرد.', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (this.htmlForm.controls.assetId.value) {
            if (this.htmlForm.controls.activityId.value) {

                const newAsset = new SelectedAsset();
                newAsset.id = this.htmlForm.controls.assetId.value;
                newAsset.selectedActivity.id = this.htmlForm.controls.activityId.value;
                newAsset.selectedActivity.title = this.activityList.find(a => a.id === newAsset.selectedActivity.id).title;

                newAsset.title = this.assetList.find(a => a.id === newAsset.id).name;
                if (this.htmlForm.controls.majorPart.value) {
                    newAsset.selectedMajorPart.id = this.htmlForm.controls.majorPart.value;
                    newAsset.selectedMajorPart.title = this.majorPartList.find(a => a.id === newAsset.selectedMajorPart.id).name;
                }
                if (this.htmlForm.controls.minorPart.value) {
                    newAsset.selectedMinorPart = this.htmlForm.controls.minorPart.value;
                }
                if (!this.selectedAssetList.some(a => JSON.stringify(a) === JSON.stringify(newAsset))) {
                    this.selectedAssetList.push(newAsset);
                } else {
                    DefaultNotify.notifyDanger('دستگاهی با این مشخصات قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);

                }
            } else {
                DefaultNotify.notifyDanger('فرآیند  انتخاب شود.', '', NotiConfig.notifyConfig);
                return;
            }
        } else {
            DefaultNotify.notifyDanger('دستگاه  انتخاب شود.', '', NotiConfig.notifyConfig);
            return;
        }

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
