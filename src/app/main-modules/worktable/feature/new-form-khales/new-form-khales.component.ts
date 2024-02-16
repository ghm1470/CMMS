import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {UserService} from '../../../user/endpoint/user.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {Router} from '@angular/router';
import {ActivityService} from '../../../activity/service/activity.service';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from "../../../part/model/dto/part";
import GetOneUsedPart = WorkOrderDto.GetOneUsedPart;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {RequestType} from "../list/worktable-list.component";

declare var $: any;

@Component({
    selector: 'app-new-form-khales',
    templateUrl: './new-form-khales.component.html',
    styleUrls: ['./new-form-khales.component.scss'],
})
export class NewFormKhalesComponent
    implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private userService: UserService,
        public workOrderService: WorkOrderService,
        private activityService: ActivityService,
        public router: Router
    ) {
    }

    @Input() workOrderId: string;
    @Input() activityLevelId: string;
    @Input() activityInstanceId: string;
    @Input() selectedRequestType: RequestType;
    @Input() workRequestAcceptor: boolean;
    @Output() back = new EventEmitter<any>();

    htmlForm: FormGroup;
    userList: UserDto.GetUserWithUserType[] = [];

    inputDateStart: any;
    inputDateEnd: any;
    inputRepairDate: any;
    myMoment = Moment;
    workOrderDto: WorkOrderDto.NewGetOneٔWorkOrderDTO;
    loadingSubmit = false;

    // // رد مرحله بدون ذخیره فرم
    loadingReject = false;

    workOrderAccepted = false;
/////////////// قطعات
    actionMode = ActionMode;
    loadingGetOne = true;
/// زمان تامین قطعه
    /// دقیقه
    minute = 0;

    /// دقیقه!!!

