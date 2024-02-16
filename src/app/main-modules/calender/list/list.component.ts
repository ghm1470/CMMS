import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Moment} from '../../../shared/tools/date/moment';
import {MeetingDto} from '../model/meeting-dto';
import {managementMeeting} from '../model/management-meeting';
import {CalenderService} from '../endpoint/calender.service';
import {ModalSize, ActionMode, DefaultNotify} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {TokenRoleList} from "../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../shared/constants/cacheKeys";
import {CacheService, CacheType, takeUntilDestroyed} from "@angular-boot/core";
import {NotiConfig} from "../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(public router: Router,
                private cacheService: CacheService,
                private calenderService: CalenderService) {

    }

    roleList = new TokenRoleList();


// yearList: MeetingDto.Year[] = [];
    yearList: number[] = [];
    currentMonth = new MeetingDto.Month();
    currentYear = +Moment.getJDateFromIsoOnlyYear(new Date().toISOString());
    currentDay = +Moment.getJDateFromIsoOnlyDay(new Date().toISOString());
    // currentDay = 1;
    currentDaySessionList = new MeetingDto.SessionDay();

    monthList: MeetingDto.Month[] = MeetingDto.CreateMonthList();
    dayColumn = [1, 2, 3, 4, 5];
    dayRowList = [1, 2, 3, 4, 5, 6, 7];
    monthDayList = [];
    MyMoment = Moment;
    selectedDay: any;
    selectYear = +Moment.getJDateFromIsoOnlyYear(new Date().toISOString());
    selectMonth = new MeetingDto.Month();
    weekMode = true;
    selectedDayForGetOne: string;
    viewMode = 'calender';
    ActionMode = ActionMode;
    selectedItemIdForAction: string;

    loadingPage = false;

    copyCurrentDayIndex = -1;

    selectedWeekIndex: number;
    selectedWeekDayList = [];
    selectedWeekDayListFulDate = [];
    selectedWeekDayListFulDateCurrentDayIndex: number;

    selectedMeetingForDayList: MeetingDto.SessionDay[] = [];

    workOrderDtoForHtmlList = [];
    selectedWorkOrderDtoForHtmlListForOneDayShow: WorkOrderDtoForHtml [];

    userListForShowInModal: UserDto[] = [];
    MyModalSize = ModalSize;
    pWeekList = [
        {index: 0, title: 'شنبه'},
        {index: 1, title: 'یکشنبه'},
        {index: 2, title: 'دوشنبه'},
        {index: 3, title: 'سه‌شنبه'},
        {index: 4, title: 'چهارشنبه'},
        {index: 5, title: 'پنجشنبه'},
        {index: 6, title: 'جمعه'}
    ];

    ngOnInit(): void {

        this.selectMonth.number = +Moment.getJDateFromIsoOnlyMonth(new Date().toISOString());
        this.currentMonth.number = +Moment.getJDateFromIsoOnlyMonth(new Date().toISOString());

        this.setYearList();
        this.changeMonth('OnInit');
        this.getRoleListKey();
        this.setCurrentWeek();
    }

    setCurrentWeek() {
        for (let i = 0; i < this.dayColumn.length; i++) {
            for (let j = 0; j < this.dayRowList.length; j++) {
                if (
                    ((this.monthDayList[this.dayRowList[j] + (this.dayRowList.length * i) - 1] === this.currentDay) &&
                        (this.selectMonth.number === this.currentMonth.number) && (this.selectYear === this.currentYear)) &&
                    (this.dayRowList[j] + (this.dayRowList.length * i) - 1 !== this.copyCurrentDayIndex)

                ) {
                    this.selectWeek(i)
                }
            }
        }
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
                if (!this.roleList.calender_see) {
                    // DefaultNotify.notifyDanger('      شما به این صفحه دسترسی ندارید.', '', NotiConfig.notifyConfig);
                    this.router.navigateByUrl('/panel');
                }
            }
        });
    }

    setYearList(): void {
        for (let i = 0; i < 20; i++) {
            this.yearList.push((this.selectYear - 10) + i);
        }
        // const start = this.yearList.length - 1;
        // const end = this.yearList.length + 9;
        // for (let i = start; i < end; i++) {
        //     this.yearList.push(this.yearList[i] + 1);
        // }
    }

