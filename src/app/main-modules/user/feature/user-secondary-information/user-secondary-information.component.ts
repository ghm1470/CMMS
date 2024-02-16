import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserDto} from '../../model/dto/user-dto';
import {UserService} from '../../endpoint/user.service';
import {UserType} from '../../../securityManagement/model/userType';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {ActivatedRoute} from '@angular/router';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-user-secondary-information',
    templateUrl: './user-secondary-information.component.html',
    styleUrls: ['./user-secondary-information.component.scss']
})
export class UserSecondaryInformationComponent implements OnInit, AfterViewInit, OnDestroy {
    myMoment = Moment;
    userTypeList: UserType[] = [];
    myPattern = MyPattern;

    userSecondaryInformation = new UserDto.UserSecondaryInformation();
    userSecondaryInformationCopy = new UserDto.UserSecondaryInformation();
    userCopy = new UserDto.UserSecondaryInformation();
    @Input() userId = '';
    @Input() mode: ActionMode;
    actionMode = ActionMode;
    disabledButton = false;
    birthDayChecker = false;
    dateViewMode = DateViewMode;

    constructor(private userService: UserService,
                private userTypeService: UserTypeService,
                private activatedRoute: ActivatedRoute) {
        // this.userId = this.activatedRoute.snapshot.queryParams.userId;
        // this.userSecondaryInformation.organId = '-1';

        this.userSecondaryInformation.userTypeId = '-1';

    }

    ngOnInit() {
        this.getAllUserType();
        this.getOneSecondaryInformation();

    }

    ngOnDestroy(): void {
        // this.userSecondaryInformation.userContact = new UserDto.Contact();
    }

    ngAfterViewInit(): void {
        const mthis = this;
        $('#birthDay').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#birthDay'),
            disableAfterToday: true
        }).on('change', (e) => {
            try {
                mthis.birthDayChecker = false;
                mthis.userSecondaryInformation.birthDay =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                if (!isNullOrUndefined(mthis.userSecondaryInformation.birthDay) && !
                    isNullOrUndefined(mthis.userSecondaryInformation.startWork)) {
                    if (mthis.userSecondaryInformation.startWork < mthis.userSecondaryInformation.birthDay) {
                        mthis.birthDayChecker = true;
                        DefaultNotify.notifyDanger('تاریخ تولد نمیتواند بعد از تاریخ شروع به کار باشد.', '', NotiConfig.notifyConfig);
                    }
                }
                // $('#birthDay').val('');
                // $('#startWork').val('');
                // this.startWorkCheck();
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
        });
        $('#startWork').azPersianDateTimePicker({
            Placement: 'left', // default is 'bottom'
            Trigger: 'focus', // default is 'focus',
            enableTimePicker: false, // default is true,
            TargetSelector: '', // default is empty,
            GroupId: '', // default is empty,
            ToDate: false, // default is false,
            FromDate: false, // default is false,
            targetTextSelector: $('#startWork'),
            disableAfterToday: true
        }).on('change', (e) => {
            try {
                mthis.birthDayChecker = false;
                mthis.userSecondaryInformation.startWork =
                    mthis.myMoment.convertJaliliToIsoDate($(e.currentTarget).val());
                if (!isNullOrUndefined(mthis.userSecondaryInformation.birthDay) && !
                    isNullOrUndefined(mthis.userSecondaryInformation.startWork)) {
                    if (mthis.userSecondaryInformation.startWork < mthis.userSecondaryInformation.birthDay) {
                        mthis.birthDayChecker = true;
                        DefaultNotify.notifyDanger('تاریخ تولد نمیتواند بعد از تاریخ شروع به کار باشد.', '', NotiConfig.notifyConfig);
                        // $('#birthDay').val('');
                        // $('#startWork').val('');
                        // this.startWorkCheck();
                    }
                }
            } catch (e) {
                DefaultNotify.notifyDanger('تاریخ وارد شده صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            }
            this.startWorkCheck();
        });
    }


    ///////////// GetAll UserType /////////////
    getAllUserType() {
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (!isNullOrUndefined(res)) {
                this.userTypeList = res;
            }
        });
    }

    loadingAction = false;

    action(form) {
        if (this.loadingAction) {
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.userSecondaryInformationCopy) === JSON.stringify(this.userSecondaryInformation)) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است .', '', NotiConfig.notifyConfig);
            return;
        }
        // if (!this.userSecondaryInformation.startWork) {
        //   DefaultNotify.notifyDanger('تاریخ شروع به کار را بررسی کنید.');
        //   return;
        // }
        if (this.userSecondaryInformation.startWork && this.userSecondaryInformation.birthDay) {
            if (this.userSecondaryInformation.startWork < this.userSecondaryInformation.birthDay) {
                DefaultNotify.notifyDanger('تاریخ تولد نمیتواند بعد از تاریخ شروع به کار باشد.', '', NotiConfig.notifyConfig);
                return;
            }
        }
        this.loadingAction = true;
        this.userService.updateSecondaryInformationOfUser(this.userSecondaryInformation, {id: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            this.loadingAction = false;
            if (res) {
                this.userSecondaryInformationCopy = JSON.parse(JSON.stringify(this.userSecondaryInformation));
                DefaultNotify.notifySuccess('با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            }
        },error => {
            this.loadingAction = false;
        });
    }


    //////// GetOne Main Information ////////////////
    getOneSecondaryInformation() {
        this.userService.getOneSecondaryInformationOfUser({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: UserDto.UserSecondaryInformation) => {
            if (res) {
                this.userSecondaryInformation = res;
                this.userSecondaryInformationCopy = JSON.parse(JSON.stringify(this.userSecondaryInformation));
                if (!res.userContact) {
                    this.userSecondaryInformation.userContact = new UserDto.Contact();
                }
                this.userCopy = JSON.parse(JSON.stringify(res));
                if (!isNullOrUndefined(this.userSecondaryInformation.birthDay)) {
                    $('#birthDay').val(this.myMoment.convertIsoToJDate(new Date(this.userSecondaryInformation.birthDay).toISOString())).trigger('change');
                }
                if (!isNullOrUndefined(this.userSecondaryInformation.startWork)) {
                    $('#startWork').val(Toolkit2.Common.En2Fa(this.myMoment.convertIsoToJDate(new Date(this.userSecondaryInformation.startWork).toISOString()))).trigger('change');
                }
            }
        });
    }

    // changeUserType() {
    //   if (this.userSecondaryInformation.userTypeId !== '-1') {
    //     this.userSecondaryInformation.userType = this.userTypeList.find(userType => userType.id === this.userSecondaryInformation.userTypeId);
    //   }
    // }


    startWorkCheck() {
        if (isNullOrUndefined(this.userSecondaryInformation.startWork)) {
            $('#startWork').addClass('is-invalid');
        }
        if (!isNullOrUndefined(this.userSecondaryInformation.startWork)) {
            $('#startWork').removeClass('is-invalid');
        }
    }
}
