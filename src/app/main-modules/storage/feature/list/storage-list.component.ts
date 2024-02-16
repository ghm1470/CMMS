import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {StorageService} from '../../endpoint/storage.service';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../../part/model/dto/part';
import Storage = PartDto.Storage;
import {AssetService} from "../../../asset/endpoint/asset.service";
import {UserDto} from "../../../user/model/dto/user-dto";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-storage-list',
    templateUrl: './storage-list.component.html',
    styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent implements OnInit, OnDestroy {


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    searchCode: string;

    entityList: Storage[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();

    constructor(private entityService: StorageService,
                public router: Router,
                private cacheService: CacheService,
                private assetService: AssetService,
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
        this.getAllAssetByTerm('onInit');
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
            code: this.searchCode,
            assetId: this.selectedAssetId,
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

    chooseSelectedItemForSee(item: Storage) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForEdit(item: Storage) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item: Storage, i) {
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
            this.entityService.delete({storageId: this.selectedItemForDelete.id})
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
            }, error => {
                this.selectedItemForDelete.loading = false;
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    ngOnDestroy(): void {
    }

    selectedAssetId: string;
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
        this.assetService.getAllAssetByTerm({paging, totalElements: 0, term: this.termForAsset})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAssetList = false;
            if (this.assetList.length === 0) {
                this.assetList = res.content;
            } else {
                this.assetList = this.assetList.concat(res.content);
            }
            this.assetList = this.assetList.filter(u => u.id !== this.selectedAssetId);

        });
    }

    //////////////////////////////////////

    //
    //
    // @Input() listOnCallback: () => any;
    // totalElements = 0;
    // dataOfStorageList: StorageListNsp.ComponentData;
    // selectedItemForDelete = new DeleteModel();
    // loading = false;
    //
    // roleList = new TokenRoleList();
    // searchCode: string;
    //
    // constructor(public storageService: StorageService,
    //             public activatedRoute: ActivatedRoute,
    //             private cacheService: CacheService,
    //             public router: Router) {
    //     super(activatedRoute, router, StorageListNsp.RouteParam, StorageListNsp.QueryParam);
    //     this.dataOfStorageList =
    //         new StorageListNsp.ComponentData(StorageListNsp.RouteParam, StorageListNsp.QueryParam);
    //     /**
    //      * If You want change default values in dataOfStorageList, you can do like blew
    //      * --> this.dataOfStorageList.init({sizeList: [2, 5, 10, 15]});
    //      */
    //     this.dataOfStorageList =
    //         new StorageListNsp.ComponentData(StorageListNsp.RouteParam, StorageListNsp.QueryParam);
    //
    //     this.fireInitiatePagination();
    //     super.receiveData();
    // }
    //
    // canDeactivate(): boolean {
    //     return true;
    // }
    //
    // private fireInitiatePagination() {
    //     this.initiatePagination({size: 10});
    // }
    //
    // private fireResetPagination() {
    //     this.resetPagination({size: 10});
    // }
    //
    // ngOnInit() {
    //     // this._setToQueryParams(this.dataOfStorageList.queryParam);
    //     this.getRoleListKey();
    // }
    //
    // getListOnCallback() {
    //     return this.listOnCallback;
    // }
    //
    // getListRemoteArg(optionsOfGetList?: any) {
    //     return new ListHelper(
    //         {
    //             paging: this.dataOfStorageList.queryParamReal.paging,
    //             term: this.dataOfStorageList.term
    //         }
    //     );
    // }
    //
    //
    // getRoleListKey() {
    //     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //         if (res) {
    //             this.roleList = res;
    //         }
    //     });
    // }
    //
    //
    // getListSelf(options?: any) {
    //     this.loading = true;
    //     this.storageService.getAllByPagination({
    //         paging: this.dataOfStorageList.queryParamReal.paging,
    //         totalElements: this.dataOfStorageList.itemPage.totalElements,
    //         term: this.dataOfStorageList.term,
    //         code: this.searchCode,
    //     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Storage>) => {
    //         this.loading = false;
    //
    //         this.dataOfStorageList.itemPage = res;
    //     });
    // }
    //
    // chooseSelectedItemForEdit(item: Storage) {
    //     this.router.navigate(['action'], {
    //         queryParams: {mode: ActionMode.EDIT, storageId: item.id},
    //         relativeTo: this.activatedRoute
    //     });
    // }
    //
    // chooseSelectedItemForView(item: Storage) {
    //     this.router.navigate([item.id, ActionMode.VIEW], {
    //         relativeTo: this.activatedRoute
    //     });
    // }
    //
    //
    // deleteItem(event) {
    //     if (event) {
    //         this.selectedItemForDelete.loading = true;
    //         this.storageService.delete({storageId: this.selectedItemForDelete.id})
    //             .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //
    //
    //             if (res === true) {
    //                 ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
    //
    //                 this.dataOfStorageList.itemPage.content = this.dataOfStorageList.itemPage.content
    //
    //                     .filter((e) => {
    //                         return e.id !== this.selectedItemForDelete.id;
    //                     });
    //                 this.processPage();
    //
    //                 DefaultNotify.notifySuccess('با موفقیت حذف شد.');
    //
    //             } else {
    //                 DefaultNotify.notifyDanger(res);
    //                 ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
    //             }
    //         }, error => {
    //         });
    //
    //     } else {
    //         ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
    //     }
    // }
    //
    //
    // showModalDelete(item, i) {
    //     this.selectedItemForDelete.loading = false;
    //
    //     this.selectedItemForDelete.id = item.id;
    //     this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
    //     this.selectedItemForDelete.index = i;
    //     setTimeout(e => {
    //         ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
    //     }, 10);
    // }
    //
    // onReceiveQueryParam(queryParam: StorageListNsp.QueryParam): any {
    //     super.defaultOnReceiveQueryParam(queryParam);
    //     this.dataOfStorageList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
    // }
    //
    // onReceiveRouteParam(routeParam: StorageListNsp.RouteParam): any {
    //     this.fireResetPagination();
    //     this.hardSyncQueryParamReal();
    //     this.getList();
    // }
    //
    // onReceiveRouteData(routeData: any): any {
    // }
    //
    // onChangedTerm() {
    //     this.getList();
    // }
    //
    // public _setToQueryParams(queryParam) {
    //     super.setToQueryParams(queryParam);
    // }
    //
    // sortify(event) {
    //     this.dataOfStorageList.sortings =
    //         super.defaultSortify(this.dataOfStorageList.sortings, event);
    //     this.getList();
    // }
    //
    // chooseOne(item: Storage) {
    //     this.selectedItem.emit(item);
    // }
    //
    // selectDeselectItem(item: Storage) {
    //     if (this.selectedList.filter(e => e.id === item.id).length > 0) {
    //         this.selectedList
    //             .splice(this.selectedList.map(e => e.id)
    //                 .indexOf(item.id), 1);
    //         this.deSelectedItem.emit(item);
    //     } else {
    //         this.selectedList.push(item);
    //         this.selectedItem.emit(item);
    //     }
    // }
    //
    // isInSelected(arg: { item: Storage, selectedList: Storage[] }) {
    //     if (isNullOrUndefined(arg.selectedList)) {
    //         return false;
    //     }
    //     // const b = arg.selectedList.includes(arg.item);
    //     let b: boolean;
    //     if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
    //         b = true;
    //     } else {
    //         b = false;
    //     }
    //     return b;
    // }
    //
    // onChooseMultiMode() {
    // }
    //
    // onChooseOneMode() {
    // }
    //
    // onDefaultMode() {
    // }
    //
    // getComponentData(): StorageListNsp.ComponentData {
    //     return this.dataOfStorageList;
    // }
    //
    // ngOnDestroy(): void {
    // }
}

//
// export namespace StorageListNsp {
//
//     export class ComponentData extends ListComponentData<Storage, RouteParam, QueryParam> {
//         labels: Labels = new Labels();
//     }
//
//
//     class Labels {
//         listTitle = 'لیست انبار ';
//     }
//
//     export class RouteParam {
//     }
//
//     export class QueryParam extends ListQueryParam {
//     }
// }
