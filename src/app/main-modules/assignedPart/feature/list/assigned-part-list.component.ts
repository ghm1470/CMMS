import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {PartDto} from '../../../part/model/dto/part';
import {PartService} from '../../../part/endpoint/part.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {AssetTemplateService} from '../../../assetTemplate/endpoint/asset-template.service';
import {Tools} from '../../../../shared/tools/Tools';
import {Province} from "../../../dashboard/model/dto/province";
import {DeleteModel} from "../../../../shared/conferm-delete/model/delete-model";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import {ModalUtil} from "@angular-boot/widgets";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-assigned-part-list',
    templateUrl: './assigned-part-list.component.html',
    styleUrls: ['./assigned-part-list.component.scss']
})
export class AssignedPartListComponent implements OnInit, AfterViewInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: PartDto.Create[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    partForSearch = new PartDtoForSearch();
    @Input() userId: string;
    userList: UserDto.Create[] = [];

    constructor(private entityService: PartService,
                public router: Router,
                private userService: UserService,
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
        const user = sessionStorage.getItem('user');
        if (user) {
            this.myUserTypeId = JSON.parse(user).userTypeId;
        }
        this.getRoleListKey();
        this.getAllUser();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    selectedUserForSearch: any;
    myUserTypeId: string;

    changUser() {
        if (this.selectedUserForSearch === 'myUserType') {
            this.partForSearch.userTypeId = this.myUserTypeId;
            this.partForSearch.userId = null;
        } else {
            this.partForSearch.userTypeId = null;
            this.partForSearch.userId = this.selectedUserForSearch;
        }
        this.pageIndex = 0;
        this.search();
    }

    getAllUser() {
        const parentUser = JSON.parse(sessionStorage.getItem('user'));
        this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
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

//TODO 2تا سرویس خواهد شد
    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        if (this.selectedUserForSearch === 'myUserType') {
            this.entityService.getAllAssignedPartsOfGroup(this.partForSearch, {
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

            this.entityService.getAllPaginationWithUserIdForAssignedPart(this.partForSearch, {
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

    chooseSelectedItemForEdit(item: PartDto.Create) {
        this.router.navigate(['actionPart/action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.partId},
            relativeTo: this.activatedRoute
        });

    }

    chooseSelectedItemForView(item: PartDto.Create) {
        this.router.navigate(['actionPart/action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.partId},
            relativeTo: this.activatedRoute

        });
    }

    showModalDelete(item: PartDto.Create, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.partId;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({partId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger('این آیتم قابل حذف نمی باشد.', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit() {
        // if (this.componentData.myQuery.partForSearch.partCode || this.componentData.myQuery.partForSearch.partName) {
        //     $('#part-search').addClass('show');
        // }
    }

    //////////////////////////////////////
    // @Input() userId: string;
    // componentData: ComponentData;
    // totalElements = 0;
    // totalPages = 0;
    // toolkit2 = Toolkit2;
    // loading: boolean;
    // partList: PartDto.Create[] = [];
    // dataOfAssignedPartList: PartDto.Create [] = [];
    // actionMode = ActionMode;
    // userList: UserDto.Create[] = [];
    // roleList = new TokenRoleList();
    // tools = Tools;
    //
    //
    // constructor(
    //   protected _Router: Router,
    //   protected _ActivatedRoute: ActivatedRoute,
    //   private partService: PartService,
    //   private userService: UserService,
    //   private cacheService: CacheService,
    //   public assetTemplateService: AssetTemplateService,
    // ) {
    //   super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
    //
    //
    //   this.componentData = new ComponentData();
    //   this.receiveData();
    //
    // }
    //
    // canDeactivate(): boolean {
    //   return true;
    // }
    //
    // ngOnInit() {
    //   this.getAllUser();
    //   this.getRoleListKey();
    // }
    //
    // ngAfterViewInit() {
    //   if (this.componentData.myQuery.partForSearch.partCode || this.componentData.myQuery.partForSearch.partName) {
    //     $('#part-search').addClass('show');
    //   }
    // }
    //
    // getAllUser() {
    //   const parentUser = JSON.parse(sessionStorage.getItem('user'));
    //   this.userService.getAllSubUsersOfUserByUserId({userId: parentUser.id}).pipe(takeUntilDestroyed(this))
    //     .subscribe((res: any) => {
    //       if (res && res.length) {
    //         this.userList = res;
    //         for (const item of this.userList) {
    //           item.name = item.name + ' ' + item.family;
    //         }
    //       }
    //     });
    // }
    //
    // getRoleListKey() {
    //   this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //     if (res) {
    //       this.roleList = res;
    //     }
    //   });
    // }
    //
    // onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
    // }
    //
    // onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
    //   this.componentData.myQuery = queryParam;
    //   this.loading = true;
    //   if (isNullOrUndefined(queryParam.userId)) {
    //     const users = JSON.parse(sessionStorage.getItem('user'));
    //     this.userId = users.id;
    //   } else {
    //     this.userId = queryParam.userId;
    //   }
    //   this.getAssignedPartList();
    // }
    //
    // getAssignedPartList() {
    //   this.dataOfAssignedPartList = [];
    //   this.partService.getAllPaginationWithUserIdForAssignedPart(this.componentData.myQuery.partForSearch ,{
    //     paging: this.componentData.myQuery.paging,
    //     totalElements: this.totalElements,
    //     userId: this.userId
    //   }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.Create>) => {
    //     if (res && res.content.length > 0) {
    //       this.dataOfAssignedPartList = res.content;
    //       this.totalElements = res.totalElements;
    //       this.totalPages = res.totalPages;
    //     }
    //   });
    // }
    //
    // onReceiveRouteData(routeData: any) {
    // }
    //
    // setPage(pageNumber) {
    //   super.setToQueryParams({page: pageNumber, size: this.componentData.myQuery.paging.size});
    // }
    //
    //
    // search() {
    //   this.totalElements = 0;
    //   super.setToQueryParams({
    //     page: 0,
    //     size: 10,
    //     term: this.componentData.myQuery.term,
    //     userId: this.userId,
    //     partName: this.componentData.myQuery.partForSearch.partName,
    //     partCode: this.componentData.myQuery.partForSearch.partCode,
    //   });
    // }
    //
    // chooseSelectedItemForEdit(item) {
    //   this._Router.navigate(['actionPart/action'], {
    //     queryParams: {mode: ActionMode.EDIT, partId: item.entityId},
    //     relativeTo: this._ActivatedRoute
    //   });
    // }
    //
    // chooseSelectedItemForView(item) {
    //   this._Router.navigate(['actionPart/action'], {
    //     queryParams: {mode: ActionMode.VIEW, partId: item.entityId},
    //     relativeTo: this._ActivatedRoute
    //   });
    // }
    //
    //
    // ngOnDestroy(): void {
    // }
    //

}

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
//     term: string;
//     partForSearch = new PartDtoForSearch();
//     userId;
//
//     constructor() {
//       this.term = '';
//       this.paging = new Paging();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.userId = null;
//       this.partForSearch = new PartDtoForSearch();
//       this.partForSearch.partCode = null;
//       this.partForSearch.partName = null;
//
//     }
//   }
// }
//
export class PartDtoForSearch {
    partName: string;
    partCode: string;
    userId: string;
    userTypeId: string;
}
