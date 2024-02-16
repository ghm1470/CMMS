import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
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
import {TaskGroupDto} from '../../model/dto/taskGroupDto';
import {TaskGroupService} from '../../endpoint/task-group.service';
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {ModalUtil} from "@angular-boot/widgets";
import {DeleteModel} from "../../../../shared/conferm-delete/model/delete-model";
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {AssetStatus, GetAllByFilterAndPagination} from '../../../asset/feature/tree-list/tree-list.component';
import {AssetTemplateDto} from '../../../assetTemplate/model/dto/assetTemplateDto';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {UserService} from '../../../user/endpoint/user.service';
import {AssetTemplateService} from '../../../assetTemplate/endpoint/asset-template.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {Tools} from '../../../../shared/tools/Tools';
import {Province} from "../../../dashboard/model/dto/province";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-task-group-list',
    templateUrl: './task-group-list.component.html',
    styleUrls: ['./task-group-list.component.scss']
})
export class TaskGroupListComponent implements OnInit, AfterViewInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    code: string;

    entityList: TaskGroupDto.Create[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(private entityService: TaskGroupService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            params.code ? this.code = params.code : '';
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

        this.entityService.getAllByPagination({
            paging,
            totalElements:-1,
            term: this.term,
            code: this.code,
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
                code: this.code,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: TaskGroupDto.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: TaskGroupDto.Create, i) {
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
            this.entityService.delete({taskGroupId: this.selectedItemForDelete.id})
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

    chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        if (this.term || this.code) {
            $('#task-search').addClass('show');
        }
    }
}


//////////////////////////////////////
//
//   @Input() userId: string;
//   componentData: ComponentData;
//   totalElements = 0;
//   totalPages = 0;
//   loading = true;
//   dataOfTaskGroupList: TaskGroupDto.Create [] = [];
//   roleList = new TokenRoleList();
//   getAllByFilterAndPaginationTaskGroup = new GetAllByFilterAndPaginationTaskGroup();
//   selectedItemForDelete = new DeleteModel();
//   tools = Tools;
//
//
//   constructor(
//     protected _Router: Router,
//     protected _ActivatedRoute: ActivatedRoute,
//     public taskGroupService: TaskGroupService,
//     public activatedRoute: ActivatedRoute,
//     private cacheService: CacheService,
//   ) {
//     super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
//     this.componentData = new ComponentData();
//     this.receiveData();
//
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   ngOnInit() {
//     this.getRoleListKey();
//   }
//
//   ngAfterViewInit() {
//     if (this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.term || this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.code) {
//       $('#task-search').addClass('show');
//     }
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
//   }
//
//   onReceiveRouteData(routeData: any) {
//   }
//
//   getListSelf(options?: any) {
//     this.getAllByFilterAndPaginationTaskGroup = new GetAllByFilterAndPaginationTaskGroup();
//     this.taskGroupService.getAllByPagination( {
//       paging: this.componentData.myQuery.paging,
//       totalElements: this.totalElements,
//       term: this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.term,
//       code: this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.code
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<TaskGroupDto.Create>) => {
//       if (res) {
//         this.loading = false;
//         this.dataOfTaskGroupList = res.content;
//         this.totalElements = res.totalElements;
//         this.totalPages = res.totalPages;
//       }
//     });
//   }
//
//   setPage(pageNumber) {
//     super.setToQueryParams({page: pageNumber, size: this.componentData.myQuery.paging.size});
//   }
//
//
//   search() {
//     this.totalElements = 0;
//     super.setToQueryParams({
//       page: 0,
//       size: 10,
//       term: this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.term,
//       code: this.componentData.myQuery.getAllByFilterAndPaginationTaskGroup.code,
//     });
//
//   }
//
//     chooseSelectedItemForEdit(item: TaskGroupDto.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, taskGroupId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.VIEW, taskGroupId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: TaskGroupDto.Create) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.taskGroupService.delete({taskGroupId:  this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//         if (res !== 'true') {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//           DefaultNotify.notifyDanger(res);
//         } else
//         if (res === 'true') {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfTaskGroupList = this.dataOfTaskGroupList
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
//     this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//   ngOnDestroy(): void {
//   }
// }
//
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
//     userId;
//     getAllByFilterAndPaginationTaskGroup = new GetAllByFilterAndPaginationTaskGroup();
//
//     constructor() {
//       this.paging = new Paging();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.getAllByFilterAndPaginationTaskGroup = new GetAllByFilterAndPaginationTaskGroup();
//       this.getAllByFilterAndPaginationTaskGroup.term = null;
//       this.getAllByFilterAndPaginationTaskGroup.code = null;
//
//
//     }
//   }
// }
//
// export class GetAllByFilterAndPaginationTaskGroup {
//   term: string;
//   code: string;
// }
//   // =============================================================================================
// //   extends
// //   BaseListComponentSeven<TaskGroupListNsp.RouteParam, TaskGroupListNsp.QueryParam,
// //     TaskGroupListNsp.ComponentData, TaskGroupDto.Create>
// //   implements OnInit, OnDestroy {
// //   @Input() listOnCallback: () => any;
// //   totalElements = 0;
// //   dataOfTaskGroupList: TaskGroupListNsp.ComponentData;
// //   selectedItemForDelete = new DeleteModel();
// //   loading = false ;
// //   getAllByFilterAndPaginationTaskGroup = new GetAllByFilterAndPaginationTaskGroup();
// //
// //   roleList = new TokenRoleList();
// //   constructor(public taskGroupService: TaskGroupService,
// //               public activatedRoute: ActivatedRoute,
// //               private cacheService: CacheService,
// //               public router: Router) {
// //     super(activatedRoute, router, TaskGroupListNsp.RouteParam, TaskGroupListNsp.QueryParam);
// //     this.dataOfTaskGroupList =
// //       new TaskGroupListNsp.ComponentData(TaskGroupListNsp.RouteParam, TaskGroupListNsp.QueryParam);
// //     /**
// //      * If You want change default values in dataOfTaskGroupList, you can do like blew
// //      * --> this.dataOfTaskGroupList.init({sizeList: [2, 5, 10, 15]});
// //      */
// //     this.dataOfTaskGroupList =
// //       new TaskGroupListNsp.ComponentData(TaskGroupListNsp.RouteParam, TaskGroupListNsp.QueryParam);
// //
// //     this.fireInitiatePagination();
// //     super.receiveData();
// //   }
// //
// //   canDeactivate(): boolean {
// //     return true;
// //   }
// //
// //   private fireInitiatePagination() {
// //     this.initiatePagination({size: 10});
// //   }
// //
// //   private fireResetPagination() {
// //     this.resetPagination({size: 10});
// //   }
// //
// //   ngOnInit() {
// //     // this._setToQueryParams(this.dataOfTaskGroupList.queryParam);
// //     this.getRoleListKey();
// //   }
// //
// //   getListOnCallback() {
// //     return this.listOnCallback;
// //   }
// //
// //   getListRemoteArg(optionsOfGetList?: any) {
// //     return new ListHelper(
// //       {
// //         paging: this.dataOfTaskGroupList.queryParamReal.paging,
// //         term: this.dataOfTaskGroupList.term
// //       }
// //     );
// //   }
// //
// //   getRoleListKey() {
// //     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
// //       if (res) {
// //         this.roleList = res;
// //       }
// //     });
// //   }
// //   search() {
// //     this.totalElements = 0;
// //     super.setToQueryParams({
// //       page: 0,
// //       size: 10,
// //
// //       name: this.componentData.myQuery.getAllByFilterAndPagination.name,
// //       code: this.componentData.myQuery.getAllByFilterAndPagination.code,
// //       assetTemplateId: this.componentData.myQuery.getAllByFilterAndPagination.assetTemplateId,
// //       categoryType: this.componentData.myQuery.getAllByFilterAndPagination.categoryType,
// //       status: this.componentData.myQuery.getAllByFilterAndPagination.status,
// //     });
// //   }
// //
// //   getListSelf(options?: any) {
// //     this.loading = true;
// //     this.taskGroupService.getAllByPagination( {
// //       paging: this.dataOfTaskGroupList.queryParamReal.paging,
// //       totalElements: this.dataOfTaskGroupList.itemPage.totalElements,
// //       term: this.dataOfTaskGroupList.term
// //     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<TaskGroupDto.Create>) => {
// //       if (res) {
// //         this.loading = false;
// //
// //         this.dataOfTaskGroupList.itemPage = res;
// //       }
// //     });
// //   }
// //
// //   chooseSelectedItemForEdit(item: TaskGroupDto.Create) {
// //     this.router.navigate(['action'], {
// //       queryParams: {mode: ActionMode.EDIT, taskGroupId: item.id},
// //       relativeTo: this.activatedRoute
// //     });
// //   }
// //
// //   chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
// //     this.router.navigate(['action'], {
// //       queryParams: {mode: ActionMode.VIEW, taskGroupId: item.id},
// //       relativeTo: this.activatedRoute
// //     });
// //   }
// //
// //   chooseSelectedItemForView(item: TaskGroupDto.Create) {
// //     this.router.navigate([item.id, ActionMode.VIEW], {
// //       relativeTo: this.activatedRoute
// //     });
// //   }
// //
// //
// //   deleteItem(event) {
// //     if (event) {
// //       this.selectedItemForDelete.loading = true;
// //       this.taskGroupService.delete({taskGroupId:  this.selectedItemForDelete.id})
// //         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
// //
// //         if (res !== 'true') {
// //           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
// //           DefaultNotify.notifyDanger(res);
// //         } else
// //         if (res === 'true') {
// //           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
// //
// //           this.dataOfTaskGroupList.itemPage.content = this.dataOfTaskGroupList.itemPage.content
// //
// //             .filter((e) => {
// //               return e.id !== this.selectedItemForDelete.id;
// //             });
// //           this.processPage();
// //
// //           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
// //
// //         } else {
// //           DefaultNotify.notifyDanger(res.message);
// //         }
// //       }, error => {
// //       });
// //
// //     } else {
// //       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
// //     }
// //   }
// //
// //
// //   showModalDelete(item, i) {
// //     this.selectedItemForDelete.loading = false;
// //
// //     this.selectedItemForDelete.id = item.id;
// //     this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
// //     this.selectedItemForDelete.index = i;
// //     setTimeout(e => {
// //       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
// //     }, 10);
// //   }
// //
// //
// //   onReceiveQueryParam(queryParam: TaskGroupListNsp.QueryParam): any {
// //     super.defaultOnReceiveQueryParam(queryParam);
// //     this.dataOfTaskGroupList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
// //   }
// //
// //   onReceiveRouteParam(routeParam: TaskGroupListNsp.RouteParam): any {
// //     this.fireResetPagination();
// //     this.hardSyncQueryParamReal();
// //     this.getList();
// //   }
// //
// //   onReceiveRouteData(routeData: any): any {
// //   }
// //
// //   onChangedTerm() {
// //     this.getList();
// //   }
// //
// //   public _setToQueryParams(queryParam) {
// //     super.setToQueryParams(queryParam);
// //   }
// //
// //   sortify(event) {
// //     this.dataOfTaskGroupList.sortings =
// //       super.defaultSortify(this.dataOfTaskGroupList.sortings, event);
// //     this.getList();
// //   }
// //
// //   chooseOne(item: TaskGroupDto.Create) {
// //     this.selectedItem.emit(item);
// //   }
// //
// //   selectDeselectItem(item: TaskGroupDto.Create) {
// //     if (this.selectedList.filter(e => e.id === item.id).length > 0) {
// //       this.selectedList
// //         .splice(this.selectedList.map(e => e.id)
// //           .indexOf(item.id), 1);
// //       this.deSelectedItem.emit(item);
// //     } else {
// //       this.selectedList.push(item);
// //       this.selectedItem.emit(item);
// //     }
// //   }
// //
// //   isInSelected(arg: { item: TaskGroupDto.Create, selectedList: TaskGroupDto.Create[] }) {
// //     if (isNullOrUndefined(arg.selectedList)) {
// //       return false;
// //     }
// //     // const b = arg.selectedList.includes(arg.item);
// //     let b: boolean;
// //     if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
// //       b = true;
// //     } else {
// //       b = false;
// //     }
// //     return b;
// //   }
// //
// //   onChooseMultiMode() {
// //   }
// //
// //   onChooseOneMode() {
// //   }
// //
// //   onDefaultMode() {
// //   }
// //
// //   getComponentData(): TaskGroupListNsp.ComponentData {
// //     return this.dataOfTaskGroupList;
// //   }
// //
// //   ngOnDestroy(): void {
// //   }
// // }
// //
// // export namespace TaskGroupListNsp {
// //
// //   export class ComponentData extends ListComponentData<TaskGroupDto.Create, RouteParam, QueryParam> {
// //     labels: Labels = new Labels();
// //   }
// //
// //
// //   class Labels {
// //     listTitle = 'لیست مجموعه کارها';
// //   }
// //
// //   export class RouteParam {
// //   }
// //
// //   export class QueryParam extends ListQueryParam {
// //   }
// // }

