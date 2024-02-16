import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {ModalUtil} from '@angular-boot/widgets';
import {DefaultNotify, ModalSize, Paging} from '@angular-boot/util';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {ReportingUserService} from '../../endpoint/reporting-user.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {ReportUserDto} from '../../model/report-userDTO';
import {NotifyConfig} from "@angular-boot/util/lib/nb-util/toolkit/notify";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-user-reporting',
    templateUrl: './user-reporting.component.html',
    styleUrls: ['./user-reporting.component.scss']
})
export class UserReportingComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private entityService: ReportingUserService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                public router: Router,
                private cacheService: CacheService) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.userId ? this.getPageDto.userId = params.userId : '';
            if (this.getPageDto.userId) {
                if (this.dateChek()) {
                    this.getPage();
                    this.countUsedPartOfWorkOrder();
                }
            }

        });
    }

    moment = Moment;
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;
    public loading: boolean;
    entityList: ReportUserDto.GetPageAssetReport[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    getPageDto = new ReportUserDto.TotalWorkedTimeOfPersonnel();
    roleList = new TokenRoleList();
    userList: UserDto.GetUserWithUserType[] = [];

    totalNumber: number;

    dateFrom: any;
    dateUntil: any;

    workOrderId: string;
    showModalBody = false;

    ngOnInit() {
        this.getRoleListKey();
        this.getUserWithUserType();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    loadingGetUsers = false;

    getUserWithUserType() {
        this.loadingGetUsers = true;
        this.userService.getUserWithUserType().subscribe((res: UserDto.GetUserWithUserType[]) => {
            this.loadingGetUsers = false;

            if (res) {
                this.userList = res;
                for (const user of this.userList) {
                    user.name = user.name + ' ' + user.family + ' - ' + user.userTypeName;
                }
            }
        }, error => {
            this.loadingGetUsers = false;
        });
    }

    countUsedPartOfWorkOrder() {
        const dto = new ReportUserDto.TotalWorkedTimeOfPersonnel();
        dto.userId = this.getPageDto.userId;
        if (this.dateFrom) {
            dto.from = this.moment.convertJaliliToIsoDateWithTime(this.dateFrom);
        }
        if (this.dateFrom) {
            dto.until = this.moment.convertJaliliToIsoDateWithTime(this.dateUntil);
        }
        this.entityService.TotalWorkedTimeOfPersonnel(dto).subscribe((res: ReportUserDto.TotalWorkedTimeDTO) => {
            if (res) {
                this.totalNumber = Math.floor(res.totalWorkedTime / 60) + ' ساعت و  ' + res.totalWorkedTime % 60 + ' دقیقه ' as any;

            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        const dto = new ReportUserDto.TotalWorkedTimeOfPersonnel();
        dto.userId = this.getPageDto.userId;

        if (this.dateFrom) {
            dto.from = this.moment.convertJaliliToIsoDateWithTime(this.dateFrom);
        }
        if (this.dateUntil) {
            dto.until = this.moment.convertJaliliToIsoDateWithTime(this.dateUntil);
        }
        this.entityService.personnelFunction({
            paging,
            totalElements:-1,
        }, dto)
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                    for (const entity of this.entityList) {
                        entity.duration = Math.floor(entity.duration / 60) + ' ساعت و  ' + entity.duration % 60 + ' دقیقه ' as any;
                    }
                }
            }, error => {
                this.loading = false;
            });
    }

    search() {
        if (this.pageIndex == 0) {
            if (this.getPageDto.userId) {
                if (this.dateChek()) {
                    this.getPage();
                    this.countUsedPartOfWorkOrder();
                }
            } else {

                DefaultNotify.notifyDanger('نام کاربر را انتخاب کنید', '', NotiConfig.notifyConfig);
            }
        } else {
            this.pageIndex = 0;
            this.navigate();
        }

    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                userId: this.getPageDto.userId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    ngAfterViewInit(): void {
        this.setJqueryDate();
    }

    dateChek() {
        if (!this.dateFrom || !this.dateUntil) {
            return true;
        }
        if (this.dateFrom > this.dateUntil) {
            DefaultNotify.notifyDanger('بازه زمانی درست انتخاب نشده است.', '', NotiConfig.notifyConfig);
            return false;
        } else {
            return true;
        }
    }

    setJqueryDate() {
        setTimeout(e1 => {

            $('#dateFrom').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: true, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#dateFrom'),
                disableBeforeToday: false,
                textFormat: 'yyyy/MM/dd  -  HH:mm',
            }).on('change', (e) => {
                this.dateFrom = $(e.currentTarget).val();
                // this.getAllByFilterAndPagination.from =
                //     this.myMoment.convertJaliliToIsoDateWithTime($(e.currentTarget).val());
            });
            $('#dateUntil').azPersianDateTimePicker({
                Placement: 'left', // default is 'bottom'
                Trigger: 'focus', // default is 'focus',
                enableTimePicker: true, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#dateUntil'),
                disableBeforeToday: false,
                textFormat: 'yyyy/MM/dd  -  HH:mm',
            }).on('change', (e) => {
                this.dateUntil = $(e.currentTarget).val();

                console.log($(e.currentTarget).val());
            });
        }, 10);

    }

    public ngOnDestroy(): void {
    }

    public showDetail(asset: ReportUserDto.GetPageAssetReport) {
        this.workOrderId = asset.workOrderId;
        this.showModalBody = false;
        setTimeout(() => {
            this.showModalBody = true;
            setTimeout(() => {
                ModalUtil.showModal(this.modalId);
            }, 100);
        }, 100);

    }
}
