import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2, EnumHandle} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {ScheduleMaintenanceDto} from '../../../model/dto/scheduleMaintenanceDto';
import {UnitOfMeasurement} from '../../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {ScheduleMaintenanceService} from '../../../endpoint/schedule-maintenance.service';
import {UnitOfMeasurementService} from '../../../../basicInformation/unitOfMeasurement/endpoint/unit-of-measurement.service';
// import {EnumHandle} from '../../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import ScheduleType = ScheduleMaintenanceDto.ScheduleType;
import TimeType = ScheduleMaintenanceDto.TimeType;
import FixType = ScheduleMaintenanceDto.FixType;
import {WorkOrderStatusEnum} from '../../../../basicInformation/workOrderStatus/model/helper/workOrderStatusEnum';
import {isNullOrUndefined} from 'util';
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-time-modal',
    templateUrl: './time-modal.component.html',
    styleUrls: ['./time-modal.component.scss']
})
export class TimeModalComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() mode: ActionMode;
    @Input() modeView: ActionMode;
    @Input() scheduleMaintenanceId: string;
    @Input() receiveItemForEdit = new ScheduleMaintenanceDto.ScheduledTime();
    @Output() sendScheduleWithTime = new EventEmitter<ScheduleMaintenanceDto.ScheduledTime>();
    @Output() changeViewTimeModal = new EventEmitter<boolean>();

    MyModalSize = ModalSize;
    actionMode = ActionMode;


    myMoment = Moment;
    myPattern = MyPattern;
    scheduleType = ScheduleType;

    scheduleWithTime = new ScheduleMaintenanceDto.ScheduledTime();
    scheduleWithTimeCopy = new ScheduleMaintenanceDto.ScheduledTime();
    doSave = false;
    startOn;

    unitOfMeasurementList: UnitOfMeasurement[] = [];
    scheduleTypeList: any[] = [];
    timeTypeList: any[] = [];
    fixTypeList: any[] = [];
    startOnForNgModel = null;
    endOnForNgModel = null;

    constructor(public scheduleMaintenanceService: ScheduleMaintenanceService,
                public unitOfMeasurementService: UnitOfMeasurementService) {
        this.timeTypeList = EnumHandle.getAsValueTitleList(TimeType);
        this.scheduleTypeList = EnumHandle.getAsValueTitleList(ScheduleType);
        this.fixTypeList = EnumHandle.getAsValueTitleList(FixType);
        // this.scheduleTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<ScheduleType>(ScheduleType));
        // this.timeTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TimeType>(TimeType));
        // this.fixTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<FixType>(FixType));
    }

    ngOnInit() {
        // this.getUnitOfMeasurementList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.modeView === this.actionMode.VIEW) {
            $('input').attr('disabled', 'disabled');
            $('select').attr('disabled', 'disabled');
        }
        if (!isNullOrUndefined(changes.receiveItemForEdit.currentValue.lastModify)) {
            if (this.mode === ActionMode.EDIT) {
                this.scheduleWithTime = JSON.parse(JSON.stringify(this.receiveItemForEdit));
                this.scheduleWithTimeCopy = JSON.parse(JSON.stringify(this.scheduleWithTime));
                if (!isNullOrUndefined(this.scheduleWithTime.startOn)) {
                    $('#startOn').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                    (new Date(this.scheduleWithTime.startOn).toISOString()))).trigger('change');
                }
                if (!isNullOrUndefined(this.scheduleWithTime.endOn)) {
                    $('#endOn').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate
                    (new Date(this.scheduleWithTime.endOn).toISOString()))).trigger('change');
                }
            }
        }
    }


    getUnitOfMeasurementList() {
        this.unitOfMeasurementService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: UnitOfMeasurement[]) => {
                if (res && res.length) {
                    this.unitOfMeasurementList = res;
                }
            });
    }

    ngAfterViewInit(): void {
        const mthis = this;
        $('#startOn').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#startOn'),
        }).on('change', (e) => {
            mthis.scheduleWithTime.startOn =
                mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
            mthis.startOnForNgModel = $(e.currentTarget).val();
            mthis.checkDates();

        });
        $('#endOn').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#endOn'),
        }).on('change', (e) => {
            mthis.scheduleWithTime.endOn =
                mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
            mthis.endOnForNgModel = $(e.currentTarget).val();

            mthis.checkDates();
        });
    }


    checkDates() {
        if (!isNullOrUndefined(this.scheduleWithTime.startOn) && !isNullOrUndefined(this.scheduleWithTime.endOn)) {
            if (this.scheduleWithTime.endOn < this.scheduleWithTime.startOn) {
                DefaultNotify.notifyDanger('پایان در تاریخ  نباید قبل از شروع در تاریخ باشد.', '', NotiConfig.notifyConfig);
                return false;
            }
        }
        return true;
    }

    ngOnDestroy(): void {
    }

    loadingAction = false;

    action(scheduleWithTimeForm) {
        if (this.loadingAction) {
            return;
        }
        if (!this.checkDates()) {
            return;
        }
        this.doSave = true;
        if (scheduleWithTimeForm.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.scheduleWithTime.startOn) {
            DefaultNotify.notifyDanger('شروع در تاریخ را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.scheduleWithTime.endOn) {
            DefaultNotify.notifyDanger('پایان در تاریخ را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.scheduleWithTime) === JSON.stringify(this.scheduleWithTimeCopy)) {
            DefaultNotify.notifyDanger('شما تغییری ایجاد نکرده اید', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.scheduleWithTime.per) {
            this.scheduleWithTime.per = Toolkit2.Common.Fa2En(this.scheduleWithTime.per);
        }

        this.loadingAction = true;
        this.scheduleMaintenanceService.updateScheduleTime(this.scheduleWithTime,
            {scheduleMaintenanceId: this.scheduleMaintenanceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAction = false;


            if (res) {
                this.scheduleWithTime.endOn = res.scheduleWithTimeAndMetering.scheduledTime.endOn;
                this.scheduleWithTime.startOn = res.scheduleWithTimeAndMetering.scheduledTime.startOn;
                this.scheduleWithTime.lastModify = res.scheduleWithTimeAndMetering.scheduledTime.lastModify;
                // this.scheduleWithTimeCopy = JSON.parse(JSON.stringify(this.scheduleWithTime));
                DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                this.sendScheduleWithTime.emit(this.scheduleWithTime);
                this.cancelModal();
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAction = false;
        });
    }

    // changeScheduleType(event) {
    //   this.scheduleWithTime.scheduleType = event;
    // }

    changePer() {
        this.scheduleWithTime.per = Toolkit2.Common.Fa2En(this.scheduleWithTime.per);
    }

    // changePerMetering() {
    //   this.scheduleWithTime.meteringCycle.per = Toolkit2.Common.Fa2En(this.scheduleWithTime.meteringCycle.per);
    // }
    //
    // changeStartOn() {
    //   this.scheduleWithTime.meteringCycle.startDistance =
    //     Toolkit2.Common.Fa2En(this.scheduleWithTime.meteringCycle.startDistance);
    // }

    // changeEndOn() {
    //   this.scheduleWithTime.meteringCycle.endDistance =
    //     Toolkit2.Common.Fa2En(this.scheduleWithTime.meteringCycle.endDistance);
    //   if (this.scheduleWithTime.meteringCycle.startDistance > this.scheduleWithTime.meteringCycle.endDistance) {
    //     DefaultNotify.notifyDanger('مقدار پایانی دوره باید بیشتر از مقدار شروع باشد.');
    //   }
    // }

    cancelModal() {
        ModalUtil.hideModal('timeModal');
        this.changeViewTimeModal.emit(false);
    }


}
