import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {AssetCategoryDto} from '../../model/asset-category-dto';
import {AssetCategoryService} from '../../endpoint/asset-category.service';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-asset-category-list',
    templateUrl: './asset-category-list.component.html',
    styleUrls: ['./asset-category-list.component.scss']
})
export class AssetCategoryListComponent implements OnInit, OnDestroy {
    actionMode = ActionMode;

///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: AssetCategoryDto.GetList[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(private entityService: AssetCategoryService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        const assetCategoryForSearch = sessionStorage.getItem('assetCategoryForSearch');
        if (assetCategoryForSearch) {
            this.term = assetCategoryForSearch;
            if (this.term) {
                setTimeout(e => {
                    $('#assetCategory-searchBtn').click();
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
        const dto = new AssetCategoryDto.NewCategoryForGetAllByPagination();
        dto.title = this.term;

        if (this.term) {
            sessionStorage.setItem('assetCategoryForSearch', this.term);
        } else {
            sessionStorage.removeItem('assetCategoryForSearch');
        }
        this.entityService.getAllByPagination({
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

    chooseSelectedItemForEdit(item: AssetCategoryDto.GetList) {
        this.entityService.checkIfCategoryUsedInAsset({categoryId: item.id}).subscribe((res: boolean) => {
            if (res) {
                DefaultNotify.notifyDanger(' خانواده گروه انتخاب شده در قسمت دارایی ها استفاده گردیده  و قابل ویرایش نمی باشد', '', NotiConfig.notifyConfig);
            } else {
                this.router.navigate(['action'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            }
        });

    }


    showModalDelete(item: AssetCategoryDto.GetList, i) {
        this.entityService.checkIfCategoryUsedInAsset({categoryId: item.id}).subscribe((res: boolean) => {
            if (res) {
                DefaultNotify.notifyDanger(' خانواده گروه انتخاب شده در قسمت دارایی ها استفاده گردیده  و قابل حذف نمی باشد', '', NotiConfig.notifyConfig);
            } else {
                console.log(item);
                this.selectedItemForDelete.loading = false;

                this.selectedItemForDelete.id = item.id;
                this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
                this.selectedItemForDelete.index = i;
                setTimeout(e => {
                    ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
                }, 10);
            }
        })


    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({categoryId: this.selectedItemForDelete.id})
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


//////////////////////////////////////
