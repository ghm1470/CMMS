import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ProjectDto} from '../../model/dto/projectDto';
import {ProjectService} from '../../endpoint/project.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {Moment} from '../../../../shared/shared/tools/date/moment';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

    myMoment = Moment;

///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    name: string;
    code: string;

    entityList: ProjectDto.Create[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    dateViewMode = DateViewMode;

    constructor(private entityService: ProjectService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.name = params.term : '';
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
        this.name ? this.name = this.name.trim() : '';
        this.code ? this.code = this.code.trim() : '';

        const dto = {
            name: this.name,
            code: this.code
        };

        this.entityService.getAllByPagination(dto, {
            paging,
            totalElements:-1
        }).subscribe((res: any) => {
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
                term: this.name,
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

    chooseSelectedItemForEdit(item: ProjectDto.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: ProjectDto.Create) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: ProjectDto.Create, i) {
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
            this.entityService.delete({projectId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === true) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

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
//     @Input() listOnCallback: () => any;
//     totalElements = 0;
//     dataOfProjectList: ProjectListNsp.ComponentData;
//     dateViewMode = DateViewMode;
//     loading = false;
//     getAllByFilterAndPaginationProject = new getAllByFilterAndPaginationProject();
//     toolkit2 = Toolkit2;
//     tools = Tools;
//
//     roleList = new TokenRoleList();
//     selectedItemForDelete = new DeleteModel();
//
//     constructor(public projectService: ProjectService,
//                 public activatedRoute: ActivatedRoute,
//                 private cacheService: CacheService,
//                 public router: Router) {
//         super(activatedRoute, router, ProjectListNsp.RouteParam, ProjectListNsp.QueryParam);
//         this.dataOfProjectList =
//             new ProjectListNsp.ComponentData(ProjectListNsp.RouteParam, ProjectListNsp.QueryParam);
//         /**
//          * If You want change default values in dataOfProjectList, you can do like blew
//          * --> this.dataOfProjectList.init({sizeList: [2, 5, 10, 15]});
//          */
//         this.dataOfProjectList =
//             new ProjectListNsp.ComponentData(ProjectListNsp.RouteParam, ProjectListNsp.QueryParam);
//
//         this.fireInitiatePagination();
//         super.receiveData();
//     }
//
//     canDeactivate(): boolean {
//         return true;
//     }
//
//     private fireInitiatePagination() {
//         this.initiatePagination({size: 10});
//     }
//
//     private fireResetPagination() {
//         this.resetPagination({size: 10});
//     }
//
//     ngOnInit() {
//         // this._setToQueryParams(this.dataOfProjectList.queryParam);
//         this.getRoleListKey();
//     }
//
//     getListOnCallback() {
//         return this.listOnCallback;
//     }
//
//     getListRemoteArg(optionsOfGetList?: any) {
//         return new ListHelper(
//             {
//                 paging: this.dataOfProjectList.queryParamReal.paging,
//                 term: this.dataOfProjectList.term
//             }
//         );
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
//
//     getListByFilter() {
//         if (this.getAllByFilterAndPaginationProject.name || this.getAllByFilterAndPaginationProject.code) {
//             if (!isNullOrUndefined(this.getAllByFilterAndPaginationProject.name)) {
//                 this.getAllByFilterAndPaginationProject.name = this.getAllByFilterAndPaginationProject.name.trim();
//             }
//             if (!isNullOrUndefined(this.getAllByFilterAndPaginationProject.name)) {
//                 this.getAllByFilterAndPaginationProject.code = this.getAllByFilterAndPaginationProject.code.trim();
//             }
//             this.dataOfProjectList.queryParamReal.paging.page = 0;
//             this.getListSelf();
//         } else {
//             this.getListSelf();
//         }
//     }
//
//
//     getListSelf(options?: any) {
//         this.loading = true;
//         this.projectService.getAllByPagination(this.getAllByFilterAndPaginationProject, {
//                 paging: this.dataOfProjectList.queryParamReal.paging,
//                 totalElements: this.dataOfProjectList.itemPage.totalElements
//             }
//         ).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<ProjectDto.Create>) => {
//             if (res) {
//                 this.loading = false;
//
//                 this.dataOfProjectList.itemPage = res;
//             }
//         });
//     }
//
//     chooseSelectedItemForEdit(item: ProjectDto.Create) {
//         this.router.navigate(['action'], {
//             queryParams: {mode: ActionMode.EDIT, projectId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//     chooseSelectedItemForView(item: ProjectDto.Create) {
//         this.router.navigate(['view'], {
//             queryParams: {mode: ActionMode.VIEW, projectId: item.id},
//             relativeTo: this.activatedRoute
//         });
//     }
//
//
//     deleteItem(event) {
//         if (event) {
//             this.selectedItemForDelete.loading = true;
//             this.projectService.delete({projectId: this.selectedItemForDelete.id})
//                 .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//                 if (res.message) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//                     DefaultNotify.notifyDanger(res.message);
//                 } else if (!res.message) {
//                     ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//                     this.dataOfProjectList.itemPage.content = this.dataOfProjectList.itemPage.content
//
//                         .filter((e) => {
//                             return e.id !== this.selectedItemForDelete.id;
//                         });
//                     this.processPage();
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
//     onReceiveQueryParam(queryParam: ProjectListNsp.QueryParam): any {
//         super.defaultOnReceiveQueryParam(queryParam);
//         this.dataOfProjectList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//     }
//
//     onReceiveRouteParam(routeParam: ProjectListNsp.RouteParam): any {
//         this.fireResetPagination();
//         this.hardSyncQueryParamReal();
//         this.getList();
//     }
//
//     onReceiveRouteData(routeData: any): any {
//     }
//
//     onChangedTerm() {
//         this.getList();
//     }
//
//     public _setToQueryParams(queryParam) {
//         super.setToQueryParams(queryParam);
//     }
//
//     sortify(event) {
//         this.dataOfProjectList.sortings =
//             super.defaultSortify(this.dataOfProjectList.sortings, event);
//         this.getList();
//     }
//
//     chooseOne(item: ProjectDto.Create) {
//         this.selectedItem.emit(item);
//     }
//
//     selectDeselectItem(item: ProjectDto.Create) {
//         if (this.selectedList.filter(e => e.id === item.id).length > 0) {
//             this.selectedList
//                 .splice(this.selectedList.map(e => e.id)
//                     .indexOf(item.id), 1);
//             this.deSelectedItem.emit(item);
//         } else {
//             this.selectedList.push(item);
//             this.selectedItem.emit(item);
//         }
//     }
//
//     isInSelected(arg: { item: ProjectDto.Create, selectedList: ProjectDto.Create[] }) {
//         if (isNullOrUndefined(arg.selectedList)) {
//             return false;
//         }
//         // const b = arg.selectedList.includes(arg.item);
//         let b: boolean;
//         if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
//             b = true;
//         } else {
//             b = false;
//         }
//         return b;
//     }
//
//     onChooseMultiMode() {
//     }
//
//     onChooseOneMode() {
//     }
//
//     onDefaultMode() {
//     }
//
//     getComponentData(): ProjectListNsp.ComponentData {
//         return this.dataOfProjectList;
//     }
//
//     ngOnDestroy(): void {
//     }
// }
//
// export namespace ProjectListNsp {
//
//     export class ComponentData extends ListComponentData<ProjectDto.Create, RouteParam, QueryParam> {
//         labels: Labels = new Labels();
//     }
//
//
//     class Labels {
//         listTitle = 'لیست پروژه ها';
//     }
//
//     export class RouteParam {
//     }
//
//     export class QueryParam extends ListQueryParam {
//     }
// }
//
// export class getAllByFilterAndPaginationProject {
//     name: string;
//     code: string;
// }
