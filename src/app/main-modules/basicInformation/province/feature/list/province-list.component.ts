import {Component, OnDestroy, OnInit} from '@angular/core';
import {Province} from '../../../../dashboard/model/dto/province';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, Paging, Toolkit2} from '@angular-boot/util';
import {ProvinceService} from '../../endpoint/province.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-province-list',
    templateUrl: './province-list.component.html',
    styleUrls: ['./province-list.component.scss']
})

export class ProvinceListComponent implements OnInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: Province[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(private entityService: ProvinceService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
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

        this.entityService.getAllByPagination({
            paging,
            totalElements:-1,
            term: this.term
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    this.loading = false;
                }
                ;
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

    chooseSelectedItemForEdit(item: Province) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: Province, i) {
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
            this.entityService.delete({provinceId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === 'true') {
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
                    DefaultNotify.notifyDanger('این استان قابل حذف نمی باشد. برای حذف ابتدا شهر های این استان را حذف نمایید.', '', NotiConfig.notifyConfig);
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

