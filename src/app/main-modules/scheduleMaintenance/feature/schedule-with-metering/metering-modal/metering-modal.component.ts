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
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {ScheduleMaintenanceDto} from '../../../model/dto/scheduleMaintenanceDto';
import {UnitOfMeasurement} from '../../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {EnumObject} from '../../../../../_base/utility/enum/enum-object';
import {ScheduleMaintenanceService} from '../../../endpoint/schedule-maintenance.service';
import {UnitOfMeasurementService} from '../../../../basicInformation/unitOfMeasurement/endpoint/unit-of-measurement.service';
import {EnumHandle} from '../../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import ScheduleType = ScheduleMaintenanceDto.ScheduleType;
import TimeType = ScheduleMaintenanceDto.TimeType;
import FixType = ScheduleMaintenanceDto.FixType;
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-metering-modal',
    templateUrl: './metering-modal.component.html',
    styleUrls: ['./metering-modal.component.scss']
})
export class MeteringModalComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() againGetSWTAMBSMI;
    @Input() modeView;
    @Input() scheduleMaintenanceId: string;
    @Input() mode: ActionMode;
    @Input() unitOfMeasurementList: UnitOfMeasurement[];
    @Input() receiveItemForEdit: ScheduleMaintenanceDto.ScheduledMeteringCycleDTO;
    @Output() sendScheduleWithTimeAndMetering = new EventEmitter<ScheduleMaintenanceDto.ScheduledMeteringCycle>();
    @Output() changeViewMeteringModal = new EventEmitter<boolean>();
    myMoment = Moment;
    myPattern = MyPattern;
    scheduleType = ScheduleType;
    MyModalSize = ModalSize;
    actionMode = ActionMode;
    disabledButton = false;

    scheduleMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycle();
    scheduleMeteringCopy = new ScheduleMaintenanceDto.ScheduledMeteringCycle();
    doSave = false;

    scheduleTypeList = [] as EnumObject[];
    timeTypeList = [] as EnumObject[];
    fixTypeList = [] as EnumObject[];

    constructor(public scheduleMaintenanceService: ScheduleMaintenanceService,
                public unitOfMeasurementService: UnitOfMeasurementService) {
        this.scheduleTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<ScheduleType>(ScheduleType));
        this.timeTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TimeType>(TimeType));
        this.fixTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<FixType>(FixType));
    }

    ngOnInit() {

        // this.scheduleMetering.meteringCycle = new ScheduleMaintenanceDto.ScheduleWithTimeAndMetering().meteringCycle;
        // this.getScheduleWithTimeAndMeteringByScheduleMaintenanceId();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.modeView === ActionMode.VIEW) {
            $('input').attr('disabled', 'disabled');
            $('select').attr('disabled', 'disabled');
            $('textarea').attr('disabled', 'disabled');
        }
        if (this.mode === ActionMode.EDIT) {
            this.receiveItem();
        }
    }

    receiveItem() {
        this.scheduleMetering = JSON.parse(JSON.stringify(this.receiveItemForEdit));
    }


    ngAfterViewInit(): void {
        // const mthis = this;
        // $('#startOn').azPersianDateTimePicker({
        //   Placement: 'left', // default is 'bottom'
        //   Trigger: 'focus', // default is 'focus',
        //   enableTimePicker: false, // default is true,
        //   TargetSelector: '', // default is empty,
        //   GroupId: '', // default is empty,
        //   ToDate: false, // default is false,
        //   FromDate: false, // default is false,
        //   targetTextSelector: $('#startOn'),
        // }).on('change', (e) => {
        //   mthis.scheduleMetering.scheduledTime.startOn =
        //     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        // });
        // $('#endOn').azPersianDateTimePicker({
        //   Placement: 'left', // default is 'bottom'
        //   Trigger: 'focus', // default is 'focus',
        //   enableTimePicker: false, // default is true,
        //   TargetSelector: '', // default is empty,
        //   GroupId: '', // default is empty,
        //   ToDate: false, // default is false,
        //   FromDate: false, // default is false,
        //   targetTextSelector: $('#endOn'),
        // }).on('change', (e) => {
        //   mthis.scheduleMetering.scheduledTime.endOn =
        //     mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
        // });
    }

    ngOnDestroy(): void {
    }

    loadingAction = false;

    action(scheduleMeteringForm) {
        this.doSave = true;
        if (scheduleMeteringForm.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.scheduleMetering.startDistance > this.scheduleMetering.endDistance) {
            DefaultNotify.notifyDanger('مقدار پایانی دوره باید بیشتر یا مساوی مقدار شروع باشد.', '', NotiConfig.notifyConfig);
            return;
        }

        if (this.scheduleMetering.per > (this.scheduleMetering.endDistance - this.scheduleMetering.startDistance)) {
            DefaultNotify.notifyDanger('مدت دوره زمانی نباید بیشتر از اختلاف  مقدار پایانی و مقدار شروع  باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        // this.scheduleMetering.scheduleType = null;
        this.disabledButton = true;
        this.loadingAction = true;

        this.scheduleMaintenanceService.updateScheduleMetering(this.scheduleMetering,
            {scheduleMaintenanceId: this.scheduleMaintenanceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            this.loadingAction = false;

            this.disabledButton = false;
            if (res) {
                this.scheduleMetering.registrationDate = res.scheduleWithTimeAndMetering.meteringCycle.registrationDate;
                DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                this.scheduleMetering.unitOfMeasurementName = this.unitOfMeasurementList.find(u => u.id === this.scheduleMetering.unitOfMeasurementId).title
                this.sendScheduleWithTimeAndMetering.emit(this.scheduleMetering);
                ModalUtil.hideModal('MeteringSModal');
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAction = false;
            this.disabledButton = false;

        });
        // ===============
    }

    // changeScheduleType(event) {
    //   this.scheduleMetering.scheduleType = event;
    // }
    //
    // changePer() {
    //   this.scheduleMetering.scheduledTime.per = Toolkit2.Common.Fa2En(this.scheduleMetering.scheduledTime.per);
    // }

    changePerMetering() {
        this.scheduleMetering.per = Toolkit2.Common.Fa2En(this.scheduleMetering.per);
    }

    changeStartOn() {
        this.scheduleMetering.startDistance
            = Toolkit2.Common.Fa2En(this.scheduleMetering.startDistance);
    }

    changeEndOn() {
        this.scheduleMetering.endDistance
            = Toolkit2.Common.Fa2En(this.scheduleMetering.endDistance);
        if (this.scheduleMetering.startDistance > this.scheduleMetering.endDistance) {
            DefaultNotify.notifyDanger('مقدار پایانی دوره کارکرد باید بیشتر از مقدار شروع باشد.', '', NotiConfig.notifyConfig);
        }
    }

    cancelModal() {
        this.changeViewMeteringModal.emit(true);
        ModalUtil.hideModal('MeteringSModal');
        this.scheduleMetering = new ScheduleMaintenanceDto.ScheduledMeteringCycle();
    }


}
