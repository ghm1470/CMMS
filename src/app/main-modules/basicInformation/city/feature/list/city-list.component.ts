import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Province} from '../../../../dashboard/model/dto/province';
import {City} from '../../model/city';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {ActionMode, DefaultNotify, Paging, Toolkit2} from '@angular-boot/util';
import {CityService} from '../../endpoint/city.service';
import {ProvinceService} from '../../../province/endpoint/province.service';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';

@Component({
    selector: 'app-city-list',
    templateUrl: './city-list.component.html',
    styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit, OnDestroy {

    lat = 35.6970118;
    lng = 51.4899051;

    @Input() listOnCallback: () => any;
    provinceList: Province[] = [];
    // cityList: City[] = [];
    selectedProvinceId = '-1';
    toolKit2 = Toolkit2;
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: City[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(public provinceService: ProvinceService,
                public entityService: CityService,
                public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public router: Router) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.selectedProvinceId = '-1';
            params.selectedProvinceId ? this.selectedProvinceId = params.selectedProvinceId : '';
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getAllProvince();
        });
    }

    ngOnInit() {
        this.getRoleListKey();
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getAllProvince() {
        this.provinceService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: Province[]) => {

            if (!isNullOrUndefined(res)) {
                this.provinceList = res;
                if (this.selectedProvinceId === '-1') {
                    this.selectedProvinceId = res[0].id;
                }
                // this.lat = res[0].location.lat;
                // this.lng = res[0].location.lng;
                this.getPage(res[0]);
            }
        });
    }

    chooseSelectedItemForEdit(item: City) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, cityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: City) {
        this.router.navigate([item.id, ActionMode.VIEW], {
            relativeTo: this.activatedRoute
        });
    }


    ngOnDestroy(): void {
    }

    // getCityList(event: any) {
    //     // this.lat = event.location.lat;
    //     // this.lng = event.location.lng;
    //     this.cityList = [];
    //     this.loading = true;
    //     this.entityService.getAllByProvinceId({provinceId: this.selectedProvinceId})
    //         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //         this.loading = false;
    //         if (!isNullOrUndefined(res)) {
    //             this.cityList = res;
    //         }
    //     });
    // }


    getPage(event?) {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getAllByPaginationByProvinceId({
            provinceId: this.selectedProvinceId,
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
                selectedProvinceId: this.selectedProvinceId,
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


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({cityId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
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
                } else if (res !== 'true') {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger('حذف این شهر امکان پذیر نیست. برای حذف ابتدا باید سازمان های موجود در این شهر حذف شوند. ');
                }
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


}
