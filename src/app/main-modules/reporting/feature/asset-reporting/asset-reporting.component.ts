import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {ModalUtil} from '@angular-boot/widgets';
import {DefaultNotify, ModalSize, Paging} from '@angular-boot/util';
import {ReportingAssetService} from '../../endpoint/reporting-asset.service';
import {ReportAssetDto} from '../../model/report-assetDTO';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {PartService} from '../../../part/endpoint/part.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {isNullOrUndefined} from "util";

declare var $: any;

@Component({
    selector: 'app-asset-reporting',
    templateUrl: './asset-reporting.component.html',
    styleUrls: ['./asset-reporting.component.scss']
})
export class AssetReportingComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private entityService: ReportingAssetService,
                private partService: PartService,
                private activatedRoute: ActivatedRoute,
                public router: Router,
                private cacheService: CacheService) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.partId ? this.getPageDto.partId = params.partId : '';
            if (this.getPageDto.partId) {
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
    entityList: ReportAssetDto.GetPageUserReport[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    getPageDto = new ReportAssetDto.UsedPartOfWorkOrderGetPageDto();
    roleList = new TokenRoleList();
    partList: any[] = [];

    totalNumber: number;

    dateFrom: any;
    dateUntil: any;

    workOrderId: string;
    showModalBody = false;

    ngOnInit() {
        this.getRoleListKey();

        /// قطعات
        this.loadSearchPart();
        this.pagingGetAllPart.size = 10;
        this.pagingGetAllPart.page = 0;
        setTimeout(() => {
            this.searchSubject.next('');
        }, 10);
        /// قطعات!!!!!!
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    // getAllPart() {
    //     this.partService.getAllPSB().subscribe((res: any) => {
    //         this.partList = res.partList;
    //     });
    // }
    pagingGetAllPart = new Paging();
    totalElementsGetAllPart = -1
    searchSubject = new Subject<string>();
    searchTextValuePart: string;
    loadingExecSearch = false;


    execSearch(event) {
        if (isNullOrUndefined(event)) {
            if (this.searchTextValuePart !== '') {
                this.searchSubject.next('');
            }
        } else if (event.term) {
            this.searchSubject.next(event.term);
        }
    }


    loadSearchPart() {
        this.searchSubject.pipe(
            debounceTime(1000)
        ).subscribe((searchTextValue: string) => {
            this.searchTextValuePart = searchTextValue;
            this.pagingGetAllPart.page = 0;
            this.totalElementsGetAllPart = -1;
            this.getAllPart();
        });


    }

    getAllPart() {
        if (this.totalElementsGetAllPart === this.partList.length) {
            return;
        }

        this.loadingExecSearch = true;
        this.partService.getAllPartByPagination(
            {
                paging: this.pagingGetAllPart,
                totalElements: this.totalElementsGetAllPart,
                term: this.searchTextValuePart
            }).subscribe((res: any) => {
            this.loadingExecSearch = false;

            if (res) {
                if (this.pagingGetAllPart.page === 0) {
                    this.partList = res.content;
                } else {
                    this.partList = this.partList.concat(res.content);
                }
                this.pagingGetAllPart.page++;
                this.totalElementsGetAllPart = res.totalElements;
            }
        }, error => {
            this.loadingExecSearch = false;
        });


    }

    countUsedPartOfWorkOrder() {
        const dto = new ReportAssetDto.UsedPartOfWorkOrderGetPageDto();
        dto.partId = this.getPageDto.partId;
        if (this.dateFrom) {
            dto.from = this.moment.convertJaliliToIsoDateWithTime(this.dateFrom);
        }
        if (this.dateFrom) {
            dto.until = this.moment.convertJaliliToIsoDateWithTime(this.dateUntil);
        }
        this.entityService.countUsedPartOfWorkOrder(dto).subscribe((res: ReportAssetDto.CountUsedPartDTO) => {
            if (res) {
                this.totalNumber = res.totalNumber;
            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        const dto = new ReportAssetDto.UsedPartOfWorkOrderGetPageDto();
        dto.partId = this.getPageDto.partId;
            if (this.dateFrom) {
                dto.from = this.moment.convertJaliliToIsoDateWithTime(this.dateFrom);
            }
            if (this.dateUntil) {
                dto.until = this.moment.convertJaliliToIsoDateWithTime(this.dateUntil);
            }
        this.entityService.usedPartOfWOrkOrder({
            paging,
            totalElements:-1,
        }, dto)
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                }

            }, error => {
                this.loading = false;
            });
    }

    search() {
        if (this.pageIndex == 0) {
            if (this.getPageDto.partId) {
                if (this.dateChek()) {
                    this.getPage();
                    this.countUsedPartOfWorkOrder();
                }
            } else {
                DefaultNotify.notifyDanger('نام قطعه را انتخاب کنید', '', NotiConfig.notifyConfig);
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
                partId: this.getPageDto.partId,
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
                console.log();
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

    public showDetail(asset: ReportAssetDto.GetPageUserReport) {
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
