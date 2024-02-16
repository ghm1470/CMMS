import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
    ActionMode,
    DefaultNotify,
    EnumHandle, ModalSize,
    Paging
} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {CategoryDto} from '../../model/dto/categoryDto';
import {CategoryService} from '../../endpoint/category.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import CategoryType = CategoryDto.CategoryType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy, OnChanges {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    parentId: string;
    categoryType: CategoryType;
    entityList: CategoryDto.GetAll [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    categoryTypeList: any[] = [];
    categoryList: CategoryDto.Create[] = [];

    @Input() readService: boolean;

    constructor(private entityService: CategoryService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.categoryTypeList = EnumHandle.getAsValueTitleList(CategoryDto.CategoryType);

        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.categoryType ? this.categoryType = params.categoryType : '';
            params.parentId ? this.parentId = params.parentId : '';
            this.getPage();

        });
    }

    ngOnInit() {
        // if (this.readService) {
        //     this.getAllParentCategory();
        // }
        const category = new CategoryDto.Create();
        category.id = 'ROOT';
        category.title = 'دسته اصلی';
        this.categoryList.push(category);
        this.getAllParentCategory();
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
            term: this.term,
            parentId: this.parentId,
            categoryType: this.categoryType
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
                categoryType: this.categoryType,
                parentId: this.parentId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: CategoryDto.GetAll) {
        this.entityService.checkIfCategoryHasSubCategoryOrAssetTemplate({categoryId: item.id}).subscribe((res: any) => {
            if (res === 'مجاز به ویرایش میباشد ') {
                this.router.navigate(['action'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            } else {
                DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
            }
        });
    }
  chooseSelectedItemForView(item: CategoryDto.GetAll) {
      this.router.navigate(['action'], {
          queryParams: {mode: ActionMode.VIEW, entityId: item.id},
          relativeTo: this.activatedRoute
      });
  }

    showModalDelete(item: CategoryDto.GetAll, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
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

    getAllParentCategory() {
        this.entityService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (res && res.length) {
                    for (const item of res) {
                        this.categoryList.push(item);
                    }
                }
            });
    }

    titleOfCategory: string;
    properties: any[] = [];
    MyModalSize = ModalSize;

    openModalProperties(properties, title) {
        this.titleOfCategory = title;
        this.properties = properties;
        ModalUtil.showModal('modalPropertiesId');
    }

    ngOnChanges() {
    }

    ngOnDestroy(): void {
    }


}


