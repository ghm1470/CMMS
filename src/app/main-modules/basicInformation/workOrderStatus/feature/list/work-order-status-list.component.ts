import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {WorkOrderStatusService} from '../../endpoint/work-order-status.service';
import {WorkOrderStatus} from '../../model/dto/workOrderStatus';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {EnumObject} from '../../../../../_base/utility/enum/enum-object';
import {WorkOrderStatusEnum} from "../../model/helper/workOrderStatusEnum";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-work-order-status-list',
    templateUrl: './work-order-status-list.component.html',
    styleUrls: ['./work-order-status-list.component.scss']
})
export class WorkOrderStatusListComponent implements OnInit, OnDestroy {

///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;

    entityList: WorkOrderStatus[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    workOrderSearch = new WorkOrderSearch();
    statusList = Object.keys(WorkOrderStatusEnum);

    constructor(private entityService: WorkOrderStatusService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.title ? this.workOrderSearch.title = params.title : '';
            params.workOrderStatus ? this.workOrderSearch.workOrderStatus = params.workOrderStatus : '';
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

        this.entityService.getAllByPagination({
            paging,
            totalElements:-1,
            term: this.workOrderSearch.title,
            status: this.workOrderSearch.workOrderStatus
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
                title: this.workOrderSearch.title,
                workOrderStatus: this.workOrderSearch.workOrderStatus,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: WorkOrderStatus) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, workOrderStatusId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: WorkOrderStatus, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({workOrderStatusId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger('این آیتم قابل حذف نمی باشد. ', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }


    //////////////////////////////////////

}

export class WorkOrderSearch {
    title: string;
    workOrderStatus: any;

}

