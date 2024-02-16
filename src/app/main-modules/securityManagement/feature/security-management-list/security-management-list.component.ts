import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {SecurityManagementService} from '../../endpoint/security-management.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {UserTypeService} from "../../endpoint/user-type.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-security-management-list',
    templateUrl: './security-management-list.component.html',
    styleUrls: ['./security-management-list.component.scss']
})
export class SecurityManagementListComponent implements OnInit, OnDestroy {
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: UserDto.GetAllByFilter[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(private entityService: SecurityManagementService,
                public router: Router,
                private cacheService: CacheService,
                private userTypeService: UserTypeService,
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

        this.entityService.getAllByFilter({
            paging,
            totalElements:-1,
            name: this.term,
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

    chooseSelectedItemForEdit(item: UserDto.GetAllByFilter) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, id: item.id},
            relativeTo: this.activatedRoute
        });
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

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.userTypeService.deleteRole({userTypeId: this.selectedItemForDelete.id})
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

    ///////////////////////////////////////
//   @Input() listOnCallback: () => any;
//   totalElements = 0;
//   dataOfUserList: UserListNsp.ComponentData;
//   userTypeList = new UserDto.GetAllByFilter();
//   searchedUserTypeName = '';
//   type: any;
//   loading = false;
//
//   roleList = new TokenRoleList();
//
//   constructor(public securityManagementService: SecurityManagementService,
//               public userTypeService: UserTypeService,
//               public activatedRoute: ActivatedRoute,
//               private cacheService: CacheService,
//               public router: Router) {
//
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   private fireInitiatePagination() {
//     this.initiatePagination({size: 10});
//   }
//
//   private fireResetPagination() {
//     this.resetPagination({size: 10});
//   }
//
//   ngOnInit() {
//     // this.getAllUserType();
//     // this._setToQueryParams(this.dataOfUserList.queryParam);
//     this.getRoleListKey();
//   }
//
//   getListOnCallback() {
//     return this.listOnCallback;
//   }
//
//   getRoleListKey() {
//     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//       if (res) {
//         this.roleList = res;
//       }
//     });
//   }
//
//   // getAllUserType() {
//   //   this.userTypeService.getAllRole()
//   //     .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//   //
//   //     if (!isNullOrUndefined(res)) {
//   //       this.userTypeList = res;
//   //     }
//   //   });
//   // }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.dataOfUserList.queryParamReal.paging,
//         term: this.dataOfUserList.term
//       }
//     );
//   }
//
//   getListByFilter() {
//     if (this.searchedUserTypeName || this.type) {
//       this.dataOfUserList.queryParamReal.paging.page = 0;
//       this.getListSelf();
//     } else {
//       this.getListSelf();
//
//     }
//   }
//
//   getListSelf(options?: any) {
//     this.loading = true;
//     this.securityManagementService.getAllByFilter({
//       paging: this.dataOfUserList.queryParamReal.paging,
//       totalElements: this.dataOfUserList.itemPage.totalElements,
//       name: this.searchedUserTypeName,
//       type: this.type
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserTypeDto.GetPage>) => {
//
//       if (res) {
//         this.loading = false;
//         this.dataOfUserList.itemPage = res;
//       }
//     });
//   }
//
//   chooseSelectedItemForEdit(item: UserTypeDto.GetPage) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, userId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: UserTypeDto.GetPage) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   deleteRole(i: number, id: string) {
//     this.userTypeService.deleteRole({userTypeId: id})
//       .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//       if (res === 'true') {
//         DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//         this.dataOfUserList.itemPage.content = this.dataOfUserList.itemPage.content
//           .filter((e) => {
//             return e.id !== id;
//           });
//         this.processPage();
//       } else if (res !== 'true') {
//         DefaultNotify.notifyDanger(res);
//       }
//       });
//   }
//
//
//   deleteItem(item: UserTypeDto.GetPage) {
//     // if (confirm('از حذف این '))
//     this.securityManagementService.delete({id: item.id})
//       .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
//       if (res) {
//         this.dataOfUserList.itemPage.content = this.dataOfUserList.itemPage.content
//           .filter((e) => {
//             return e.id !== item.id;
//           });
//         this.processPage();
//       }
//     });
//   }
//
//   onReceiveQueryParam(queryParam: UserListNsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.dataOfUserList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: UserListNsp.RouteParam): any {
//     this.fireResetPagination();
//     this.hardSyncQueryParamReal();
//     this.getList();
//   }
//
//   onReceiveRouteData(routeData: any): any {
//   }
//
//   onChangedTerm() {
//     this.getList();
//   }
//
//   public _setToQueryParams(queryParam) {
//     super.setToQueryParams(queryParam);
//   }
//
//   sortify(event) {
//     this.dataOfUserList.sortings =
//       super.defaultSortify(this.dataOfUserList.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: UserTypeDto.GetPage) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: UserTypeDto.GetPage) {
//     if (this.selectedList.filter(e => e.id === item.id).length > 0) {
//       this.selectedList
//         .splice(this.selectedList.map(e => e.id)
//           .indexOf(item.id), 1);
//       this.deSelectedItem.emit(item);
//     } else {
//       this.selectedList.push(item);
//       this.selectedItem.emit(item);
//     }
//   }
//
//   isInSelected(arg: { item: UserTypeDto.GetPage, selectedList: UserTypeDto.GetPage[] }) {
//     if (isNullOrUndefined(arg.selectedList)) {
//       return false;
//     }
//     // const b = arg.selectedList.includes(arg.item);
//     let b: boolean;
//     if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
//       b = true;
//     } else {
//       b = false;
//     }
//     return b;
//   }
//
//   onChooseMultiMode() {
//   }
//
//   onChooseOneMode() {
//   }
//
//   onDefaultMode() {
//   }
//
//   getComponentData(): UserListNsp.ComponentData {
//     return this.dataOfUserList;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//   setIdFor(event) {
//     // this.getAllUserFilter.userTypeId = event.id;
//   }
//
//   selectedItemForView(item: UserTypeDto.GetPage) {
//     this.router.navigate(['view'], {
//       queryParams: {userId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
// }
//
// export namespace UserListNsp {
//
//   export class ComponentData extends ListComponentData<UserTypeDto.GetPage, RouteParam, QueryParam> {
//     labels: Labels = new Labels();
//   }
//
//
//   class Labels {
//     listTitle = 'لیست کاربران';
//   }
//
//   export class RouteParam {
//   }
//
//   export class QueryParam extends ListQueryParam {
//   }
}