//////////////////////////////////////
//
//   @Input() userId: string;
//   @Input() readService: boolean;
//   componentData: ComponentData;
//   totalElements = 0;
//   totalPages = 0;
//   loading = false;
//   dataOfCategoryList: CategoryDto.GetAll [] = [];
//   MyModalSize = ModalSize;
//   selectedItemForDelete = new DeleteModel();
//   modalPropertiesId: string;
//   roleList = new TokenRoleList();
//   categoryTypeList: any[] = [];
//   titleOfCategory: string;
//   properties: any[] = [];
//   categoryList: CategoryDto.Create[] = [];
//
//
//   constructor(protected _Router: Router,
//               protected _ActivatedRoute: ActivatedRoute,
//               public categoryService: CategoryService,
//               private cacheService: CacheService,
//   ) {
//     super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//     this.categoryTypeList = EnumHandle.getAsValueTitleList(CategoryDto.CategoryType);
//     this.componentData = new ComponentData();
//     this.receiveData();
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   ngOnInit() {
//     this.getRoleListKey();
//   }
//   ngOnChanges() {
//     if (this.readService) {
//       this.getAllParentCategory();
//     }
//   }
//
//
//   getRoleListKey() {
//     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//       if (res) {
//         this.roleList = res;
//       }
//     });
//   }
//
//
//   getAllParentCategory() {
//     this.categoryService.getAll().pipe(takeUntilDestroyed(this))
//       .subscribe((res: any) => {
//         if (res && res.length) {
//           for (const item of res) {
//             this.categoryList.push(item);
//           }
//         }
//       });
//   }
//
//
//   onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//   }
//
//   onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//     this.componentData.myQuery = queryParam;
//     this.loading = true;
//     if (isNullOrUndefined(queryParam.userId)) {
//       const users = JSON.parse(sessionStorage.getItem('user'));
//       this.userId = users.id;
//     } else {
//       this.userId = queryParam.userId;
//     }
//     this.getListSelf();
//
//   }
//
//   getListSelf(options?: any) {
//     this.loading = true;
//     this.dataOfCategoryList = [];
//     const getAllByFilterAndPaginationCategory = new GetAllByFilterAndPaginationCategory();
//     if (this.componentData.myQuery.getAllByFilterAndPaginationCategory.title !== null) {
//       getAllByFilterAndPaginationCategory.title = this.componentData.myQuery.getAllByFilterAndPaginationCategory.title;
//     }
//     if (this.componentData.myQuery.getAllByFilterAndPaginationCategory.parentId !== null) {
//       getAllByFilterAndPaginationCategory.parentId = this.componentData.myQuery.getAllByFilterAndPaginationCategory.parentId;
//     }
//     if (this.componentData.myQuery.getAllByFilterAndPaginationCategory.categoryType !== null) {
//       getAllByFilterAndPaginationCategory.categoryType = this.componentData.myQuery.getAllByFilterAndPaginationCategory.categoryType;
//     }
//     this.categoryService.getAllByPagination({
//       paging: this.componentData.myQuery.paging,
//       totalElements: this.totalElements,
//       term: getAllByFilterAndPaginationCategory.title,
//       parentId: getAllByFilterAndPaginationCategory.parentId,
//       categoryType: getAllByFilterAndPaginationCategory.categoryType
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<CategoryDto.GetAll>) => {
//       this.loading = false;
//
//       this.dataOfCategoryList = res.content;
//       this.totalElements = res.totalElements;
//       this.totalPages = res.totalPages;
//     });
//   }
//
//   onReceiveRouteData(routeData: any) {
//   }
//
//   setPage(page) {
//     super.setToQueryParams({page: page, size: this.componentData.myQuery.paging.size});
//   }
//
//
//   search() {
//     this.totalElements = 0;
//     super.setToQueryParams({
//       page: 0,
//       size: 10,
//       userId: this.userId,
//       title: this.componentData.myQuery.getAllByFilterAndPaginationCategory.title,
//       parentId: this.componentData.myQuery.getAllByFilterAndPaginationCategory.parentId,
//       categoryType: this.componentData.myQuery.getAllByFilterAndPaginationCategory.categoryType,
//     });
//   }
//
//   chooseSelectedItemForEdit(item: CategoryDto.GetAll) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, categoryId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: CategoryDto.GetAll) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.categoryService.delete({categoryId: this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//         if (res !== true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//           DefaultNotify.notifyDanger(res);
//           return;
//         } else if (res === true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfCategoryList = this.dataOfCategoryList
//
//             .filter((e) => {
//               return e.id !== this.selectedItemForDelete.id;
//             });
//
//           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//         } else {
//           DefaultNotify.notifyDanger(res.message);
//         }
//       }, error => {
//       });
//
//     } else {
//       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//     }
//   }
//
//
//   showModalDelete(item, i) {
//     this.selectedItemForDelete.loading = false;
//
//     this.selectedItemForDelete.id = item.id;
//     this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//
//   ngOnDestroy(): void {
//   }
//
//   openModalProperties(properties, title) {
//     this.titleOfCategory = title;
//     this.properties = properties;
//     ModalUtil.showModal('modalPropertiesId');
//   }
//
// }
//
// export class ComponentData {
//   myQuery: CourseParam.QueryParam = new CourseParam.QueryParam();
// }
//
// export namespace CourseParam {
//   export class RouteParam {
//
//   }
//
//   export class QueryParam {
//     paging: Paging;
//     getAllByFilterAndPaginationCategory: GetAllByFilterAndPaginationCategory;
//     userId;
//
//     constructor() {
//       this.paging = new Paging();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.userId = null;
//       this.getAllByFilterAndPaginationCategory = new GetAllByFilterAndPaginationCategory();
//       this.getAllByFilterAndPaginationCategory.title = null;
//       this.getAllByFilterAndPaginationCategory.parentId = null;
//       this.getAllByFilterAndPaginationCategory.categoryType = null;
//
//     }
//   }
// }
//
// export class GetAllByFilterAndPaginationCategory {
//   title: string;
//   parentId: string;
//   categoryType: CategoryType;
// }