/// ساعت
    hour = 0;

    ngOnInit(): void {
        this.creatForm();
        this.getUserWithUserType();
        this.getOne();
    }

    ngAfterViewInit(): void {
        // this.setDateJquery();
    }

    loadingGetUsers = false;

    getUserWithUserType() {
        this.loadingGetUsers = true;

        this.userService.getUserWithUserType().subscribe((res: UserDto.GetUserWithUserType[]) => {
            if (res) {
                this.userList = res;
                for (const user of this.userList) {
                    user.nameForShow = user.name + ' ' + user.family + ' - ' + user.userTypeName;
                    this.htmlForm.addControl(user.id, new FormControl(null));
                }
                this.loadingGetUsers = false;
            }
        }, error => {
            this.loadingGetUsers = false;
        });
    }

    getOne() {
        this.loadingGetOne = true;

        this.workOrderService.newGetOne({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderDto.NewGetOneٔWorkOrderDTO) => {
            this.loadingGetOne = false;

            if (res) {
                this.workOrderDto = res;
                if (!this.workOrderDto.getOneUsedPartList) {
                    this.workOrderDto.getOneUsedPartList = [];
                }
                this.setDateJquery();

            }
        }, error => {
            this.loadingGetOne = true;
        });
    }

    creatForm() {
        this.htmlForm = new FormGroup({
            assetName: new FormControl(), // نام دستگاه
            pmSheetCode: new FormControl(), // شماره برگه pm
            startDate: new FormControl(), // تاریخ و ساعت وقوع خرابی
            requestDescription: new FormControl(null, Validators.required), //  شرح درخواست خرابی
            failureReason: new FormControl(null, Validators.required), //  علت خرابی
            solution: new FormControl(null, Validators.required), // شرح اقدامات انجام شده
            endDate: new FormControl(), //  تاریخ و ساعت  راه اندازی
            inputRepairDate: new FormControl(), //  تاریخ و ساعت  شروع تعمیر
            userIdList: new FormControl(null, Validators.required), //  افراد تعمیر کننده
            hour: new FormControl(), //  ساعت تامین قطعه
            minute: new FormControl(), //  دقیقه تامین قطعه
        });
        this.htmlForm.controls.assetName.disable();
    }

    patchValue() {
        setTimeout(() => {
            if (!isNullOrUndefined(this.workOrderDto.startDate)) {
                const jStartDate = Toolkit2.Common.En2Fa(
                    this.myMoment.convertIsoToJDateWithTime(
                        new Date(this.workOrderDto.startDate).toISOString()
                    )
                );
                $('#inputDateStart').val(jStartDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrderDto.repairDate)) {
                const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                (new Date(this.workOrderDto.repairDate).toISOString()));
                $('#inputRepairDate').val(jEndDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrderDto.endDate)) {
                const jEndDate = Toolkit2.Common.En2Fa(
                    this.myMoment.convertIsoToJDateWithTime(
                        new Date(this.workOrderDto.endDate).toISOString()
                    )
                );
                $('#inputDateEnd').val(jEndDate).trigger('change');
            }
            let hour = 0;
            let minute = 0;
            if (this.workOrderDto.partSupply) {
                hour = Math.floor(this.workOrderDto.partSupply / 60);
                minute = this.workOrderDto.partSupply % 60;
            }

            let emSheetCode = '00000' + this.workOrderDto.number;
            emSheetCode = emSheetCode.slice(emSheetCode.length - 5);
            this.htmlForm.patchValue({
                assetName: this.workOrderDto.assetName,
                pmSheetCode: emSheetCode,
                requestDescription: this.workOrderDto.requestDescription,
                failureReason: this.workOrderDto.failureReason,
                solution: this.workOrderDto.solution,
                userIdList: this.workOrderDto.userIdList,
                hour,
                minute
            });
        }, 100);
    }

    setDateJquery() {
        setTimeout(t => {

            if (this.workOrderDto.startDate) {
                $('#inputDateStart')
                    .azPersianDateTimePicker({
                        Placement: 'bottom', // default is 'bottom'
                        Trigger: 'click', // default is 'focus',
                        enableTimePicker: true, // default is true,
                        TargetSelector: '', // default is empty,
                        GroupId: '', // default is empty,
                        ToDate: false, // default is false,
                        FromDate: false, // default is false,
                        targetTextSelector: $('#inputDateStart'),
                        textFormat: 'yyyy/MM/dd  -  HH:mm',
                        selectedDate: new Date(this.workOrderDto.startDate),
                    })
                    .on('change', (e) => {
                        const val = $(e.currentTarget).val();
                        this.inputDateStart = val;
                    });
            } else {
                $('#inputDateStart')
                    .azPersianDateTimePicker({
                        Placement: 'bottom', // default is 'bottom'
                        Trigger: 'click', // default is 'focus',
                        enableTimePicker: true, // default is true,
                        TargetSelector: '', // default is empty,
                        GroupId: '', // default is empty,
                        ToDate: false, // default is false,
                        FromDate: false, // default is false,
                        targetTextSelector: $('#inputDateStart'),
                        textFormat: 'yyyy/MM/dd  -  HH:mm',
                    })
                    .on('change', (e) => {
                        const val = $(e.currentTarget).val();
                        this.inputDateStart = val;
                    });
            }
            $('#inputDateEnd')
                .azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputDateEnd'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputDateEnd = val;
                });
            $('#inputRepairDate')
                .azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputRepairDate'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputRepairDate = val;
                });

            setTimeout((e) => {
                this.patchValue();
            }, 100);


        }, 50);
    }

    onSubmit(type) {
        if (type === 'accept') {
            if (!this.inputDateStart) {
                DefaultNotify.notifyDanger(
                    ' تاریخ و ساعت وقوع خرابی وارد شود .', '', NotiConfig.notifyConfig
                );
                return;
            }
            if (!this.inputRepairDate) {
                DefaultNotify.notifyDanger(
                    ' تاریخ و ساعت  شروع تعمیر وارد شود .', '', NotiConfig.notifyConfig
                );
                return;
            }
            if (!this.inputDateEnd) {
                DefaultNotify.notifyDanger(
                    ' تاریخ و ساعت  راه اندازی وارد شود .', '', NotiConfig.notifyConfig
                );
                return;
            }
            if (this.htmlForm.invalid) {
                DefaultNotify.notifyDanger(
                    ' فیلد های اجباری  وارد شود .', '', NotiConfig.notifyConfig
                );
                return;
            }
        } else if (type === 'reject') {
            this.rejectionReason = this.rejectionReason.trim();
            if (!this.rejectionReason) {
                DefaultNotify.notifyDanger(
                    ' علت رد وارد شود .', '', NotiConfig.notifyConfig
                );
                return;
            } else {
                ModalUtil.hideModal('rejectionReasonModal');
            }
        }


        this.loadingSubmit = true;
        this.activityService.checkIfActivityLevelIsPending({
            activityInstanceId: this.activityInstanceId,
            activityLevelId: this.activityLevelId,
        })
            .pipe(takeUntilDestroyed(this))
            .subscribe(
                (res: boolean) => {
                    this.loadingSubmit = false;

                    if (res === true) {
                        this.action(type);
                    } else {
                        DefaultNotify.notifyDanger(
                            ' فرایند توسط شخص دیگری ثبت گردید .', '', NotiConfig.notifyConfig
                        );
                        this.backEmit();
                    }
                },
                (error) => {
                    this.loadingSubmit = false;
                }
            );

    }

    action(type) {

        if (type === 'accept') {

            if (this.inputDateStart && this.inputDateEnd) {
                if (this.inputDateStart > this.inputDateEnd) {
                    DefaultNotify.notifyDanger(
                        'تاریخ وساعت وقوع خرابی باید قبل از  تاریخ و ساعت راه اندازی  باشد. ', '', NotiConfig.notifyConfig
                    );
                    return;
                }
            }


            if (this.inputDateStart && this.inputDateEnd && this.inputRepairDate) {
                if (this.inputRepairDate > this.inputDateEnd) {
                    DefaultNotify.notifyDanger(
                        'تاریخ وساعت شروع تعمیر باید قبل از  تاریخ و ساعت راه اندازی  باشد. ', '', NotiConfig.notifyConfig
                    );
                    return;
                }
                if (this.inputDateStart > this.inputRepairDate) {
                    DefaultNotify.notifyDanger(
                        'تاریخ وساعت شروع تعمیر باید  بعداز تاریخ و ساعت وقوع خرابی   باشد. ', '', NotiConfig.notifyConfig
                    );
                    return;
                }
            }
        }


        const newSaveDTO = new WorkOrderDto.NewSaveDTO();
        if (this.workOrderDto) {
            newSaveDTO.id = this.workOrderDto.id;
            newSaveDTO.assetId = this.workOrderDto.assetId;
        }
        newSaveDTO.requestDescription =
            this.htmlForm.controls.requestDescription.value;
        newSaveDTO.failureReason = this.htmlForm.controls.failureReason.value;
        newSaveDTO.solution = this.htmlForm.controls.solution.value;
        // newSaveDTO.pmSheetCode = this.htmlForm.controls.pmSheetCode.value;
        newSaveDTO.userIdList = this.htmlForm.controls.userIdList.value;
        newSaveDTO.userIdList = this.htmlForm.controls.userIdList.value;
        newSaveDTO.partSupply = +this.htmlForm.controls.minute.value + (+this.htmlForm.controls.hour.value * 60);
        newSaveDTO.usedPartList = [];
        if (type === 'accept') {
            //
            // if (!newSaveDTO.pmSheetCode) {
            //     DefaultNotify.notifyDanger('شماره برگه em وارد شود .', '', NotiConfig.notifyConfig);
            //     return;
            // }
        }
        if (this.workOrderDto.getOneUsedPartList.length > 0) {
            if (this.workOrderDto.getOneUsedPartList.find(p => isNullOrUndefined(p.usedNumber))) {
                DefaultNotify.notifyDanger('تعداد قطعات استفاده شده به درستی وارد شود. ', '', NotiConfig.notifyConfig);
                return;
            }
            newSaveDTO.usedPartList = this.workOrderDto.getOneUsedPartList;
        }
        if (this.inputDateStart) {
            newSaveDTO.startDate = this.myMoment.convertJaliliToIsoDateWithTime(
                this.inputDateStart
            );
        }
        if (this.inputDateEnd) {
            newSaveDTO.endDate = this.myMoment.convertJaliliToIsoDateWithTime(
                this.inputDateEnd
            );
        }
        if (this.inputRepairDate) {
            newSaveDTO.repairDate = this.myMoment.convertJaliliToIsoDateWithTime(
                this.inputRepairDate
            );
        }
        this.loadingSubmit = true;
        // this.changeWorkOrderAcceptorBoolean();
        if (type === 'accept') {
            this.workOrderAcceptedByManager(true);

        } else if (type === 'reject') {
            this.workOrderAcceptedByManager(false);
        }
        this.workOrderService.newUpdate(newSaveDTO).subscribe(
            (res: any) => {
                this.loadingSubmit = false;

                if (type === 'accept') {
                    DefaultNotify.notifySuccess(' با موفقیت ویرایش شد . ', '', NotiConfig.notifyConfig);
                    this.whenUserPushesTheAcceptButtonInConstantForm();
                } else if (type === 'reject') {
                    this.whenUserPushesTheRejectButtonInConstantForm();
                }
                // if (res) {
                //     this.whenUserPushesTheAcceptButtonInConstantForm();
                // } else {
                //     DefaultNotify.notifyDanger('خطا در ثبت.', '', NotiConfig.notifyConfig);
                // }
            },
            (error) => {
                this.loadingSubmit = false;
            }
        );
    }

    ///// تایید این مرحله///

    whenUserPushesTheAcceptButtonInConstantForm() {
        this.loadingSubmit = true;

        this.activityService
            .whenUserPushesTheAcceptButtonInConstantForm({
                activityLevelId: this.activityLevelId,
                instanceId: this.activityInstanceId,
            })
            .pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loadingSubmit = false;

                // this.router.navigateByUrl('/panel/worktable?page=0&size=10');
                this.backEmit();
            }, error => {
                this.loadingSubmit = false;

            });
    }

    ///// رد این مرحله///

    whenUserPushesTheRejectButtonInConstantForm() {
        this.loadingReject = true;
        this.activityService
            .whenUserPushesTheRejectButtonInConstantForm({
                activityLevelId: this.activityLevelId,
                instanceId: this.activityInstanceId,
                rejectionReason: this.rejectionReason,
            })
            .pipe(takeUntilDestroyed(this))
            .subscribe(
                (res: any) => {
                    this.loadingReject = false;

                    if (res) {
                        this.backEmit();
                        ModalUtil.hideModal('rejectStage');
                        // this.router.navigateByUrl('/panel/worktable');
                    }
                },
                (error) => {
                    this.loadingReject = false;
                }
            );
    }

    /// ثبت در گزارشات
    workOrderAcceptedByManager(workOrderAccepted: boolean) {
        // this.workOrderAccepted = true;
        if (this.workRequestAcceptor) {
            this.activityService
                .workOrderAcceptedByManager({
                    activityInstanceId: this.activityInstanceId,
                    workRequestId: this.workOrderDto.workRequestId,
                    workOrderId: this.workOrderId,
                    workOrderAccepted,
                })
                .pipe(takeUntilDestroyed(this))
                .subscribe((res: boolean) => {
                    if (res) {
                        // this.router.navigateByUrl('/panel/worktable?page=0&size=10');
                    }
                });
        }
    }

    backEmit() {
        this.back.emit(true);
        // // this.router.navigateByUrl('/panel/worktable?page=0&size=10');
    }

