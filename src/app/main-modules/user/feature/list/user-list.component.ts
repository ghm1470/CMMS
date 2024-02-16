import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../endpoint/user.service';
import {ActionMode, DefaultNotify, ModalSize, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {UserDto} from '../../model/dto/user-dto';
import {UserType} from '../../../securityManagement/model/userType';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {Province} from '../../../dashboard/model/dto/province';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: UserDto.Create[] = [];
    loading: boolean;
    loadingUserTypeList: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    getAllUserFilter = new UserDto.GetAllByFilter();
    userTypeList: UserType[] = [];
    actionMode = ActionMode;
    MyModalSize = ModalSize;
    listMode = true;

    constructor(private entityService: UserService,
                public router: Router,
                private cacheService: CacheService,
                public userTypeService: UserTypeService,
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
        this.getAllUserType();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getAllUserType() {
        this.loadingUserTypeList = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingUserTypeList = false;
            // console.log('getAllUserType', res);
            if (!isNullOrUndefined(res)) {
                this.userTypeList = res;
            }
        });
    }

    getPage() {
        this.loading = true;

        this.loading = true;
        if (isNullOrUndefined(this.getAllUserFilter.username) || this.getAllUserFilter.username === '') {
            this.getAllUserFilter.username = null;
        }
        if (isNullOrUndefined(this.getAllUserFilter.name) || this.getAllUserFilter.name === '') {
            this.getAllUserFilter.name = null;
        }
        if (isNullOrUndefined(this.getAllUserFilter.family) || this.getAllUserFilter.family === '') {
            this.getAllUserFilter.family = null;
        }
        if (isNullOrUndefined(this.getAllUserFilter.userTypeId) || this.getAllUserFilter.userTypeId === '') {
            this.getAllUserFilter.userTypeId = null;
        }
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getAllByFilterAndPagination(this.getAllUserFilter, {
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

    chooseSelectedItemForEdit(item: UserDto.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: UserDto.Create, i) {
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
            this.entityService.delete({userId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger('این شخص قابل حذف نیست.', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    setIdFor(event) {
        if (event) {
            this.getAllUserFilter.userTypeId = event.id;
        } else if (isNullOrUndefined(event)) {
            this.getAllUserFilter.userTypeId = null;
        }

    }

    selectedUser = new UserDto.Create();
    subUserList: UserDto.Create [] = [];
    subUsersOfUserLoading = false;

    subUserListModal(user: UserDto.Create) {
        this.subUsersOfUserLoading = true;
        this.selectedUser = user;
        this.entityService.getAllSubUsersOfUserByUserId({userId: user.id}).subscribe(res => {
            this.subUsersOfUserLoading = false;
            ModalUtil.showModal('subUserModal');
            if (res) {
                this.subUserList = res;
                this.subUserList = this.subUserList.filter(e => e.id !== user.id);
            }
        });
    }

    chooseSelectedItemForView(item: UserDto.Create) {
        this.router.navigate(['view'], {
            queryParams: {userId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    modeForAction = ActionMode.ADD;
    userIdForAction: string;

    showActionComponent(modeForAction: ActionMode, item?: UserDto.Create) {
        this.modeForAction = modeForAction;
        if (item) { this.userIdForAction = item.id; }
        setTimeout((e) => {
            this.listMode = false;
        }, 1);
    }

    backEmit() {
        console.log(' this.getAllUserFilter', this.getAllUserFilter);
        console.log('backEmit');
        this.listMode = true;

        if (
            this.getAllUserFilter.username ||
            !isNullOrUndefined(this.getAllUserFilter.name) ||
            this.getAllUserFilter.family ||
            this.getAllUserFilter.userTypeId
        ) {
            setTimeout((e) => {
                $('#user-search').addClass('show');
            }, 5);
        }
    }

    ngOnDestroy(): void {
    }


    //////////////////////////////////////
//
//     @Input() readSearchService;
//     totalElements = 0;
//     totalPages = 0;
//     dataOfUserList: UserDto.Create [] = [];
//     getAllUserFilter = new UserDto.GetAllByFilter();
//     selectedItemForDelete = new DeleteModel();
//     MyModalSize = ModalSize;
//     roleList = new TokenRoleList();
//     componentData = new ComponentData();
//     userTypeList: UserType[] = [];
//     loadingUserTypeList = true;
//     loading = false;
//     actionMode = ActionMode;
//     userNameForOrg: string;
//     userFamilyForOrg: string;
//     organizationsByAUserIdList: any[] = [];
//     userNameAndFamily: string;
//     t = 0;
//     s = 0;
//     orgAndUserTypeList: UserDto.OrgAndUserTypeList[] = [];
//
//     selectedUser = new UserDto.Create();
//     subUserList: UserDto.Create [] = [];
//
// //
//
//     constructor(
//         protected _Router: Router,
//         protected _ActivatedRoute: ActivatedRoute,
//         private cacheService: CacheService,
//         public userService: UserService,
//         public userTypeService: UserTypeService,
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
//         this.getAllUserType();
//     }
//
//     ngOnChanges() {
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
//     onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//     }
//
//     onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//         this.componentData.myQuery = queryParam;
//         this.getListSelf();
//     }
//
//     onReceiveRouteData(routeData: any) {
//     }
//
//     getAllUserType() {
//         this.loadingUserTypeList = true;
//         this.userTypeService.getAllRole()
//             .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//             this.loadingUserTypeList = false;
//             // console.log('getAllUserType', res);
//             if (!isNullOrUndefined(res)) {
//                 this.userTypeList = res;
//             }
//         });
//     }
//
//
//     getListSelf(options?: any) {
//         this.loading = true;
//         if (isNullOrUndefined(this.getAllUserFilter.username) || this.getAllUserFilter.username === '') {
//             this.getAllUserFilter.username = null;
//         }
//         if (isNullOrUndefined(this.getAllUserFilter.name) || this.getAllUserFilter.name === '') {
//             this.getAllUserFilter.name = null;
//         }
//         if (isNullOrUndefined(this.getAllUserFilter.family) || this.getAllUserFilter.family === '') {
//             this.getAllUserFilter.family = null;
//         }
//         if (isNullOrUndefined(this.getAllUserFilter.userTypeId) || this.getAllUserFilter.userTypeId === '') {
//             this.getAllUserFilter.userTypeId = null;
//         }
//         this.userService.getAllByFilterAndPagination(this.getAllUserFilter, {
//             paging: this.componentData.myQuery.paging,
//             totalElements: this.totalElements
//         }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
//             if (res) {
//                 this.loading = false;
//                 this.dataOfUserList = res.content;
//                 this.totalElements = res.totalElements;
//                 this.totalPages = res.totalPages;
//             }
//         });
//     }
//
//
//     chooseSelectedItemForEdit(item: UserDto.Create) {
//         this._Router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, userId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: UserDto.Create) {
//         this.router.navigate(['view'], {
//             queryParams: {userId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//
//     deleteItem(event) {
//         if (event) {
//             this.selectedItemForDelete.loading = true;
//             this.userService.delete({userId: this.selectedItemForDelete.id})
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//                 if (res !== true) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                     DefaultNotify.notifyDanger(res);
//                 } else if (res === true) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//                     this.dataOfUserList = this.dataOfUserList
//
//                         .filter((e) => {
//                             return e.id !== this.selectedItemForDelete.id;
//                         });
//
//                     DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//                 } else {
//                     DefaultNotify.notifyDanger(res.message);
//                 }
//             }, error => {
//             });
//
//         } else {
//             ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//     }
//
//
//     showModalDelete(item, i) {
//         console.log(item);
//         this.selectedItemForDelete.loading = false;
//
//         this.selectedItemForDelete.id = item.id;
//         this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
//         this.selectedItemForDelete.index = i;
//         setTimeout(e => {
//             ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//         }, 10);
//     }
//
//
//     setPage(pageN) {
//         super.setToQueryParams({page: pageN, size: this.componentData.myQuery.paging.size});
//     }
//
//
//     ngOnDestroy(): void {
//     }
//
//     setIdFor(event) {
//         if (event) {
//             this.getAllUserFilter.userTypeId = event.id;
//         } else if (isNullOrUndefined(event)) {
//             this.getAllUserFilter.userTypeId = null;
//         }
//
//     }
//
//     subUserListModal(user: UserDto.Create) {
//         this.selectedUser = user;
//         this.userService.getAllSubUsersOfUserByUserId({userId: user.id}).subscribe(res => {
//             ModalUtil.showModal('subUserModal');
//             if (res) {
//                 this.subUserList = res;
//                 this.subUserList = this.subUserList.filter(e => e.id !== user.id);
//             }
//         });
//     }
//
//     openOrganizationModal(name: string, id: string, family: string) {
//         this.userNameForOrg = name;
//         this.userFamilyForOrg = family;
//         this.organizationsByAUserIdList = [];
//         this.userService.getOrganizationsByAUserId({userId: id})
//             .subscribe(res => {
//                 if (!isNullOrUndefined(res)) {
//                     console.log('getOrganizationsByAUserId', res);
//                     this.organizationsByAUserIdList = res;
//                     if (this.organizationsByAUserIdList.length > 0) {
//                         ModalUtil.showModal('organizationModal');
//
//                     } else {
//                         DefaultNotify.notifySuccess('سازمانی انتخاب نشده است.');
//                     }
//
//                 } else {
//                     DefaultNotify.notifyDanger('سازمانی انتخاب نشده است.');
//                 }
//             }, error => {
//                 DefaultNotify.notifyDanger('سازمانی انتخاب نشده است.');
//
//             });
//
//     }
//
//     search() {
//         this.totalElements = 0;
//         this.totalPages = 0;
//         if (this.componentData.myQuery.paging.page === 0) {
//             this.getListSelf();
//         } else {
//             this.componentData.myQuery.paging.page = 0;
//             this.router.navigate([], {
//                 queryParams: {
//                     page: this.componentData.myQuery.paging.page,
//                     size: this.componentData.myQuery.paging.size
//                 },
//                 relativeTo: this.activatedRoute
//             });
//         }
//     }
//
//     openUserTypeForUserModal(item: UserDto.Create) {
//         this.userNameAndFamily = item.name + ' ' + item.family;
//         this.userService.getAllUserTypeAndOrgForUser({userId: item.id})
//             .subscribe(res => {
//                 if (!isNullOrUndefined(res)) {
//                     console.log('res', res);
//                     this.orgAndUserTypeList = res;
//                     if (this.orgAndUserTypeList.length > 0) {
//                         ModalUtil.showModal('UserTypeForUserModal');
//                     }
//                 }
//             });
//     }
// }
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
//
//         constructor() {
//             this.paging = new Paging();
//             this.paging.page = 0;
//             this.paging.size = 10;
//         }
//     }
}




