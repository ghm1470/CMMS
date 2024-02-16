import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {AssetTemplateService} from '../../endpoint/asset-template.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {AssetTemplateDto} from '../../model/dto/assetTemplateDto';
import {ModalUtil} from '@angular-boot/widgets';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {CategoryService} from '../../../category/endpoint/category.service';


@Component({
    selector: 'app-asset-template-list',
    templateUrl: './asset-template-list.component.html',
    styleUrls: ['./asset-template-list.component.scss']
})
export class AssetTemplateListComponent implements OnInit, OnDestroy {

    @Input() readService: string;
///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    parentCategoryId: string;
    subCategoryId: string;

    entityList: AssetTemplateDto.Create[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    categoryList: CategoryDto.Create[] = [];
    subCategoryList: CategoryDto.Create[] = [];

    constructor(private entityService: AssetTemplateService,
                public categoryService: CategoryService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            params.parentCategoryId ? this.parentCategoryId = params.parentCategoryId : '';
            params.subCategoryId ? this.subCategoryId = params.subCategoryId : '';
            this.getPage();
        });
    }

    ngOnInit() {
        this.getRoleListKey();
        // if (this.readService) {
        const category = new CategoryDto.Create();
        category.id = 'ROOT';
        category.title = 'دسته اصلی';
        this.categoryList.push(category);
        this.getAllParentCategory();
        // }
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
            term: this.term,
            parentCategoryId: this.parentCategoryId,
            subCategoryId: this.subCategoryId
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
                parentCategoryId: this.parentCategoryId,
                subCategoryId: this.subCategoryId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: AssetTemplateDto.Create) {
        this.entityService.checkIfAssetTemplateUsedInAsset({assetTemplateId: item.id}).subscribe((res: any) => {
            if (res === 'مجاز به ویرایش میباشد ') {
                this.router.navigate(['action'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            } else {
                DefaultNotify.notifyDanger(res);
            }
        });
    }


    chooseSelectedItemForViewInfo(item: AssetTemplateDto.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: AssetTemplateDto.Create, i) {
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
            this.entityService.delete({assetTemplateId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger(res);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    getAllParentCategory() {
        this.categoryService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (res && res.length) {
                    for (const item of res) {
                        this.categoryList.push(item);
                    }
                }
            });
    }

    changeCategory() {
        this.subCategoryList = [];
        this.subCategoryId = null;
        if (this.parentCategoryId) {
            this.categoryService.getChildrenById({parentId: this.parentCategoryId}).subscribe((res: any) => {
                if (res) {
                    this.subCategoryList = res;
                    this.subCategoryId = null;
                }
            });
        }
    }

// }
    ngOnDestroy(): void {
    }
}


//////////////////////////////////////
//     @Input() userId: string;
//     @Input() readService: string;
//     componentData: ComponentData;
//     totalElements = 0;
//     totalPages = 0;
//     loading: boolean;
//     toolkit2 = Toolkit2;
//     roleList = new TokenRoleList();
//     selectedItemForDelete = new DeleteModel();
//     assetTemplateList: AssetTemplateDto.Create [] = [];
//     categoryList: CategoryDto.Create[] = [];
//     subCategoryList: CategoryDto.Create[] = [];
//
//     constructor(
//         protected _Router: Router,
//         protected _ActivatedRoute: ActivatedRoute,
//         public assetTemplateService: AssetTemplateService,
//         public categoryService: CategoryService,
//         private cacheService: CacheService,
//     ) {
//         super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//         this.componentData = new ComponentData();
//         this.receiveData();
//
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     ngOnInit() {
//         this.getRoleListKey();
//
//     }
//
//     ngOnChanges() {
//         if (this.readService) {
//             this.getAllParentCategory();
//         }
//     }
//
//     getAllParentCategory() {
//         this.categoryService.getAll().pipe(takeUntilDestroyed(this))
//             .subscribe((res: any) => {
//                 if (res && res.length) {
//                     for (const item of res) {
//                         this.categoryList.push(item);
//                     }
//                 }
//             });
//     }
//
//     ngAfterViewInit() {
//     }
//
//
//     getRoleListKey() {
//         this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             if (res) {
//                 this.roleList = res;
//             }
//         });
//     }
//
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.loading = true;
//         this.getAssetTemplateList();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//
//     getAssetTemplateList() {
//         this.loading = true;
//         this.assetTemplateService.getAllByPagination({
//             paging: this.componentData.myQuery.paging,
//             totalElements: this.totalElements,
//             term: this.componentData.myQuery.term,
//             parentCategoryId: this.componentData.myQuery.parentCategoryId,
//             subCategoryId: this.componentData.myQuery.subCategoryId
//         }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<AssetTemplateDto.Create>) => {
//             this.loading = false;
//             if (res) {
//                 this.assetTemplateList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//
//         });
//     }
//
//     chooseSelectedItemForEdit(item: AssetTemplateDto.Create) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, assetTemplateId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForViewInfo(item: AssetTemplateDto.Create) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.VIEW, assetTemplateId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: AssetTemplateDto.Create) {
//         this.router.navigate([item.id, ActionMode.VIEW], {
//             relativeTo: this.activatedRoute
//         });
//     }
//
//
//     deleteItem(event) {
//         if (event) {
//             this.selectedItemForDelete.loading = true;
//             this.assetTemplateService.delete({assetTemplateId: this.selectedItemForDelete.id})
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//                 if (res !== true) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                     DefaultNotify.notifyDanger('این قالب دارایی در قسمت دارایی ها استفاده شده است و قابل حذف نمی باشد.');
//                 } else if (res === true) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                     this.assetTemplateList = this.assetTemplateList.filter((e) => {
//                         return e.id !== this.selectedItemForDelete.id;
//                     });
//                     DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//                 }
//             });
//         } else {
//             ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//     }
//
//     showModalDelete(item, i) {
//         this.selectedItemForDelete.loading = false;
//
//         this.selectedItemForDelete.id = item.id;
//         this.selectedItemForDelete.title = ' آیا وضعیت درخواست کار    ' + item.name + ' حذف  شود؟ ';
//         this.selectedItemForDelete.index = i;
//         setTimeout(e => {
//             ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//         }, 10);
//     }
//
//
//     setPage(pageNumber) {
//         super.setToQueryParams({page: pageNumber, size: this.componentData.myQuery.paging.size});
//     }
//
//
//     search() {
//         this.totalElements = 0;
//         super.setToQueryParams({
//             page: 0,
//             size: 10,
//             term: this.componentData.myQuery.term,
//             parentCategoryId: this.componentData.myQuery.parentCategoryId,
//             subCategoryId: this.componentData.myQuery.subCategoryId,
//         });
//     }
//
//     ngOnDestroy(): void {
//     }
//
//     changeCategory() {
//         this.categoryService.getChildrenById({parentId: this.componentData.myQuery.parentCategoryId}).subscribe((res: any) => {
//             if (res) {
//                 this.subCategoryList = res;
//             }
//         });
//     }
// }
//
//
// export class ComponentData {
//     myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
// }
//
// export namespace CourseParam {
//     export class RouteParam {
//
//     }
//
//     export class QueryParam {
//         paging: Paging;
//         term;
//         parentCategoryId;
//         subCategoryId
//
//         constructor() {
//             this.paging = new Paging();
//             this.term = null;
//             this.parentCategoryId = null;
//             this.subCategoryId = null;
//             this.paging.page = 0;
//             this.paging.size = 10;
//         }
//     }
// }