/////////////// قطعات

    showModalBody = false;

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
        this.workOrderDto.getOneUsedPartList.push(newPart);

    }

    deletePart(part: GetOneUsedPart, index) {
        if (this.workOrderDto.getOneUsedPartList.some(p => p.partId === part.partId)) {
            this.workOrderDto.getOneUsedPartList.splice(index, 1);

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

/////////////// قطعات!!!

    setMin(type) {
        if (type === 'change') {
            if (this.minute > 59 || this.minute < 0) {
                this.minute = 0;
            }
            return;
        } else if (type === 'up') {
            this.minute += +1;
            if (this.minute > 59) {
                this.minute = 0;
            }

        } else if (type === 'down') {
            this.minute -= +1;
            if (this.minute < 0) {
                this.minute = 59;
            }

        }
    }

    keydownMin(event: any) {
        if (event.key === 'ArrowUp') {
            this.setMin('up');
        } else if (event.key === 'ArrowDown') {
            this.setMin('down');
        }
    }

    setHour(type) {
        if (type === 'change') {
            if (this.hour > 23 || this.hour < 0) {
                this.hour = 0;
            }
            return;
        } else if (type === 'up') {
            this.hour += +1;
            if (this.hour > 23) {
                this.hour = 0;
            }

        } else if (type === 'down') {
            this.hour -= +1;
            if (this.hour < 0) {
                this.hour = 23;
            }

        }
    }

    keydownHour(event: any) {
        if (event.key === 'ArrowUp') {
            this.setHour('up');
        } else if (event.key === 'ArrowDown') {
            this.setHour('down');
        }
    }

/// زمان تامین قطعه!!!
    ngOnDestroy(): void {
    }

    //// علت رد کردن
    MyModalSize = ModalSize;
    rejectionReason: string;

    showModalRejectionReason() {
        ModalUtil.showModal('rejectionReasonModal');
    }
}
