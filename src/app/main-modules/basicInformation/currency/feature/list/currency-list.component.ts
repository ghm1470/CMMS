import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../../model/dto/currency';
import {CurrencyService} from '../../endpoint/currency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, Paging, Toolkit2} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-currency-list',
    templateUrl: './currency-list.component.html',
    styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit, OnDestroy {

    @Input() listOnCallback: () => any;
    //
    currencyName: '';
    selectedItemForDelete = new DeleteModel();
    toolKit2 = Toolkit2;
    roleList = new TokenRoleList();

    pageSize = 10;
    pageIndex = 0;
    length = -1;
    isoCode: string;
    title: string;
    entityList: Currency[] = [];
    loading = false;

    constructor(public entityService: CurrencyService,
                public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public router: Router) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.pageIndex) {
                this.pageIndex = params.pageIndex;
                this.pageSize = params.pageSize;
            }
            this.getPage();
        });
    }

    ngOnInit() {
        // this.getAll();
        this.getRoleListKey();
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    chooseSelectedItemForEdit(item: Currency) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, currencyId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: Currency) {
        this.router.navigate([item.id, ActionMode.VIEW], {
            relativeTo: this.activatedRoute
        });
    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({currencyId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {


                if (res === 'true') {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                    DefaultNotify.notifySuccess('با موفقیت حذف شد', '', NotiConfig.notifyConfig);
                } else if (res !== 'true') {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger('این واحد پولی در بودجه ها مورد استفاده قرار گرفته و قابل حذف نمی باشد.', '', NotiConfig.notifyConfig);
                }
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    // getAll() {
    //     this.loading = true;
    //     this.entityService.getAll()
    //         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //         if (!isNullOrUndefined(res) && res.length) {
    //             this.loading = false;
    //             this.currencyList = res;
    //         }
    //     });
    // }
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
            },
        });

    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        const dto = {
            title: this.title,
            isoCode: this.isoCode
        };
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

            }, error => {
                this.loading = false;
            });
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }


}