// انتخاب روز برای نمایش زمانبدنی های آن روز
    setSelectedDayForGetOne(day) {
        if (this.selectedWeekDayList.length > 0) {
            this.selectedDayForGetOne = day;
            this.weekMode = false;
        }
    }

    changeMonth(type?): void {
        if (type === 'selectCurrentDay') {
            // setTimeout(() => {
            //     if (!this.selectedWeekDayList.some(e => e === this.currentDay)) {
            //         let index = -1;
            //         for (let i = 0; i < this.dayColumn.length; i++) {
            //             for (let j = 0; j < this.dayRowList.length; j++) {
            //                 index += 1;
            //                 if (this.monthDayList[index] === this.currentDay) {
            //                     this.selectWeek(i);
            //                 }
            //             }
            //         }
            //     }
            // }, 10);
            if (this.selectYear === this.currentYear && this.selectMonth.number === this.currentMonth.number) {
                return;
            } else {
                this.selectYear = this.currentYear;
                this.selectMonth.number = this.currentMonth.number;
            }


        }

        let selectMonthNumber = this.selectMonth.number.toString();
        if (this.selectMonth.number < 10) {
            selectMonthNumber = '0' + this.selectMonth.number;
        }
        const Gregorian = Moment.convertJaliliToGregorian(this.selectYear + '/' + selectMonthNumber + '/' + '1');
        const IsoDate = Moment.convertGregorianToIsoDate(Gregorian);
        const DayNumber = new Date(IsoDate).getDay();
        let kabiseh = false;
        this.selectedDay = null;
        this.selectYear % 4 === 3 ? kabiseh = true : false;

        this.monthDayList = [];
        let n = 32;
        if (this.selectMonth.number < 7) {
            n = 32;
        } else if (this.selectMonth.number === 12) {
            if (kabiseh === false) {
                n = 30;
            } else {
                n = 31;
            }
        } else if
        (this.selectMonth.number > 6 && this.selectMonth.number < 12) {
            n = 31;
        }

        const fromDateJ = this.selectYear + '/' + this.selectMonth.number + '/01 - 00:00';
        const fromDateIso = Moment.convertJaliliToIsoDateWithTime(fromDateJ);
        const toDateJ = this.selectYear + '/' + this.selectMonth.number + '/' + (n - 1) + '- 23:59';
        const toDateIso = Moment.convertJaliliToIsoDateWithTime(toDateJ);
        const dto = new managementMeeting.GetListByDate();
        dto.fromDate = fromDateIso;
        dto.toDate = toDateIso;

        this.getListByDate(dto);
        this.setMonthDayList(n, DayNumber);
        if (type !== 'selectCurrentDay' && type !== 'OnInit') {
            // انتخاب هفته وقتی ماه یا سال انتخاب شد
            // if (type === 'prev') {
            //     this.selectWeek(this.dayColumn.length - 1);
            //
            // } else if (type === 'next') {
            //     this.selectWeek(0);
            // }
        }

    }

    getListByDate(dto): void {
        this.selectedMeetingForDayList = [];
        this.currentDaySessionList = new MeetingDto.SessionDay();
        this.loadingPage = true;
        // this.managementMeetingService.getListByDate(dto).subscribe((res: any) => {
        //     if (res) {
        //         if (res.data) {
        //             for (const item of res.data) {
        //                 const newItem = new MeetingDto.SessionDay();
        //                 newItem.id = item.id;
        //                 newItem.month = this.selectMonth;
        //                 newItem.year = this.selectYear;
        //                 newItem.day = +Moment.getJDateFromIsoOnlyDay(new Date(item.id).toISOString());
        //                 newItem.sessionList = item.sessionList;
        //                 // const newItem = {
        //                 //   id: item.id,
        //                 //   day: +Moment.getJDateFromIsoOnlyDay(new Date(item.id).toISOString()),
        //                 //   sessionList: item.sessionList,
        //                 // };
        //                 if (newItem.day === this.currentDay) {
        //                     this.currentDaySessionList = newItem;
        //                 }
        //                 this.selectedMeetingForDayList.push(newItem);
        //             }
        //         }
        //         if (this.selectedMeetingForDayList.length === 0) {
        //             DefaultNotify.notifyWarning('برای این ماه جلسه ای نیست.');
        //
        //         }
        //     }
        //     this.loadingPage = false;
        // });
    }

    setCopyCurrentDay(n) {
        if (n === this.currentDay) {
            //// اگر از ماه قبل یا ماه بعد روزی با شماره امروز یکی بود ایندکسش را پیدا میکند
            this.copyCurrentDayIndex = this.monthDayList.length - 1;
        }
    }

    setMonthDayList(n, DayNumber): void {
        this.selectedWeekIndex = null;
        this.selectedWeekDayList = [];
        this.copyCurrentDayIndex = -1;
        if (DayNumber === 6) {
            for (let i = 1; i < 43; i++) {
                if (i < n) {
                    this.monthDayList.push(i);
                } else {
                    // this.monthDayList.push(-1);
                    this.monthDayList.push((i - n) + 1);
                    this.setCopyCurrentDay((i - n) + 1);

                }
            }
        } else {
            for (let i = 0; i < DayNumber + 1; i++) {
                // this.monthDayList.push(-1);
                if (this.selectMonth.number === 7) {
                    this.monthDayList.push(31 - ((DayNumber) - i));
                    this.setCopyCurrentDay(31 - ((DayNumber) - i));

                } else if (this.selectMonth.number === 1) {
                    let kabiseh = false;
                    (this.selectYear - 1) % 4 === 3 ? kabiseh = true : false;
                    if (kabiseh) {
                        this.monthDayList.push(n - ((DayNumber + 2) - i));
                        this.setCopyCurrentDay(n - ((DayNumber + 2) - i));

                    } else {
                        this.monthDayList.push(n - ((DayNumber + 3) - i));
                        this.setCopyCurrentDay(n - ((DayNumber + 3) - i));

                    }
                } else if (this.selectMonth.number === 12) {
                    this.monthDayList.push(30 - (DayNumber - i));
                    this.setCopyCurrentDay(30 - (DayNumber - i));

                } else {
                    this.monthDayList.push(n - ((DayNumber + 1) - i));
                    this.setCopyCurrentDay(n - ((DayNumber + 1) - i));

                }
            }
            for (let i = 1; i < 43 - (DayNumber + 1); i++) {
                if (i < n) {
                    this.monthDayList.push(i);
                } else {
                    // this.monthDayList.push(-1);
                    this.monthDayList.push((i - n) + 1);
                    this.setCopyCurrentDay((i - n) + 1);


                }
            }

            if ((DayNumber === 4 && n > 31) || (DayNumber === 5 && n > 30)) {
                if (!this.dayColumn.some(e => e === 6)) {
                    this.dayColumn.push(6);
                }
            } else {
                this.dayColumn = [1, 2, 3, 4, 5];
            }


        }
    }

    selectWeek(index): void {

        if (this.loadingGetListFrCalendar || this.loadingGetListForCalendarSchedule) {
            return;
        }
        if (this.selectedWeekIndex === index) {
            return;
        }

        let type: string;
        if (this.currentYear === this.selectYear) {
            if (this.currentMonth.number > this.selectMonth.number) {
                type = 'past';
            } else if (this.currentMonth.number < this.selectMonth.number) {
                type = 'future';

            }
        } else if (this.currentYear > this.selectYear) {
            type = 'past';

        } else if (this.currentYear < this.selectYear) {
            type = 'future';
        }

        this.selectedWeekIndex = index;
        let start = -1;
        let end = -1;
        this.selectedWeekDayList = [];

        this.workOrderDtoForHtmlList = [];
        for (let i = 0; i < 7; i++) {
            const newArray: WorkOrderDtoForHtml[] = [];
            this.workOrderDtoForHtmlList.push(newArray);
        }

        for (let i = index * 7; i < (index * 7) + 7; i++) {
            this.selectedWeekDayList.push(this.monthDayList[i]);
            if (this.monthDayList[i] !== -1 && start === -1) {
                start = this.monthDayList[i];
            }
            if (this.monthDayList[i] !== -1) {
                end = this.monthDayList[i];
            }

        }


        let starFull = this.selectYear + '/' + this.selectMonth.number + '/' + start;
        let endFull = this.selectYear + '/' + this.selectMonth.number + '/' + end;
        this.selectedWeekDayListFulDate = [];
        // let selectMonthNumber = this.selectMonth.number.toString();

        // if (+selectMonthNumber < 10) {
        //     selectMonthNumber = '0' + this.selectMonth.number;
        // }
        if (index === 0 && start > end) {

            starFull = this.selectYear + '/' + (this.selectMonth.number - 1) + '/' + start;
            if (this.selectMonth.number === 1) {
                starFull = (this.selectYear - 1) + '/' + (12) + '/' + start;
                for (const day of this.selectedWeekDayList) {

                    if (day > 7) {
                        this.pushDateToSelectedWeekDayListFulDate((this.selectYear - 1), 12, day);
                        // this.selectedWeekDayListFulDate.push((this.selectYear - 1) + '/' + 12 + '/' + day);
                    } else {
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, this.selectMonth.number, day);

                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + this.selectMonth.number + '/' + day);
                    }
                }

            } else {
                for (const day of this.selectedWeekDayList) {

                    if (day > 7) {
                        let sM = (this.selectMonth.number - 1).toString();
                        if (+sM < 10) {
                            sM = '0' + (+sM);
                        }
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, (sM), day)
                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + (sM) + '/' + day);
                    } else {
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, this.selectMonth.number, day)

                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + this.selectMonth.number + '/' + day);
                    }
                }
            }
            endFull = this.selectYear + '/' + this.selectMonth.number + '/' + end;



            let indexCurrentDay = -1;
            if (this.currentYear === this.selectYear && this.currentMonth.number === this.selectMonth.number &&
                this.currentDay < 8) {
                indexCurrentDay = this.selectedWeekDayList.findIndex(e => e === this.currentDay);
            }

            if (this.currentDay < 8 && indexCurrentDay !== -1) {
                // گذشته
                const CurrentDayValue = this.selectYear + '/' + this.selectMonth.number + '/' + this.selectedWeekDayList[indexCurrentDay];

                this.getListFrCalendar(starFull, CurrentDayValue);
                // آینده
                this.getListForCalendarSchedule(CurrentDayValue, endFull, false);
            } else {
                if (type === 'past') {
                    // گذشته
                    this.getListFrCalendar(starFull, endFull);

                } else if (type === 'future') {
                    // آینده
                    this.getListForCalendarSchedule(starFull, endFull, true);
                } else {
                    // گذشته
                    this.getListFrCalendar(starFull, endFull);
                }
            }

        } else if (index > 0 && start > end) {
            // console.log('ماه بعد');
            starFull = this.selectYear + '/' + this.selectMonth.number + '/' + start;
            endFull = this.selectYear + '/' + (this.selectMonth.number + 1) + '/' + end;
            if (this.selectMonth.number === 12) {
                endFull = (this.selectYear + 1) + '/' + (1) + '/' + end;
                for (const day of this.selectedWeekDayList) {

                    if (day < 8) {
                        this.pushDateToSelectedWeekDayListFulDate((this.selectYear + 1), '01', day);
                        // this.selectedWeekDayListFulDate.push((this.selectYear + 1) + '/' + '01' + '/' + day);
                    } else {
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, this.selectMonth.number, day);
                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + this.selectMonth.number + '/' + day);
                    }
                }
            } else {
                for (const day of this.selectedWeekDayList) {

                    if (day < 8) {
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, (this.selectMonth.number + 1), day);

                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + (this.selectMonth.number + 1) + '/' + day);
                    } else {
                        this.pushDateToSelectedWeekDayListFulDate(this.selectYear, this.selectMonth.number, day);

                        // this.selectedWeekDayListFulDate.push(this.selectYear + '/' + this.selectMonth.number + '/' + day);
                    }
                }
            }


            let indexCurrentDay = -1;
            if (this.currentYear === this.selectYear && this.currentMonth.number === this.selectMonth.number
                && this.currentDay > 7) {
                indexCurrentDay = this.selectedWeekDayList.findIndex(e => e === this.currentDay);
            }
            if (this.currentDay > 7 && indexCurrentDay !== -1) {
                // گذشته
                const CurrentDayValue = this.selectYear + '/' + this.selectMonth.number + '/' + this.selectedWeekDayList[indexCurrentDay];
                this.getListFrCalendar(starFull, CurrentDayValue);
                // آینده
                this.getListForCalendarSchedule(CurrentDayValue, endFull, false);
            } else {

                if (type === 'past') {
                    // گذشته
                    this.getListFrCalendar(starFull, endFull);

                } else if (type === 'future') {
                    // آینده
                    this.getListForCalendarSchedule(starFull, endFull, true);
                } else {
                    // آینده
                    this.getListForCalendarSchedule(starFull, endFull, true);
                }

                // آینده
                // this.getListForCalendarSchedule(starFull, endFull);
            }

        } else {
            // console.log('*******************')
            for (const day of this.selectedWeekDayList) {
                this.pushDateToSelectedWeekDayListFulDate(this.selectYear, this.selectMonth.number, day);
            }

            let indexCurrentDay = -1;
            // && this.currentDay > 7
            if (this.currentYear === this.selectYear && this.currentMonth.number === this.selectMonth.number
            ) {
                indexCurrentDay = this.selectedWeekDayList.findIndex(e => e === this.currentDay);
            }
            if (indexCurrentDay !== -1) {
                // console.log('*********indexCurrentDay !== -1**********')

                // گذشته
                const CurrentDayValue = this.selectYear + '/' + this.selectMonth.number + '/' + this.selectedWeekDayList[indexCurrentDay];
                this.getListFrCalendar(starFull, CurrentDayValue);
                // آینده
                this.getListForCalendarSchedule(CurrentDayValue, endFull, false);
            } else {
                // console.log('*********indexCurrentDay === -1**********')

                if (this.currentYear === this.selectYear) {
                    if (this.currentMonth.number === this.selectMonth.number) {

                        if (+starFull.split('/')[2] > this.currentDay) {
                            // آینده
                            this.getListForCalendarSchedule(starFull, endFull, true);
                        }
                        if (+endFull.split('/')[2] < this.currentDay) {
                            // گذشته
                            this.getListFrCalendar(starFull, endFull);
                        }
                    } else if (this.currentMonth.number > this.selectMonth.number) {
                        // گذشته
                        this.getListFrCalendar(starFull, endFull);

                    } else if (this.currentMonth.number < this.selectMonth.number) {
                        // آینده
                        this.getListForCalendarSchedule(starFull, endFull, true);
                    }
                } else if (this.currentYear > this.selectYear) {
                    // گذشته
                    this.getListFrCalendar(starFull, endFull);
                } else if (this.currentYear < this.selectYear) {
                    // آینده
                    this.getListForCalendarSchedule(starFull, endFull, true);
                }
            }
        }

        this.selectedWeekDayListFulDateCurrentDayIndex = -1;

        for (let i = 0; i < this.selectedWeekDayListFulDate.length; i++) {
            const splitDay = this.selectedWeekDayListFulDate[i].split('/');
            let d = splitDay[2];
            if (+d < 10) {
                d = +d;
                d = '0' + d;
            }
            let m = splitDay[1];
            if (+m < 10) {
                m = +m;
                m = '0' + m;
            }
            const y = splitDay[0];
            let cuM: any = this.currentMonth.number;
            let cuD: any = this.currentDay;
            if (+cuM < 10) {
                cuM = +cuM;
                cuM = '0' + cuM;
            }
            if (+cuD < 10) {
                cuD = +cuD;
                cuD = '0' + cuD;
            }
            if ((y + '/' + m + '/' + d) === (this.currentYear + '/' + cuM + '/' + cuD)) {
                this.selectedWeekDayListFulDateCurrentDayIndex = i;
            }
            // console.log('this.selectedWeekDayListFulDateCurrentDayIndex', this.selectedWeekDayListFulDateCurrentDayIndex)
            // console.log('1', y + '/' + m + '/' + d)
            // console.log('2', (this.currentYear + '/' + cuM + '/' + cuD))
            // this.selectedWeekDayListFulDate[i] = y + '/' + m + '/' + d;

        }

    }

    pushDateToSelectedWeekDayListFulDate(y, m, d) {
        d = +d;
        m = +m;
        if (d < 10) {
            d = '0' + d;
        }
        if (m < 10) {
            m = '0' + m;
        }
        this.selectedWeekDayListFulDate.push(y + '/' + m + '/' + d);

    }

    selectDay(day): void {

        return;
        // console.log(day);
        const exist = this.selectedMeetingForDayList.some(d => d.day === day);
        if (!exist) {
            // return;
        }
        // if (day !== -1) {
        const index = this.selectedMeetingForDayList.findIndex(d => d.day === day);
        this.selectedDay = this.selectedMeetingForDayList[index];
        sessionStorage.setItem('selectedDay', JSON.stringify(this.selectedDay));
        this.router.navigateByUrl('calender/day-session-list', {});
        //   setTimeout(e => {
        //     ModalUtil.showModal('meetingListInSelectedDayModal');
        //   }, 10);
        // }

    }

    setMonth(type): void {
        if (type === 'next') {
            this.selectMonth.number += 1;
            if (this.selectMonth.number > 12) {
                this.selectYear += 1;
                this.selectMonth.number = 1;
            }
        } else if (type === 'prev') {
            this.selectMonth.number -= 1;
            if (this.selectMonth.number < 1) {
                this.selectYear -= 1;
                this.selectMonth.number = 12;
            }
        }
        this.changeMonth(type);
    }

    setYear(type): void {
        if (type === 'next') {
            this.selectYear += 1;
        } else if (type === 'prev') {
            this.selectYear -= 1;
        }
        this.changeMonth(type);
    }

    getSelectedMeetingForDay(day): boolean {
        const exist = this.selectedMeetingForDayList.some(d => d.day === day);
        return exist;
    }

