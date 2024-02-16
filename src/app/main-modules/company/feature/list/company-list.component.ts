import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, isNullOrUndefined, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {Activity} from '../../../activity/model/activity';
import {ActivityService} from '../../../activity/service/activity.service';
import {CompanyDto} from '../../model/dto/companyDto';
import {CompanyService} from '../../endpoint/company.service';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import {CityService} from '../../../basicInformation/city/endpoint/city.service';
import {Province} from '../../../dashboard/model/dto/province';
import {City} from '../../../basicInformation/city/model/city';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: CompanyDto.GetPage[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    provinceList: Province[] = [];
    cityList: City[] = [];
    companySearchDTO = new CompanySearchDTO();

    constructor(private entityService: CompanyService,
                public router: Router,
                private cacheService: CacheService,
                private provinceService: ProvinceService,
                private cityService: CityService,
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
        this.getAllProvince();

    }


    ngOnChanges() {
        // if (this.readSearchService) {
        // }
    }

    ngAfterViewInit() {
        if (this.companySearchDTO.cityId ||
            this.companySearchDTO.provinceId ||
            this.companySearchDTO.companyCode ||
            this.companySearchDTO.companyName) {
            $('#company-search').addClass('show');
            if (this.companySearchDTO.cityId || this.companySearchDTO.provinceId) {
                this.getAllProvince();
                if (this.companySearchDTO.cityId) {
                    this.getCityList();
                }
            }
        }
    }

    getAllProvince() {
        // this.readSearchService = true;
        this.provinceService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {

                if (!isNullOrUndefined(res)) {
                    this.provinceList = res;
                }
            });
    }


    getCityList() {
        this.cityList = [];
        if (this.companySearchDTO.provinceId) {
            this.cityService.getAllByProvinceId({provinceId: this.companySearchDTO.provinceId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    this.cityList = res;
                }
            });
        }
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

        this.entityService.getAllByPagination(this.companySearchDTO, {
            paging,
            totalElements:-1,
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                this.loading = false;
                if (res) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
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

    chooseSelectedItemForEdit(item: CompanyDto.GetPage) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForSee(item: CompanyDto.GetPage) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: CompanyDto.GetPage, i) {
        console.log(item);
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
            this.entityService.delete({companyId: this.selectedItemForDelete.id})
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
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
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


export class CompanySearchDTO {
    companyName: string;
    companyCode: string;
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
}
