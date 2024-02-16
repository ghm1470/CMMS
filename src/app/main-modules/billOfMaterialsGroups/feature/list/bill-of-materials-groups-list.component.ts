import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {BOM} from '../../model/bom';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {Tools} from '../../../../shared/tools/Tools';
import {Province} from "../../../dashboard/model/dto/province";
import {ProvinceService} from "../../../basicInformation/province/endpoint/province.service";

@Component({
    selector: 'app-bill-of-materials-groups-list',
    templateUrl: './bill-of-materials-groups-list.component.html',
    styleUrls: ['./bill-of-materials-groups-list.component.scss']
})
export class BillOfMaterialsGroupsListComponent implements OnInit, OnDestroy {

///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: BOM.Create [] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    getAllByFilterAndPaginationBOM = new GetAllByFilterAndPaginationBOM();

    constructor(private entityService: BillOfMaterialsGroupsService,
                public router: Router,
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
        this.entityList = [];
        const getAllByFilterAndPaginationBOM = new GetAllByFilterAndPaginationBOM();
        if (this.getAllByFilterAndPaginationBOM.name !== null) {
            getAllByFilterAndPaginationBOM.name = this.getAllByFilterAndPaginationBOM.name;
        }
        if (this.getAllByFilterAndPaginationBOM.code !== null) {
            getAllByFilterAndPaginationBOM.code = this.getAllByFilterAndPaginationBOM.code;
        }
        this.entityService.getAllByPaginationBOM({
            paging,
            totalElements:-1,
            name: getAllByFilterAndPaginationBOM.name,
            code: getAllByFilterAndPaginationBOM.code,
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

    chooseSelectedItemForEdit(item: BOM.Create) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: BOM.Create, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.bomGroupName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.deleteBOM({BOMId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger(res);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }
      chooseSelectedItemForView(item: BOM.Create) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.VIEW, entityId: item.id},
      relativeTo: this.activatedRoute
    });
  }

    ngOnDestroy(): void {
    }


    //////////////////////////////////////

//
//   totalElements = 0;
//   totalPages = 0;
//   componentData = new ComponentData();
//   selectedItemForDelete = new DeleteModel();
//   roleList = new TokenRoleList();
//
//   dataOfBOMList: BOM.Create [] = [];
//   loading = false;
//   existInventory = false;
//   tools = Tools;
//
//
//   constructor(protected _Router: Router,
//               protected _ActivatedRoute: ActivatedRoute,
//               private cacheService: CacheService,
//               public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
//   ) {
//     super(_ActivatedRoute, _Router, CourseParam.RouteParam, CourseParam.QueryParam);
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
//
//
//
//   onReceiveRouteParam(routeParam: CourseParam.RouteParam) {
//   }
//
//   onReceiveQueryParam(queryParam: CourseParam.QueryParam) {
//     this.componentData.myQuery = queryParam;
//     this.loading = true;
//     this.getListSelf();
//
//   }
//
//
//   getListSelf(options?: any) {
//     this.loading = true;
//     this.dataOfBOMList = [];
//     const getAllByFilterAndPaginationBOM = new GetAllByFilterAndPaginationBOM();
//     if (this.componentData.myQuery.getAllByFilterAndPaginationBOM.name !== null) {
//       getAllByFilterAndPaginationBOM.name = this.componentData.myQuery.getAllByFilterAndPaginationBOM.name;
//     }
//     if (this.componentData.myQuery.getAllByFilterAndPaginationBOM.code !== null) {
//       getAllByFilterAndPaginationBOM.code = this.componentData.myQuery.getAllByFilterAndPaginationBOM.code;
//     }
//     this.billOfMaterialsGroupsService.getAllByPaginationBOM({
//       paging: this.componentData.myQuery.paging,
//       totalElements: this.totalElements,
//       name: getAllByFilterAndPaginationBOM.name,
//       code: getAllByFilterAndPaginationBOM.code,
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<BOM.Create>) => {
//       this.loading = false;
//       this.dataOfBOMList = res.content;
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
//       name: this.componentData.myQuery.getAllByFilterAndPaginationBOM.name,
//       code: this.componentData.myQuery.getAllByFilterAndPaginationBOM.code,
//     });
//   }
//
//   chooseSelectedItemForEdit(item: BOM.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, BOMId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: BOM.Create) {
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.VIEW, BOMId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.billOfMaterialsGroupsService.deleteBOM({BOMId: this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//         if (res !== true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//           DefaultNotify.notifyDanger(res);
//           return;
//         } else if (res === true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfBOMList = this.dataOfBOMList
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
//     getAllByFilterAndPaginationBOM: GetAllByFilterAndPaginationBOM;
//     userId;
//
//     constructor() {
//       this.paging = new Paging();
//       this.paging.page = 0;
//       this.paging.size = 10;
//       this.userId = null;
//       this.getAllByFilterAndPaginationBOM = new GetAllByFilterAndPaginationBOM();
//       this.getAllByFilterAndPaginationBOM.code = null;
//       this.getAllByFilterAndPaginationBOM.name = null;
//
//     }
//   }
// }

}

export class GetAllByFilterAndPaginationBOM {
    name: string;
    code: string;
}




