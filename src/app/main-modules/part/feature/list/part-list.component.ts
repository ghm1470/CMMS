import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../../model/dto/part';
import {PartService} from '../../endpoint/part.service';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {FileDataTable} from "../../../../shared/export-file/export-file/export-file.component";
import {GetAllWorkTable} from "../../../worktable/feature/list/worktable-list.component";
import {Moment} from "../../../../shared/shared/tools/date/moment";

declare var $: any;

@Component({
    selector: 'app-part-list',
    templateUrl: './part-list.component.html',
    styleUrls: ['./part-list.component.scss']
})
export class PartListComponent implements OnInit, OnDestroy, OnChanges {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    actionMode = ActionMode;

    entityList: PartDto.GetAll[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    partForSearch: PartDtoForSearch = new PartDtoForSearch();
    ////////////دریافت  pdf,excel
    entityListForReport: GetAllWorkTableForReport[] = [];
    fileDataTableList: FileDataTable[] = [
        {thTitle: 'نام ', tdTitle: 'partName'},
        {thTitle: 'کد', tdTitle: 'partCode'},
    ];
    // {thTitle: 'تعداد موجودی', tdTitle: 'numberOfInventory'},
    // {thTitle: 'تاریخ ایجاد ', tdTitle: 'registrationDateJalali'}

    ////////////دریافت  pdf,excel
    constructor(private entityService: PartService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        const partForSearch = sessionStorage.getItem('partForSearch');
        if (partForSearch) {
            this.partForSearch = JSON.parse(partForSearch);
            if (this.partForSearch.partName || this.partForSearch.partCode) {
                setTimeout(e => {
                    $('#part-searchBtn').click();
                }, 1);
            }
        }
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getPage();

        });
    }

    ngOnInit() {
        this.getRoleListKey();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        if (this.partForSearch.partName || this.partForSearch.partCode) {
            sessionStorage.setItem('partForSearch', JSON.stringify(this.partForSearch));
        } else {
            sessionStorage.removeItem('partForSearch');
        }
        this.entityService.getAllPartsWithOutInventoryAndLoadedInventories(this.partForSearch, {
            paging,
            totalElements: -1,
        })
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
            this.getPage();
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
                term: this.term,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: PartDto.GetAll) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.partId},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: PartDto.GetAll, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.partId;
        this.selectedItemForDelete.title = ' آیا    ' + item.partName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({partId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === true) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                } else {
                    DefaultNotify.notifyDanger('این آیتم قابل حذف نمی باشد.', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    EmActivityGetPageForExcel() {
        this.entityService.getAllForExcel(this.partForSearch).pipe(takeUntilDestroyed(this)
        ).subscribe((res) => {
            const list = res;
            // list.map(e => {
            //     e.registrationDateJalali = Moment.convertIsoToJDateWithTimeEnToFa(e.registrationDate);
            // });
            this.entityListForReport = list;
        }, error => {
        });
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
}

export class PartDtoForSearch {
    partName: string;
    partCode: string;
    inventoryCode: string;
    row: string;
    corridor: string;
    warehouse: string;
}

export class GetAllWorkTableForReport {
    id: string;
    name: string;
    numberOfInventory: string;
    partCode: string;
    registrationDate: any;
    registrationDateJalali: any;
}
