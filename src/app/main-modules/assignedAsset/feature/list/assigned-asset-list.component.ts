import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {ModalUtil} from '@angular-boot/widgets';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {AssetStatus, GetAllByFilterAndPagination} from '../../../asset/feature/tree-list/tree-list.component';
import {AssetTemplateDto} from '../../../assetTemplate/model/dto/assetTemplateDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {AssetTemplateService} from '../../../assetTemplate/endpoint/asset-template.service';
import {Tools} from '../../../../shared/tools/Tools';
import {Province} from "../../../dashboard/model/dto/province";
import {DeleteModel} from "../../../../shared/conferm-delete/model/delete-model";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import AssetPriority = CategoryDto.AssetPriority;

declare var $: any;

@Component({
    selector: 'app-assigned-asset-list',
    templateUrl: './assigned-asset-list.component.html',
    styleUrls: ['./assigned-asset-list.component.scss']
})
export class AssignedAssetListComponent implements OnInit, AfterViewInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: AssetDto.CreateAsset[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    userList: UserDto.Create[] = [];
    readAssetTemplate = true;
    assetTemplateList: AssetTemplateDto.Create[] = [];
    categoryTypeList = [] as EnumObject[];
    statusList = [] as EnumObject[];
    assetPriorityList = [] as EnumObject[];

    getAllByFilterAndPagination = new GetAllByFilterAndPagination();
    myUserTypeId: string;
    categoryType = CategoryDto.CategoryType;

    constructor(private entityService: AssetService,
                public router: Router,
                private cacheService: CacheService,
                public assetTemplateService: AssetTemplateService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute) {
        this.categoryTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<CategoryType>(CategoryType));
        this.assetPriorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AssetPriority>(AssetPriority));
        this.statusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AssetStatus>(AssetStatus));
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';

            this.getPage();

        });
    }

    ngOnInit() {
        const user = sessionStorage.getItem('user');
        if (user) {
            this.myUserTypeId = JSON.parse(user).userTypeId;
        }
        this.getRoleListKey();
        this.getAllAssetByTerm('onInit');
        this.getAllUser();
        this.getAllAssetTemplate();
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
        if (!this.selectedUserForSearch) {
            return;
        }
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        if (this.selectedUserForSearch === 'myUserType') {
            this.entityService.getAllAssignedAssetsOfGroup(this.getAllByFilterAndPagination, {
                paging,
                totalElements:-1,
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
        } else {
            this.entityService.getAllPaginationWithUserIdForAssignedAsset(this.getAllByFilterAndPagination, {
                paging,
                totalElements:-1,
                userId: this.getAllByFilterAndPagination.userId
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

    chooseSelectedItemForEdit(item: AssetDto.CreateAsset) {
        this.router.navigate(['actionAsset/action'], {
            queryParams: {
                mode: ActionMode.EDIT,
                entityId: item.id,
                from: 'assignedAsset'
            },
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: AssetDto.CreateAsset) {
        this.router.navigate(['actionAsset/view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
    }

    getAllUser() {
        const parentUser = JSON.parse(sessionStorage.getItem('user'));
        this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: UserDto.Create[]) => {
                if (res) {
                    this.userList = res;
                    if (parentUser) {
                        let myUser = new UserDto.Create();
                        myUser = parentUser;
                        myUser.name = 'من';
                        myUser.family = '';
                        this.selectedUserForSearch = myUser.id;
                        this.changUser();
                        this.userList.unshift(myUser);
                    }
                }
            });
    }

    getAllAssetTemplate() {
        if (this.readAssetTemplate) {
            this.assetTemplateService.getAll().pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetTemplateDto.Create[]) => {
                    if (res && res.length) {
                        this.assetTemplateList = res;
                        this.readAssetTemplate = false;
                    }
                });
        }

    }


    changeAssetTemplate(event) {
        if (event) {
            this.getAllByFilterAndPagination.assetTemplateId = event.id;
        } else {
            this.getAllByFilterAndPagination.assetTemplateId = null;
        }
    }

    selectedUserForSearch: any;

    changUser() {
        if (this.selectedUserForSearch === 'myUserType') {
            this.getAllByFilterAndPagination.userTypeId = this.myUserTypeId;
            this.getAllByFilterAndPagination.userId = null;
        } else {
            this.getAllByFilterAndPagination.userTypeId = null;
            this.getAllByFilterAndPagination.userId = this.selectedUserForSearch;
        }
        this.pageIndex = 0;
        this.search();
    }

    termForAsset: string;
    loadingAssetList = false;
    assetList = [];
    assetPageIndex = 0;
    assetPageSize = 10;

    getAllAssetByTerm(type?) {
        const paging = new Paging();
        if (type === 'onInit') {
            this.assetPageIndex = 0;
        } else {
            this.assetPageIndex += 1;
        }
        paging.size = this.assetPageSize;
        paging.page = this.assetPageIndex;
        this.loadingAssetList = true;
        this.entityService.getAllAssetByTerm({paging, totalElements: 0, term: this.termForAsset})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAssetList = false;
            if (this.assetList.length === 0) {
                this.assetList = res.content;
            } else {
                this.assetList = this.assetList.concat(res.content);
            }
            this.assetList = this.assetList.filter(u => u.id !== this.getAllByFilterAndPagination.parentLocationId);

        });
    }

//
}


//////////////////////////////////////
//
//     @Input() userId: string;
//     componentData: ComponentData;
//     totalElements = 0;
//     totalPages = 0;
//     loading: boolean;
//     toolkit2 = Toolkit2;
//     categoryType = CategoryType;
//     dataOfAssignedAssetList: AssetDto.CreateAsset [] = [];
//     roleList = new TokenRoleList();
//     userList: UserDto.Create[] = [];
//     tools = Tools;
//
//     getAllByFilterAndPagination = new GetAllByFilterAndPagination();
//     assetTemplateList: AssetTemplateDto.Create[] = [];
//     categoryTypeList = [] as EnumObject[];
//     statusList = [] as EnumObject[];
//     readAssetTemplate = true;
//
//
//     constructor(
//         protected _Router: Router,
//         protected _ActivatedRoute: ActivatedRoute,
//         protected assetService: AssetService,
//         protected cacheService: CacheService,
//         private userService: UserService,
//         public assetTemplateService: AssetTemplateService,
//     ) {
//         super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//         this.categoryTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<CategoryType>(CategoryType));
//         this.statusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AssetStatus>(AssetStatus));
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
//         this.getAllUser();
//         // this.getAllAssetTemplate();
//         this.getRoleListKey();
//     }
//
//     ngAfterViewInit() {
//         if (this.componentData.myQuery.getAllByFilterAndPagination.name || this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId ||
//             this.componentData.myQuery.getAllByFilterAndPagination.code || this.componentData.myQuery.getAllByFilterAndPagination.categoryType ||
//             this.componentData.myQuery.getAllByFilterAndPagination.status
//         ) {
//             $('#asset-search').addClass('show');
//             if (this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId) {
//                 this.getAllAssetTemplate();
//             }
//         }
//     }
//
//     getRoleListKey() {
//         this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             if (res) {
//                 this.roleList = res;
//             }
//         });
//     }
//
//     getAllUser() {
//         const parentUser = JSON.parse(sessionStorage.getItem('user'));
//         this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
//             .subscribe((res: UserDto.Create[]) => {
//                 if (res && res.length) {
//                     this.userList = res;
//                     for (const item of this.userList) {
//                         item.name = item.name + ' ' + item.family;
//                     }
//                 }
//             });
//     }
//
//     getAllAssetTemplate() {
//         if (this.readAssetTemplate) {
//             this.assetTemplateService.getAll().pipe(takeUntilDestroyed(this))
//                 .subscribe((res: AssetTemplateDto.Create[]) => {
//                     if (res && res.length) {
//                         this.assetTemplateList = res;
//                         this.readAssetTemplate = false;
//                     }
//                 });
//         }
//
//     }
//
//     changeAssetTemplate(event) {
//         if (event) {
//             this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId = event.id;
//         } else {
//             this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId = null;
//         }
//     }
//
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.loading = true;
//         if (isNullOrUndefined(queryParam.userId)) {
//             const users = JSON.parse(sessionStorage.getItem('user'));
//             this.userId = users.id;
//         } else {
//             this.userId = queryParam.userId;
//         }
//         this.getAssignedAsset();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//     getAssignedAsset() {
//         this.getAllByFilterAndPagination = new GetAllByFilterAndPagination();
//         this.assetService.getAllPaginationWithUserIdForAssignedAsset(this.componentData.myQuery.getAllByFilterAndPagination, {
//             paging: this.componentData.myQuery.paging,
//             totalElements: this.totalElements,
//             userId: this.userId
//         }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<AssetDto.CreateAsset>) => {
//             if (res) {
//                 this.dataOfAssignedAssetList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//
//     }
//
//     setPage(pageNumber) {
//         super.setToQueryParams({page: pageNumber, size: this.componentData.myQuery.paging.size});
//     }
//
//     selectedUserForSearch: any;
//
//     changUser() {
//
//     }
//
//     search() {
//         this.totalElements = 0;
//         if (this.componentData.myQuery.getAllByFilterAndPagination.status === <any>'null') {
//             this.componentData.myQuery.getAllByFilterAndPagination.status = null;
//         }
//         super.setToQueryParams({
//             page: 0,
//             size: 10,
//             userId: this.userId,
//             name: this.componentData.myQuery.getAllByFilterAndPagination.name,
//             code: this.componentData.myQuery.getAllByFilterAndPagination.code,
//             assetTemplateId: this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId,
//             categoryType: this.componentData.myQuery.getAllByFilterAndPagination.categoryType,
//             status: this.componentData.myQuery.getAllByFilterAndPagination.status,
//         });
//     }
//
//     chooseSelectedItemForEdit(item: AssetDto.CreateAsset) {
//         this._Router.navigate(['actionAsset/action'], {
//             queryParams: {mode: ActionMode.EDIT, assetId: item.id},
//             relativeTo: this._ActivatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: AssetDto.CreateAsset) {
//         this._Router.navigate(['actionAsset/view'], {
//             queryParams: {mode: ActionMode.VIEW, assetId: item.id},
//             relativeTo: this._ActivatedRoute
//         });
//     }
//
//     ngOnDestroy(): void {
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
//         userId;
//         getAllByFilterAndPagination = new GetAllByFilterAndPagination();
//
//         constructor() {
//             this.paging = new Paging();
//             this.paging.page = 0;
//             this.paging.size = 10;
//             this.userId = null;
//             this.getAllByFilterAndPagination = new GetAllByFilterAndPagination();
//             this.getAllByFilterAndPagination.name = null;
//             this.getAllByFilterAndPagination.assetTemplateId = null;
//             this.getAllByFilterAndPagination.categoryType = null;
//             this.getAllByFilterAndPagination.status = null;
//             this.getAllByFilterAndPagination.code = null;
//
//
//         }
//     }
// }
