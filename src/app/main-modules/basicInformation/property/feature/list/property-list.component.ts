import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, EnumHandle, ListHelper, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {PropertyDto} from '../../model/dto/propertyDto';
import {PropertyService} from '../../endpoint/property.service';
import {isNullOrUndefined, log} from 'util';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {PropertyCategoryService} from '../../../propertyCategory/endpoint/property-category.service';
import PropertyType = PropertyDto.PropertyType;
import {Province} from "../../../../dashboard/model/dto/province";
import {ProvinceService} from "../../../province/endpoint/province.service";
import {UserDto} from "../../../../user/model/dto/user-dto";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-property-list',
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    propertyCategoryId: string;

    entityList: PropertyDto.Create[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    propertyCategoryList: any[] = [];
    statusList: any [] = [];

    constructor(private entityService: PropertyService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute,
                private propertyCategoryService: PropertyCategoryService) {
        this.statusList = EnumHandle.getAsValueTitleList(PropertyType);
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            params.propertyCategoryId ? this.propertyCategoryId = params.propertyCategoryId : '';
            this.getPage();

        });
    }

    ngOnInit() {
        this.getRoleListKey();
        this.getAllPropertyCategory();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getAllPropertyCategory() {
        this.propertyCategoryService.getAll().subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.propertyCategoryList = res;

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
            propertyCategoryId: this.propertyCategoryId
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
                propertyCategoryId: this.propertyCategoryId,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: PropertyDto.Create) {
        this.entityService.getOne({propertyId: item.id})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res.data) {
                this.router.navigate(['action'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            } else {
                DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
            }
        });
    }

    chooseSelectedItemForView(item: PropertyDto.Create) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: PropertyDto.Create, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.key + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({propertyId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res.data) {
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
//   @Input() userId: string;
//   componentData: ComponentData;
//   totalElements = 0;
//   totalPages = 0;
//   loading = false;
//   dataOfPropertyList: PropertyDto.Create [] = [];
//   selectedItemForDelete = new DeleteModel();
//   roleList = new TokenRoleList();
//   statusList: any [] = [];
//   propertyCategoryId: string;
//   propertyCategoryList: any[] = [];
// //
//
//
//   constructor(protected _Router: Router,
//               protected _ActivatedRoute: ActivatedRoute,
//               private cacheService: CacheService,
//               public propertyService: PropertyService,
//               public propertyCategoryService: PropertyCategoryService,
//   ) {
//     super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//     this.componentData = new ComponentData();
//     this.receiveData();
//     this.statusList = EnumHandle.getAsValueTitleList(PropertyType);
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   ngOnInit() {
//     this.getAllPropertyCategory();
//     this.getRoleListKey();
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
//   getAllPropertyCategory() {
//     this.propertyCategoryService.getAll().subscribe(res => {
//       if (!isNullOrUndefined(res)) {
//         this.propertyCategoryList = res;
//
//       }
//     });
//   }
//
//   onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//   }
//
//
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
//     this.dataOfPropertyList = [];
//     const getAllByFilterAndPaginationProperty = new GetAllByFilterAndPaginationProperty();
//     // if (this.componentData.myQuery.getAllByFilterAndPaginationProperty.title !== null) {
//     //   getAllByFilterAndPaginationProperty.title = this.componentData.myQuery.getAllByFilterAndPaginationProperty.title;
//     // }
//     // if (this.componentData.myQuery.getAllByFilterAndPaginationProperty.parentId !== null) {
//     //   getAllByFilterAndPaginationProperty.parentId = this.componentData.myQuery.getAllByFilterAndPaginationProperty.parentId;
//     // }
//     // if (this.componentData.myQuery.getAllByFilterAndPaginationProperty.categoryType !== null) {
//     //   getAllByFilterAndPaginationProperty.categoryType = this.componentData.myQuery.getAllByFilterAndPaginationProperty.categoryType;
//     // }
//     this.propertyService.getAllByPagination({
//       paging: this.componentData.myQuery.paging,
//       totalElements: this.totalElements,
//       term: getAllByFilterAndPaginationProperty.term,
//       propertyCategoryId: getAllByFilterAndPaginationProperty.propertyCategoryId,
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PropertyDto.Create>) => {
//       this.loading = false;
//       this.totalElements = res.totalElements;
//       this.totalPages = res.totalPages;
//       this.dataOfPropertyList = res.content;
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
//       term: this.componentData.myQuery.getAllByFilterAndPaginationProperty.term,
//       propertyCategoryId: this.componentData.myQuery.getAllByFilterAndPaginationProperty.propertyCategoryId,
//     });
//   }
//
//   chooseSelectedItemForEdit(item: PropertyDto.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, userId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: PropertyDto.Create) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.propertyService.delete({propertyId: this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//         if (res !== true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//           DefaultNotify.notifyDanger(res);
//           return;
//         } else if (res === true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfPropertyList = this.dataOfPropertyList
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
//     getAllByFilterAndPaginationProperty: GetAllByFilterAndPaginationProperty;
//     userId;
//
//     constructor() {
//       this.paging = new Paging();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.getAllByFilterAndPaginationProperty = new GetAllByFilterAndPaginationProperty();
//       this.getAllByFilterAndPaginationProperty.term = null;
//       this.getAllByFilterAndPaginationProperty.propertyCategoryId = null;
//
//     }
//   }
// }
//
// export class GetAllByFilterAndPaginationProperty {
//   term: string;
//   propertyCategoryId: string;
// }
