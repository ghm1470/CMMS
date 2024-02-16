import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, ListHelper, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ChargeDepartment} from '../../model/charge-department';
import {ChargeDepartmentService} from '../../endpoint/charge-department.service';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-responsible-department-list',
    templateUrl: './charge-department-list.component.html',
    styleUrls: ['./charge-department-list.component.scss']
})
export class ChargeDepartmentListComponent implements OnInit, OnDestroy {


    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: ChargeDepartment[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();
    codeSearch: string;

    roleList = new TokenRoleList();

    constructor(private entityService: ChargeDepartmentService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.pageIndex) {
                this.pageIndex = params.pageIndex;
                this.pageSize = params.pageSize;
                this.term = params.term;
            }
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
        this.entityService.getAllDepartment({
            paging,
            totalElements:-1,
            term: this.term,
            code: this.codeSearch,
        }).subscribe((res: any) => {
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

    chooseSelectedItemForEdit(item: ChargeDepartment) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, departmentId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + ' ` ' + item.title + ' ` ' + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({chargeDepartmentId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === 'true') {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                } else {
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }


}

