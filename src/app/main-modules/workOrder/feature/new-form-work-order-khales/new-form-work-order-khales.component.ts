import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from '../../../user/endpoint/user.service';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDto} from '../../../user/model/dto/user-dto';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {PartWithUsageCount} from '../part-with-usage-count/model/PartWithUsageCount';
import {PartDto} from '../../../part/model/dto/part';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import GetOneUsedPart = WorkOrderDto.GetOneUsedPart;
import UsedPart = WorkOrderDto.UsedPart;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {WorkRequestService} from "../../../submitWorkRequest/endpoint/work-request.service";

declare var $: any;

@Component({
    selector: 'app-new-form-work-order-khales',
    templateUrl: './new-form-work-order-khales.component.html',
    styleUrls: ['./new-form-work-order-khales.component.scss']
})
export class NewFormWorkOrderKhalesComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private userService: UserService,
                public workOrderService: WorkOrderService,
                public router: Router,
    ) {

    }

    @Input() workOrderId: string;
    @Input() mode: string;
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

    ///// تایید این مرحله///
/////////////// قطعات
    actionMode = ActionMode;
    loadingGetOne = true;

/////////////// قطعات!!!
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
    }

    loadingGetUsers = false;

    getUserWithUserType() {
        this.loadingGetUsers = true;

        this.userService.getUserWithUserType().subscribe((res: UserDto.GetUserWithUserType[]) => {
            if (res) {
                this.userList = res;
                for (const user of this.userList) {
                    user.nameForShow = user.name + ' ' + user.family + ' - ' + user.userTypeName;
                    // this.htmlForm.addControl(user.id,)
                    this.htmlForm.addControl(user.id, new FormControl(null, Validators.required));

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
            inputRepairDate: new FormControl(), //  تاریخ و ساعت  شروع تعمیر
            requestDescription: new FormControl(), //  شرح درخواست خرابی
            failureReason: new FormControl(), //  علت خرابی
            solution: new FormControl(), // شرح اقدامات انجام شده
            endDate: new FormControl(), //  تاریخ و ساعت  راه اندازی
            userIdList: new FormControl(), //  افراد تعمیر کننده
            hour: new FormControl(), //  ساعت تامین قطعه
            minute: new FormControl(), //  دقیقه تامین قطعه
        });
        this.htmlForm.controls.assetName.disable();
        if (this.mode === 'VIEW') {
            this.htmlForm.disable();
        }

    }

    patchValue() {
        setTimeout(() => {
            if (!isNullOrUndefined(this.workOrderDto.startDate)) {
                const jStartDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                (new Date(this.workOrderDto.startDate).toISOString()));
                $('#inputDateStart').val(jStartDate).trigger('change');

            }
            if (!isNullOrUndefined(this.workOrderDto.repairDate)) {
                const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                (new Date(this.workOrderDto.repairDate).toISOString()));
                $('#inputRepairDate').val(jEndDate).trigger('change');
            }
            if (!isNullOrUndefined(this.workOrderDto.endDate)) {
                const jEndDate = Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDateWithTime
                (new Date(this.workOrderDto.endDate).toISOString()));
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
                minute,
            });
        }, 100);

    }

    backEmit() {
        this.back.emit(true);
    }

    setDateJquery() {
        // targetTextSelector: $('#inputDateVisible'),
        //     targetDateSelector: $('#inputDateHidden'),
        // rangeSelector: true, // defau lt is falseبازه زمانی  ,
        setTimeout(t => {

            if (this.workOrderDto.startDate) {
                $('#inputDateStart').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    isGregorian: false, // default is false,
                    targetTextSelector: $('#inputDateStart'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                    selectedDate: new Date(this.workOrderDto.startDate)// تاریخ انتخاب شده

                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputDateStart = val;
                });
            } else {
                $('#inputDateStart').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    isGregorian: false, // default is false,
                    targetTextSelector: $('#inputDateStart'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputDateStart = val;
                });
            }
            if (this.workOrderDto.repairDate) {

                $('#inputRepairDate').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputRepairDate'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                    selectedDate: new Date(this.workOrderDto.repairDate)

                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputRepairDate = val;
                });
                setTimeout(e => {
                    this.patchValue();
                }, 10);

            } else {
                $('#inputRepairDate').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputRepairDate'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputRepairDate = val;
                });
                setTimeout(e => {
                    this.patchValue();
                }, 10);
            }
            if (this.workOrderDto.endDate) {

                $('#inputDateEnd').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputDateEnd'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                    selectedDate: new Date(this.workOrderDto.endDate)

                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputDateEnd = val;
                });
                setTimeout(e => {
                    this.patchValue();
                }, 10);

            } else {
                $('#inputDateEnd').azPersianDateTimePicker({
                    Placement: 'bottom', // default is 'bottom'
                    Trigger: 'click', // default is 'focus',
                    enableTimePicker: true, // default is true,
                    TargetSelector: '', // default is empty,
                    GroupId: '', // default is empty,
                    ToDate: false, // default is false,
                    FromDate: false, // default is false,
                    targetTextSelector: $('#inputDateEnd'),
                    textFormat: 'yyyy/MM/dd  -  HH:mm',
                }).on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputDateEnd = val;
                });
                setTimeout(e => {
                    this.patchValue();
                }, 10);
            }


        }, 50);

    }

    onSubmit() {
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
        if (this.inputDateStart && this.inputDateEnd) {
            if (this.inputDateStart > this.inputDateEnd) {
                DefaultNotify.notifyDanger('تاریخ وساعت وقوع خرابی باید قبل از  تاریخ و ساعت راه اندازی  باشد. ', '', NotiConfig.notifyConfig);
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

        const newSaveDTO = new WorkOrderDto.NewSaveDTO();
        if (this.workOrderDto) {
            newSaveDTO.id = this.workOrderDto.id;
            newSaveDTO.assetId = this.workOrderDto.assetId;
        }
        newSaveDTO.requestDescription = this.htmlForm.controls.requestDescription.value;
        newSaveDTO.pmSheetCode = this.workOrderDto.pmSheetCode;
        newSaveDTO.number = this.workOrderDto.number;
        newSaveDTO.failureReason = this.htmlForm.controls.failureReason.value;
        newSaveDTO.solution = this.htmlForm.controls.solution.value;
        newSaveDTO.userIdList = this.htmlForm.controls.userIdList.value;
        newSaveDTO.partSupply = +this.htmlForm.controls.minute.value + (+this.htmlForm.controls.hour.value * 60);
        newSaveDTO.usedPartList = [];
        if (!newSaveDTO.pmSheetCode) {
            DefaultNotify.notifyDanger('شماره برگه em وارد شود .', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.workOrderDto.getOneUsedPartList.length > 0) {
            if (this.workOrderDto.getOneUsedPartList.find(p => isNullOrUndefined(p.usedNumber))) {
                DefaultNotify.notifyDanger('تعداد قطعات استفاده شده به درستی وارد شود. ', '', NotiConfig.notifyConfig);
                return;
            }
            newSaveDTO.usedPartList = this.workOrderDto.getOneUsedPartList;
        }


        if (this.inputDateStart) {
            newSaveDTO.startDate = this.myMoment.convertJaliliToIsoDateWithTime(this.inputDateStart);
        }
        if (this.inputDateEnd) {
            newSaveDTO.endDate = this.myMoment.convertJaliliToIsoDateWithTime(this.inputDateEnd);
        }
        if (this.inputRepairDate) {
            newSaveDTO.repairDate = this.myMoment.convertJaliliToIsoDateWithTime(
                this.inputRepairDate
            );
        }

        this.loadingSubmit = true;
        // چک کردن تکراری بودن برگه EM
        // this.workOrderService.checkWorkOrderPmCode(
        //     {pmCode: newSaveDTO.number}).subscribe((resCheck: boolean) => {
        //     if (resCheck) {
        //         this.loadingSubmit = false;
        //         DefaultNotify.notifyDanger('شماره برگه  em وارد شده تکراری است .', '', NotiConfig.notifyConfig);
        //         return;
        //     } else {
        this.workOrderService.newUpdate(newSaveDTO).subscribe((res: any) => {
            this.loadingSubmit = false;
            if (res) {
                // this.router.navigateByUrl('/panel/workOrder?page=0&size=10');
                this.backEmit();
                DefaultNotify.notifySuccess('ویرایش انجام شد.', '', NotiConfig.notifyConfig);
            } else {
                DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);

            }
        }, error => {
            this.loadingSubmit = false;
        });
        //     }
        // }, error => {
        //     this.loadingSubmit = false;
        // });

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

    setMin(type) {
        if (this.mode === 'VIEW') {
            return;
        }
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
        if (this.mode === 'VIEW') {
            return;
        }
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
}