// گذشته
    loadingGetListFrCalendar = false;

    getListFrCalendar(startDate, endDate) {
        // console.log('گذشته');
        let s: any = this.MyMoment.convertJaliliToGregorian(startDate);
        // const s: any = this.MyMoment.convertJaliliToIsoDate(startDate);
        s = s.replaceAll('/', '-') + 'T00:00:00.000+03:30';
        // s = s.replaceAll('/', '-') + 'T00:00:00.000Z';
        let e: any = this.MyMoment.convertJaliliToGregorian(endDate);
        // const e: any = this.MyMoment.convertJaliliToIsoDate(endDate);
        e = e.replaceAll('/', '-') + 'T23:59:00.000+03:30';
        // e = e.replaceAll('/', '-') +  'T00:00:00.000Z';
        const dto = {
            startDate: s,
            endDate: e
        };
        this.loadingGetListFrCalendar = true;
        this.calenderService.getListForCalendar(dto).subscribe((res: GetListForCalendarScheduleDto) => {
            //
            if (res) {
                for (const workOrder of res.workOrder) {
                    // console.log(workOrder)
                    const newWorkOrderDtoForHtml = new WorkOrderDtoForHtml();
                    newWorkOrderDtoForHtml.id = workOrder.id;
                    newWorkOrderDtoForHtml.assetId = workOrder.assetId;
                    newWorkOrderDtoForHtml.assetName = workOrder.assetName;
                    newWorkOrderDtoForHtml.userList = [];
                    newWorkOrderDtoForHtml.frequency = workOrder.frequency;
                    newWorkOrderDtoForHtml.estimateCompletionDate = workOrder.estimateCompletionDate;
                    if (workOrder.userIdList) {
                        for (const userId of workOrder.userIdList) {
                            if (!newWorkOrderDtoForHtml.userList.some(u => u.id === userId)) {
                                newWorkOrderDtoForHtml.userList.push(res.userList.find(u => u.id === userId));
                            }
                        }
                    }
                    if (workOrder.endDate) {
                        newWorkOrderDtoForHtml.type = 'past';
                        newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToJDate(workOrder.endDate);
                        if (workOrder.startDate) {
                            const StartDate = new Date((workOrder.startDate));
                            const EndDate = new Date((workOrder.endDate));
                            const timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                            if (newWorkOrderDtoForHtml.estimateCompletionDate) {
                                newWorkOrderDtoForHtml.delay = Math.floor((timeDiff / (1000 * 3600 * 24))) - newWorkOrderDtoForHtml.estimateCompletionDate;
                            } else {
                                newWorkOrderDtoForHtml.delay = Math.floor((timeDiff / (1000 * 3600 * 24)));//رند به بالا مبکند
                            }
                            // newWorkOrderDtoForHtml.delay = Math.ceil(timeDiff / (1000 * 3600 * 24));  رند به بالا مبکند
                            console.log(newWorkOrderDtoForHtml.delay)
                            console.log(timeDiff)
                        }
                        const index = this.selectedWeekDayListFulDate.findIndex(day =>
                            day === newWorkOrderDtoForHtml.endDate);
                        if (index !== -1) {
                            this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                        }
                    } else {
                        newWorkOrderDtoForHtml.type = 'past-notDone';
                        newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToJDate(workOrder.startDate);
                        const index = this.selectedWeekDayListFulDate.findIndex(day =>
                            day === newWorkOrderDtoForHtml.startDate);
                        if (index !== -1) {
                            this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                        }
                    }


                }

            }

            setTimeout(() => {
                this.loadingGetListFrCalendar = false;
            }, 100);

        }, error => {
            this.loadingGetListFrCalendar = false;
        });
    }

    // آینده
    loadingGetListForCalendarSchedule = false;

    getListForCalendarSchedule1(startDate, endDate, start: boolean) {
        const myThis = this;

        // console.log('آینده');
        const startDateGregorian: any = this.MyMoment.convertJaliliToGregorian(startDate);
        let startDateIso: any = startDateGregorian.replaceAll('/', '-') + 'T00:00:00.000+03:30';
        const endDateGregorian: any = this.MyMoment.convertJaliliToGregorian(endDate);
        const endDateIso = endDateGregorian.replaceAll('/', '-') + 'T23:59:00.000+03:30';
        if (!start) {
            startDateIso = startDateGregorian.replaceAll('/', '-') + 'T00:00:00.000+00:00';
            let date: any = new Date(startDateIso);
            date.setHours(date.getHours() + 24);
            date = this.MyMoment.getGregorianDateFromIso(date);
            date = date.replaceAll('/', '-') + 'T00:00:00.000+03:30';
            startDateIso = date;

        }
        const dto = {
            startDate: startDateIso,
            endDate: endDateIso
        };

        this.loadingGetListForCalendarSchedule = true;
        // console.log(this.selectedWeekDayListFulDate)

        this.calenderService.getListForCalendarSchedule(dto).subscribe((res: GetListForCalendarScheduleDto) => {
            if (res) {
                for (const workOrder of res.workOrder) {
                    const newWorkOrderDtoForHtml = new WorkOrderDtoForHtml();
                    newWorkOrderDtoForHtml.id = workOrder.id;
                    newWorkOrderDtoForHtml.assetId = workOrder.assetId;
                    newWorkOrderDtoForHtml.assetName = workOrder.assetName;
                    newWorkOrderDtoForHtml.userList = [];
                    newWorkOrderDtoForHtml.type = 'future';
                    newWorkOrderDtoForHtml.frequency = workOrder.frequency;

                    if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {

                        newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);
                        newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToGDate(workOrder.endDate);
                        newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);

                        // console.log(newWorkOrderDtoForHtml)
                    } else {
                        newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
                        newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToJDate(workOrder.endDate);
                        newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
                    }

                    if (workOrder.userIdList) {
                        for (const userId of workOrder.userIdList) {
                            if (!newWorkOrderDtoForHtml.userList.some(u => u.id === userId)) {
                                newWorkOrderDtoForHtml.userList.push(res.userList.find(u => u.id === userId));
                        }
                        }
                    }


                    let index = -1;
                    if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                        index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                    } else {

                        index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            day === newWorkOrderDtoForHtml.startDate);
                    }
                    // console.log(index);
                    if (index !== -1) {
                        this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                        if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                            pushToWorkOrderDtoForHtmlList_DAILY(index + workOrder.per, this.workOrderDtoForHtmlList);
                        }
                    } else if (index === -1) {

                        checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);

                        function checkByPerAndNextDate(nexDate: any) {
                            // console.log('//////////////////////////////', nexDate)
                            const year = +nexDate.split('/')[0];
                            const month = +nexDate.split('/')[1];


                            let kabiseh = false;
                            year % 4 === 3 ? kabiseh = true : false;
                            let n = 0;
                            if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                                n = 24;
                                newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                                newWorkOrderDtoForHtml.startDate.setHours(
                                    newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                                newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                                newWorkOrderDtoForHtml.nexDate.setHours(
                                    newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                                // console.log('newWorkOrderDtoForHtml.nexDate', newWorkOrderDtoForHtml.nexDate)
                                newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                                newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);

                            } else if (newWorkOrderDtoForHtml.frequency === 'WEEKLY') {
                                n = 24 * 7;
                                newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                                newWorkOrderDtoForHtml.startDate.setHours(
                                    newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                                newWorkOrderDtoForHtml.nexDate = new Date(nexDate);
                                newWorkOrderDtoForHtml.nexDate.setHours(
                                    newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                                newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                                newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                                // console.log('newWorkOrderDtoForHtml', newWorkOrderDtoForHtml)

                            } else if (newWorkOrderDtoForHtml.frequency === 'MONTHLY') {
                                newWorkOrderDtoForHtml.startDate = nexDate;


                                const yS = nexDate.split('/')[0];
                                const mS = nexDate.split('/')[1];
                                let dS = nexDate.split('/')[2];
                                if (+mS > 6 && +dS === 31) {
                                    dS = 30;
                                }

                                let kabis = false;
                                yS % 4 === 3 ? kabis = true : false;
                                if (+mS === 12) {
                                    if (+dS === 30 && !kabis) {
                                        dS = 29;
                                    }

                                }
                                newWorkOrderDtoForHtml.startDate = yS + '/' + mS + '/' + dS;


                                let y = nexDate.split('/')[0];
                                let m = nexDate.split('/')[1];
                                const d = nexDate.split('/')[2];

                                m = +m + workOrder.per;
                                if (+m > 12) {
                                    m = +m - 12;
                                    y = +y + 1;
                                }
                                if (+m < 10) {
                                    m = '0' + m;
                                }

                                newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;


                            } else if (newWorkOrderDtoForHtml.frequency === 'YEARLY') {
                                newWorkOrderDtoForHtml.startDate = nexDate;
                                let y = nexDate.split('/')[0];
                                const yS = nexDate.split('/')[0];
                                const m = nexDate.split('/')[1];
                                const d = nexDate.split('/')[2];
                                let dS = nexDate.split('/')[2];

                                y = +y + workOrder.per;

                                let kabis = false;
                                yS % 4 === 3 ? kabis = true : false;
                                if (!kabis && (+dS === 30)) {
                                    dS = 29;
                                    newWorkOrderDtoForHtml.startDate = yS + '/' + m + '/' + dS;
                                }
                                newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;

                            }

                            let index2 = -1;
                            if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                                index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                                    myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                            } else {
                                index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                                    day === newWorkOrderDtoForHtml.startDate);
                            }

                            if (index2 !== -1) {
                                if (newWorkOrderDtoForHtml.startDate <= newWorkOrderDtoForHtml.endDate) {
                                    pushToWorkOrderDtoForHtmlList(index2, myThis.workOrderDtoForHtmlList);
                                    if (newWorkOrderDtoForHtml.frequency !== 'DAILY') {
                                        return;
                                    }
                                }
                            }
                            if (newWorkOrderDtoForHtml.startDate < newWorkOrderDtoForHtml.endDate) {

                                if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                                    const nextDateJ = myThis.MyMoment.convertGToJ(newWorkOrderDtoForHtml.nexDate);
                                    const YNextDateJ = nextDateJ.split('/')[0];
                                    const MNextDateJ = nextDateJ.split('/')[1];
                                    if (+YNextDateJ > +myThis.selectYear) {
                                        if (+myThis.selectMonth.number === 12) {
                                            if (+MNextDateJ === 2) {
                                                return;
                                            }
                                        } else {
                                            return;
                                        }
                                    } else if (+YNextDateJ === +myThis.selectYear) {
                                        if (+MNextDateJ > +myThis.selectMonth.number + 1) {
                                            return;
                                        }
                                    }
                                }

                                checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);
                            }
                        }
                    }

                    function pushToWorkOrderDtoForHtmlList(i, workOrderDtoForHtmlList) {
                        if (i < 7) {
                            workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                        }
                    }

                    function pushToWorkOrderDtoForHtmlList_DAILY(i, workOrderDtoForHtmlList) {
                        if (i < 7) {
                            workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                            pushToWorkOrderDtoForHtmlList_DAILY(i + workOrder.per, workOrderDtoForHtmlList);
                        }
                    }
                }
            }
            // console.log(' this.workOrderDtoForHtmlList', this.workOrderDtoForHtmlList)

            setTimeout(() => {
                this.loadingGetListForCalendarSchedule = false;
            }, 100);
        });
    }

    convertEnDateAndSdate(date: string) {
        const day = date.split('/');
        const y = day[0];
        let m: any = day[1];
        m = +m;
        if (+m < 10) {
            m = '0' + m;
        }
        let d: any = day[2];
        d = +d;
        if (+d < 10) {
            d = '0' + d;
        }
        return y + '/' + m + '/' + d;
    }

    getListForCalendarSchedule(startDate, endDate, start: boolean) {
        const enJForReturn = this.convertEnDateAndSdate(endDate);
        const startJForReturn = this.convertEnDateAndSdate(startDate);
        const myThis = this;


        // console.log('آینده');
        const startDateGregorian: any = this.MyMoment.convertJaliliToGregorian(startDate);
        let startDateIso: any = startDateGregorian.replaceAll('/', '-') + 'T00:00:00.000+03:30';
        const endDateGregorian: any = this.MyMoment.convertJaliliToGregorian(endDate);
        const endDateIso = endDateGregorian.replaceAll('/', '-') + 'T23:59:00.000+03:30';
        if (!start) {
            startDateIso = startDateGregorian.replaceAll('/', '-') + 'T00:00:00.000+00:00';
            let date: any = new Date(startDateIso);
            date.setHours(date.getHours() + 24);
            date = this.MyMoment.getGregorianDateFromIso(date);
            date = date.replaceAll('/', '-') + 'T00:00:00.000+03:30';
            startDateIso = date;

        }
        const dto = {
            startDate: startDateIso,
            endDate: endDateIso
        };

        this.loadingGetListForCalendarSchedule = true;
        // console.log(this.selectedWeekDayListFulDate)

        this.calenderService.getListForCalendarSchedule(dto).subscribe((res: GetListForCalendarScheduleDto) => {
            if (res) {
                // res.workOrder = res.workOrder.concat(res.workOrder);
                // res.workOrder = res.workOrder.concat(res.workOrder);
                // res.workOrder = res.workOrder.concat(res.workOrder);
                // res.workOrder = res.workOrder.concat(res.workOrder);

                // const json = {
                //     "workOrder": [
                //         {
                //             "id": "622ca439820ece61f97c5e13",
                //             "startDate": "2022-03-14T00:00:00.000+00:00",
                //             "endDate": "2022-03-20T00:00:00.000+00:00",
                //             "nexDate": "2022-03-14T02:31:01.001+00:00",
                //             "assetId": "6157ebe08fd2491913680b4f",
                //             "assetName": "میکسر تانک AL6",
                //             "userIdList": [
                //                 "603b4696a158557816b9974b"
                //             ],
                //             "frequency": "DAILY",
                //             "per": 1
                //         }
                //     ],
                //     "userList": [
                //         {
                //             "id": "603b4696a158557816b9974b",
                //             "family": "محمدی",
                //             "name": "ناصر"
                //         }
                //     ]
                // }


                // console.log(res.workOrder)
                // console.log(json)

                this.addResWorkOrderToList(res.workOrder, 0, 50, startDateGregorian,
                    startJForReturn, endDateGregorian, enJForReturn, res.userList);
                this.loadingGetListForCalendarSchedule = false;

                // for (const workOrder of res.workOrder) {
                //     // if (workOrder.assetId === '6169a188c041b90924c80a2e') {
                //
                //     const newWorkOrderDtoForHtml = new WorkOrderDtoForHtml();
                //     newWorkOrderDtoForHtml.id = workOrder.id;
                //     newWorkOrderDtoForHtml.assetId = workOrder.assetId;
                //     newWorkOrderDtoForHtml.assetName = workOrder.assetName;
                //     newWorkOrderDtoForHtml.userList = [];
                //     newWorkOrderDtoForHtml.type = 'future';
                //     newWorkOrderDtoForHtml.frequency = workOrder.frequency;
                //
                //     if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                //
                //         newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);
                //         newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToGDate(workOrder.endDate);
                //         newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);
                //
                //     } else {
                //         newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
                //         newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToJDate(workOrder.endDate);
                //         newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
                //     }
                //
                //
                //     let index = -1;
                //     if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                //         index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //             myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                //     } else {
                //
                //         index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //             day === newWorkOrderDtoForHtml.startDate);
                //     }
                //     // console.log(index);
                //     if (index !== -1) {
                //         this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                //         if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                //             pushToWorkOrderDtoForHtmlList_DAILY(index + workOrder.per, this.workOrderDtoForHtmlList);
                //         }
                //     } else if (index === -1) {
                //
                //         ///////////////////// اختلاف بین دوتاریخ
                //         const test = true
                //         if (test) {
                //             if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                //                 while (newWorkOrderDtoForHtml.nexDate < startDateGregorian) {
                //                     const n = 24;
                //                     newWorkOrderDtoForHtml.startDate = new Date(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.startDate.setHours(
                //                         newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));
                //
                //                     newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.nexDate.setHours(
                //                         newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));
                //
                //                     // console.log('newWorkOrderDtoForHtml.nexDate', newWorkOrderDtoForHtml.nexDate)
                //                     newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                //                 }
                //             } else if (newWorkOrderDtoForHtml.frequency === 'WEEKLY') {
                //                 while (newWorkOrderDtoForHtml.nexDate < startDateGregorian) {
                //                     const n = 24 * 7;
                //                     newWorkOrderDtoForHtml.startDate = new Date(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.startDate.setHours(
                //                         newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));
                //
                //                     newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.nexDate.setHours(
                //                         newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));
                //
                //                     newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                //                     newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                //                 }
                //             } else if (newWorkOrderDtoForHtml.frequency === 'MONTHLY') {
                //
                //                 while (newWorkOrderDtoForHtml.nexDate < startJForReturn) {
                //                     newWorkOrderDtoForHtml.startDate = newWorkOrderDtoForHtml.nexDate;
                //
                //                     const yS = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                //                     const mS = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                //                     let dS = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                //                     if (+mS > 6 && +dS === 31) {
                //                         dS = 30;
                //                     }
                //
                //                     let kabis = false;
                //                     yS % 4 === 3 ? kabis = true : false;
                //                     if (+mS === 12) {
                //                         if (+dS === 30 && !kabis) {
                //                             dS = 29;
                //                         }
                //
                //                     }
                //                     newWorkOrderDtoForHtml.startDate = yS + '/' + mS + '/' + dS;
                //
                //
                //                     let y = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                //                     let m = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                //                     const d = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                //
                //                     m = +m + workOrder.per;
                //                     if (+m > 12) {
                //                         m = +m - 12;
                //                         y = +y + 1;
                //                     }
                //                     if (+m < 10) {
                //                         m = '0' + m;
                //                     }
                //
                //                     newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                //                     console.log("while...MONTHLY")
                //                 }
                //             } else if (newWorkOrderDtoForHtml.frequency === 'YEARLY') {
                //
                //                 while (newWorkOrderDtoForHtml.nexDate < startJForReturn) {
                //                     newWorkOrderDtoForHtml.startDate = newWorkOrderDtoForHtml.nexDate;
                //                     let y = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                //                     const yS = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                //                     const m = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                //                     const d = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                //                     let dS = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                //
                //                     y = +y + workOrder.per;
                //
                //                     let kabis = false;
                //                     yS % 4 === 3 ? kabis = true : false;
                //                     if (!kabis && (+dS === 30)) {
                //                         dS = 29;
                //                         newWorkOrderDtoForHtml.startDate = yS + '/' + m + '/' + dS;
                //                     }
                //                     newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                //                 }
                //             }
                //
                //             let index2 = -1;
                //             if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                //                 index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //                     myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                //             } else {
                //                 index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //                     day === newWorkOrderDtoForHtml.startDate);
                //             }
                //
                //             if (index2 !== -1) {
                //                 if (newWorkOrderDtoForHtml.startDate <= newWorkOrderDtoForHtml.endDate) {
                //                     pushToWorkOrderDtoForHtmlList(index2, myThis.workOrderDtoForHtmlList);
                //                 }
                //             }
                //         }
                //         // else {
                //
                //         checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);
                //
                //         function checkByPerAndNextDate(nexDate: any) {
                //             let n = 0;
                //             if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                //
                //                 n = 24;
                //                 newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                //                 newWorkOrderDtoForHtml.startDate.setHours(
                //                     newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));
                //
                //                 newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                //                 newWorkOrderDtoForHtml.nexDate.setHours(
                //                     newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));
                //
                //                 // console.log('newWorkOrderDtoForHtml.nexDate', newWorkOrderDtoForHtml.nexDate)
                //                 newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                //                 newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                //
                //
                //             } else if (newWorkOrderDtoForHtml.frequency === 'WEEKLY') {
                //                 n = 24 * 7;
                //                 newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                //                 newWorkOrderDtoForHtml.startDate.setHours(
                //                     newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));
                //
                //                 newWorkOrderDtoForHtml.nexDate = new Date(nexDate);
                //                 newWorkOrderDtoForHtml.nexDate.setHours(
                //                     newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));
                //
                //                 newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                //                 newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                //                 // console.log('newWorkOrderDtoForHtml', newWorkOrderDtoForHtml)
                //
                //             } else if (newWorkOrderDtoForHtml.frequency === 'MONTHLY') {
                //                 newWorkOrderDtoForHtml.startDate = nexDate;
                //
                //
                //                 const yS = nexDate.split('/')[0];
                //                 const mS = nexDate.split('/')[1];
                //                 let dS = nexDate.split('/')[2];
                //                 if (+mS > 6 && +dS === 31) {
                //                     dS = 30;
                //                 }
                //
                //                 let kabis = false;
                //                 yS % 4 === 3 ? kabis = true : false;
                //                 if (+mS === 12) {
                //                     if (+dS === 30 && !kabis) {
                //                         dS = 29;
                //                     }
                //
                //                 }
                //                 newWorkOrderDtoForHtml.startDate = yS + '/' + mS + '/' + dS;
                //
                //
                //                 let y = nexDate.split('/')[0];
                //                 let m = nexDate.split('/')[1];
                //                 const d = nexDate.split('/')[2];
                //
                //                 m = +m + workOrder.per;
                //                 if (+m > 12) {
                //                     m = +m - 12;
                //                     y = +y + 1;
                //                 }
                //                 if (+m < 10) {
                //                     m = '0' + m;
                //                 }
                //
                //                 newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                //
                //             } else if (newWorkOrderDtoForHtml.frequency === 'YEARLY') {
                //                 newWorkOrderDtoForHtml.startDate = nexDate;
                //                 let y = nexDate.split('/')[0];
                //                 const yS = nexDate.split('/')[0];
                //                 const m = nexDate.split('/')[1];
                //                 const d = nexDate.split('/')[2];
                //                 let dS = nexDate.split('/')[2];
                //
                //                 y = +y + workOrder.per;
                //
                //                 let kabis = false;
                //                 yS % 4 === 3 ? kabis = true : false;
                //                 if (!kabis && (+dS === 30)) {
                //                     dS = 29;
                //                     newWorkOrderDtoForHtml.startDate = yS + '/' + m + '/' + dS;
                //                 }
                //                 newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                //
                //             }
                //
                //             let index2 = -1;
                //             if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                //                 index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //                     myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                //             } else {
                //                 index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                //                     day === newWorkOrderDtoForHtml.startDate);
                //             }
                //
                //             if (index2 !== -1) {
                //                 if (newWorkOrderDtoForHtml.startDate <= newWorkOrderDtoForHtml.endDate) {
                //                     pushToWorkOrderDtoForHtmlList(index2, myThis.workOrderDtoForHtmlList);
                //                 }
                //             }
                //             let reloadFunction = true;
                //             if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                //                 if (newWorkOrderDtoForHtml.nexDate > endDateGregorian) {
                //                     reloadFunction = false;
                //                 }
                //             } else if (workOrder.frequency === 'YEARLY' || workOrder.frequency === 'MONTHLY') {
                //                 if (newWorkOrderDtoForHtml.nexDate > enJForReturn) {
                //                     reloadFunction = false;
                //                 }
                //             }
                //             if (newWorkOrderDtoForHtml.startDate < newWorkOrderDtoForHtml.endDate) {
                //
                //
                //                 // console.log('********************************************************', reloadFunction)
                //                 if (reloadFunction) {
                //                     checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);
                //                 }
                //             }
                //         }
                //
                //         // }
                //
                //     }
                //
                //     function pushToWorkOrderDtoForHtmlList(i, workOrderDtoForHtmlList) {
                //         if (i < 7) {
                //             if (workOrder.userIdList) {
                //                 for (const userId of workOrder.userIdList) {
                //                     newWorkOrderDtoForHtml.userList.push(res.userList.find(u => u.id === userId));
                //                 }
                //             }
                //             workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                //         }
                //     }
                //
                //     function pushToWorkOrderDtoForHtmlList_DAILY(i, workOrderDtoForHtmlList) {
                //         if (i < 7) {
                //             if (workOrder.userIdList) {
                //                 for (const userId of workOrder.userIdList) {
                //                     newWorkOrderDtoForHtml.userList.push(res.userList.find(u => u.id === userId));
                //                 }
                //             }
                //             workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                //             pushToWorkOrderDtoForHtmlList_DAILY(i + workOrder.per, workOrderDtoForHtmlList);
                //         }
                //     }
                //
                //     // }
                // }
            } else {
                // console.log(' this.workOrderDtoForHtmlList', this.workOrderDtoForHtmlList)
                setTimeout(() => {
                    this.loadingGetListForCalendarSchedule = false;
                }, 100);
            }
        }, error => {
            this.loadingGetListForCalendarSchedule = false;

        });
    }

    addResWorkOrderToList(workOrderList, start, end, startDateGregorian,
                          startJForReturn, endDateGregorian, enJForReturn, userList) {
        const myThis = this;
        let d: any = this.currentDay;
        if (+d < 10) {
            d = +d;
            d = '0' + d;
        }
        let m: any = this.currentMonth.number;
        if (+m < 10) {
            m = +m;
            m = '0' + m;
        }
        const today = this.currentYear + '/' + m + '/' + d;
        this.loadingGetListForCalendarSchedule = true;

        if (end > workOrderList.length) {
            end = workOrderList.length;
        }
        for (let i = start; i < end; i++) {
            const workOrder = workOrderList[i]
            console.log(' workOrderList[i]', workOrderList[i])

            // if (workOrder.assetId === '6169a188c041b90924c80a2e') {

            const newWorkOrderDtoForHtml = new WorkOrderDtoForHtml();
            newWorkOrderDtoForHtml.id = workOrder.id;
            newWorkOrderDtoForHtml.assetId = workOrder.assetId;
            newWorkOrderDtoForHtml.assetName = workOrder.assetName;
            newWorkOrderDtoForHtml.userList = [];
            newWorkOrderDtoForHtml.type = 'future';
            newWorkOrderDtoForHtml.frequency = workOrder.frequency;

            if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {

                newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);
                newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToGDate(workOrder.endDate);
                newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToGDate(workOrder.nexDate);

            } else {
                newWorkOrderDtoForHtml.startDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
                newWorkOrderDtoForHtml.endDate = this.MyMoment.convertIsoToJDate(workOrder.endDate);
                newWorkOrderDtoForHtml.nexDate = this.MyMoment.convertIsoToJDate(workOrder.nexDate);
            }


            let index = -1;
            if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                    myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
            } else {

                index = myThis.selectedWeekDayListFulDate.findIndex(day =>
                    day === newWorkOrderDtoForHtml.startDate);
            }
            // console.log(index);
            if (index !== -1) {
                //بعد از امروز پوش شود
                if (myThis.selectedWeekDayListFulDate[index] > today) {
                    // this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                    //  اگر تاریخ پایان از روزی که میخاد پوش کنه بزرگتر بود پوش کنه
                    if (myThis.MyMoment.convertGToJ(newWorkOrderDtoForHtml.endDate) >= myThis.selectedWeekDayListFulDate[i]) {
                        this.workOrderDtoForHtmlList[index].push(newWorkOrderDtoForHtml);
                    }
                }
                if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                    pushToWorkOrderDtoForHtmlList_DAILY(index + workOrder.per, this.workOrderDtoForHtmlList);
                }
            } else if (index === -1) {

                ///////////////////// اختلاف بین دوتاریخ
                const test = true
                if (test) {
                    if (newWorkOrderDtoForHtml.frequency === 'DAILY') {
                        while (newWorkOrderDtoForHtml.nexDate < startDateGregorian) {
                            const n = 24;
                            newWorkOrderDtoForHtml.startDate = new Date(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.startDate.setHours(
                                newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                            newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.nexDate.setHours(
                                newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                            // console.log('newWorkOrderDtoForHtml.nexDate', newWorkOrderDtoForHtml.nexDate)
                            newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                        }
                    } else if (newWorkOrderDtoForHtml.frequency === 'WEEKLY') {
                        while (newWorkOrderDtoForHtml.nexDate < startDateGregorian) {
                            const n = 24 * 7;
                            newWorkOrderDtoForHtml.startDate = new Date(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.startDate.setHours(
                                newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                            newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.nexDate.setHours(
                                newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                            newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                            newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                        }
                    } else if (newWorkOrderDtoForHtml.frequency === 'MONTHLY') {

                        while (newWorkOrderDtoForHtml.nexDate < startJForReturn) {
                            newWorkOrderDtoForHtml.startDate = newWorkOrderDtoForHtml.nexDate;

                            const yS = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                            const mS = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                            let dS = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                            if (+mS > 6 && +dS === 31) {
                                dS = 30;
                            }

                            let kabis = false;
                            yS % 4 === 3 ? kabis = true : false;
                            if (+mS === 12) {
                                if (+dS === 30 && !kabis) {
                                    dS = 29;
                                }

                            }
                            newWorkOrderDtoForHtml.startDate = yS + '/' + mS + '/' + dS;


                            let y = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                            let m = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                            const d = newWorkOrderDtoForHtml.nexDate.split('/')[2];

                            m = +m + workOrder.per;
                            if (+m > 12) {
                                m = +m - 12;
                                y = +y + 1;
                            }
                            if (+m < 10) {
                                m = '0' + m;
                            }

                            newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                            console.log("while...MONTHLY")
                        }
                    } else if (newWorkOrderDtoForHtml.frequency === 'YEARLY') {

                        while (newWorkOrderDtoForHtml.nexDate < startJForReturn) {
                            newWorkOrderDtoForHtml.startDate = newWorkOrderDtoForHtml.nexDate;
                            let y = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                            const yS = newWorkOrderDtoForHtml.nexDate.split('/')[0];
                            const m = newWorkOrderDtoForHtml.nexDate.split('/')[1];
                            const d = newWorkOrderDtoForHtml.nexDate.split('/')[2];
                            let dS = newWorkOrderDtoForHtml.nexDate.split('/')[2];

                            y = +y + workOrder.per;

                            let kabis = false;
                            yS % 4 === 3 ? kabis = true : false;
                            if (!kabis && (+dS === 30)) {
                                dS = 29;
                                newWorkOrderDtoForHtml.startDate = yS + '/' + m + '/' + dS;
                            }
                            newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;
                        }
                    }

                    let index2 = -1;
                    if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                        index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                    } else {
                        index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            day === newWorkOrderDtoForHtml.startDate);
                    }

                    if (index2 !== -1) {
                        if (newWorkOrderDtoForHtml.startDate <= newWorkOrderDtoForHtml.endDate) {
                            pushToWorkOrderDtoForHtmlList(index2, myThis.workOrderDtoForHtmlList);
                        }
                    }
                }
                // else {

                checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);

                function checkByPerAndNextDate(nexDate: any) {
                    let n = 0;
                    if (newWorkOrderDtoForHtml.frequency === 'DAILY') {

                        n = 24;
                        newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                        newWorkOrderDtoForHtml.startDate.setHours(
                            newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                        newWorkOrderDtoForHtml.nexDate = new Date(newWorkOrderDtoForHtml.nexDate);
                        newWorkOrderDtoForHtml.nexDate.setHours(
                            newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                        // console.log('newWorkOrderDtoForHtml.nexDate', newWorkOrderDtoForHtml.nexDate)
                        newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                        newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);


                    } else if (newWorkOrderDtoForHtml.frequency === 'WEEKLY') {
                        n = 24 * 7;
                        newWorkOrderDtoForHtml.startDate = new Date(nexDate);
                        newWorkOrderDtoForHtml.startDate.setHours(
                            newWorkOrderDtoForHtml.startDate.getHours() + (workOrder.per * n));

                        newWorkOrderDtoForHtml.nexDate = new Date(nexDate);
                        newWorkOrderDtoForHtml.nexDate.setHours(
                            newWorkOrderDtoForHtml.nexDate.getHours() + (workOrder.per * n));

                        newWorkOrderDtoForHtml.nexDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.nexDate);
                        newWorkOrderDtoForHtml.startDate = myThis.MyMoment.getGregorianDateFromIso(newWorkOrderDtoForHtml.startDate);
                        // console.log('newWorkOrderDtoForHtml', newWorkOrderDtoForHtml)

                    } else if (newWorkOrderDtoForHtml.frequency === 'MONTHLY') {
                        newWorkOrderDtoForHtml.startDate = nexDate;


                        const yS = nexDate.split('/')[0];
                        const mS = nexDate.split('/')[1];
                        let dS = nexDate.split('/')[2];
                        if (+mS > 6 && +dS === 31) {
                            dS = 30;
                        }

                        let kabis = false;
                        yS % 4 === 3 ? kabis = true : false;
                        if (+mS === 12) {
                            if (+dS === 30 && !kabis) {
                                dS = 29;
                            }

                        }
                        newWorkOrderDtoForHtml.startDate = yS + '/' + mS + '/' + dS;


                        let y = nexDate.split('/')[0];
                        let m = nexDate.split('/')[1];
                        const d = nexDate.split('/')[2];

                        m = +m + workOrder.per;
                        if (+m > 12) {
                            m = +m - 12;
                            y = +y + 1;
                        }
                        if (+m < 10) {
                            m = '0' + m;
                        }

                        newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;

                    } else if (newWorkOrderDtoForHtml.frequency === 'YEARLY') {
                        newWorkOrderDtoForHtml.startDate = nexDate;
                        let y = nexDate.split('/')[0];
                        const yS = nexDate.split('/')[0];
                        const m = nexDate.split('/')[1];
                        const d = nexDate.split('/')[2];
                        let dS = nexDate.split('/')[2];

                        y = +y + workOrder.per;

                        let kabis = false;
                        yS % 4 === 3 ? kabis = true : false;
                        if (!kabis && (+dS === 30)) {
                            dS = 29;
                            newWorkOrderDtoForHtml.startDate = yS + '/' + m + '/' + dS;
                        }
                        newWorkOrderDtoForHtml.nexDate = y + '/' + m + '/' + d;

                    }

                    let index2 = -1;
                    if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                        index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            myThis.MyMoment.convertJaliliToGregorian(day) === newWorkOrderDtoForHtml.startDate);
                    } else {
                        index2 = myThis.selectedWeekDayListFulDate.findIndex(day =>
                            day === newWorkOrderDtoForHtml.startDate);
                    }

                    if (index2 !== -1) {
                        if (newWorkOrderDtoForHtml.startDate <= newWorkOrderDtoForHtml.endDate) {
                            pushToWorkOrderDtoForHtmlList(index2, myThis.workOrderDtoForHtmlList);
                        }
                    }
                    let reloadFunction = true;
                    if (workOrder.frequency === 'DAILY' || workOrder.frequency === 'WEEKLY') {
                        if (newWorkOrderDtoForHtml.nexDate > endDateGregorian) {
                            reloadFunction = false;
                        }
                    } else if (workOrder.frequency === 'YEARLY' || workOrder.frequency === 'MONTHLY') {
                        if (newWorkOrderDtoForHtml.nexDate > enJForReturn) {
                            reloadFunction = false;
                        }
                    }
                    if (newWorkOrderDtoForHtml.startDate < newWorkOrderDtoForHtml.endDate) {


                        // console.log('********************************************************', reloadFunction)
                        if (reloadFunction) {
                            checkByPerAndNextDate(newWorkOrderDtoForHtml.nexDate);
                        }
                    }
                }

                // }

            }

            function pushToWorkOrderDtoForHtmlList(i, workOrderDtoForHtmlList) {
                if (i < 7) {
                    if (workOrder.userIdList) {
                        for (const userId of workOrder.userIdList) {
                            if (!newWorkOrderDtoForHtml.userList.some(u => u.id === userId)) {
                                newWorkOrderDtoForHtml.userList.push(userList.find(u => u.id === userId));
                        }
                        }
                    }
                    // بعد از امروز پوش شود
                    if (myThis.selectedWeekDayListFulDate[i] > today) {

                        //  اگر تاریخ پایان از روزی که میخاد پوش کنه بزرگتر بود پوش کنه
                        if (myThis.MyMoment.convertGToJ(newWorkOrderDtoForHtml.endDate) >= myThis.selectedWeekDayListFulDate[i]) {
                            workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                        }
                    }
                }
            }

            function pushToWorkOrderDtoForHtmlList_DAILY(i, workOrderDtoForHtmlList) {
                if (i < 7) {
                    if (workOrder.userIdList) {
                        for (const userId of workOrder.userIdList) {
                            if (!newWorkOrderDtoForHtml.userList.some(u => u.id === userId)) {
                                newWorkOrderDtoForHtml.userList.push(userList.find(u => u.id === userId));
                            }
                        }
                    }
                    //بعد از امروز پوش شود
                    if (myThis.selectedWeekDayListFulDate[i] > today) {
                        //  اگر تاریخ پایان از روزی که میخاد پوش کنه بزرگتر بود پوش کنه
                        if (myThis.MyMoment.convertGToJ(newWorkOrderDtoForHtml.endDate) >= myThis.selectedWeekDayListFulDate[i]) {
                            workOrderDtoForHtmlList[i].push(newWorkOrderDtoForHtml);
                        }
                    }
                    if (newWorkOrderDtoForHtml.startDate < newWorkOrderDtoForHtml.endDate) {
                        pushToWorkOrderDtoForHtmlList_DAILY(i + workOrder.per, workOrderDtoForHtmlList);
                    }
                }
            }

            // }


        }
        if (end !== workOrderList.length) {
            setTimeout(() => {
                this.addResWorkOrderToList(workOrderList, start + 50, end + 50, startDateGregorian,
                    startJForReturn, endDateGregorian, enJForReturn, userList)
            }, 1);
        } else {
            this.loadingGetListForCalendarSchedule = false;

        }

    }

    ShowInModalUserList(userList: UserDto[]) {
        this.userListForShowInModal = userList;
        setTimeout(() => {
            ModalUtil.showModal('userListForShowInModalId');
        }, 100);
    }

// انتخاب برای نمایش تکی
    selectSelectedItemIdForAction(workOrder: WorkOrderDtoForHtml) {
        this.selectedItemIdForAction = workOrder.id;
        if (workOrder.type === 'past' || workOrder.type === 'past-notDone') {
            this.viewMode = 'pastGetOne';
        } else if (workOrder.type === 'future') {
            this.viewMode = 'futureGetOne';
        }

    }

    public ngAfterViewInit(): void {
        this.changeMonth('selectCurrentDay');
    }

    public ngOnDestroy(): void {
    }
}

export class GetListForCalendarScheduleDto {
    userList: UserDto[];
    workOrder: WorkOrderDto[];

}

export class UserDto {
    id: string;
    family: string;
    name: string;
}

export class WorkOrderDto {
    assetId: string;
    assetName: string;
    endDate: string;
    nexDate: any;
    frequency: string;
    id: string;
    per: number;
    startDate: string;
    userIdList: string[];
    estimateCompletionDate: number; // تخمین

}

export class WorkOrderDtoForHtml {
    assetId: string;
    assetName: string;
    frequency: string;
    id: string;
    per: number;
    startDate: any;
    endDate: string;
    nexDate: any;
    type: string;
    userList: UserDto[];
    delay: number;
    estimateCompletionDate: number; // تخمین
}
