import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {AssetDto} from '../../model/dto/assetDto';
import {ActionMode, DefaultNotify, ModalSize, Paging, Toolkit2} from '@angular-boot/util';
import {AssetService} from '../../endpoint/asset.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {AssetTemplateDto} from '../../../assetTemplate/model/dto/assetTemplateDto';
import {AssetTemplateService} from '../../../assetTemplate/endpoint/asset-template.service';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {isNullOrUndefined} from 'util';
import {AssetCategoryService} from '../../../basicInformation/asset-category/endpoint/asset-category.service';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import {FileDataTable} from '../../../../shared/export-file/export-file/export-file.component';
import AssetPriority = CategoryDto.AssetPriority;
import CategoryType = CategoryDto.CategoryType;

declare var $: any;

@Component({
    selector: 'app-tree-list',
    templateUrl: './tree-list.component.html',
    styleUrls: ['./tree-list.component.scss']
})
export class TreeListComponent implements OnInit, OnChanges, OnDestroy {

    constructor(private assetService: AssetService,
                public activatedRoute: ActivatedRoute,
                public assetTemplateService: AssetTemplateService,
                private cacheService: CacheService,
                private assetCategoryService: AssetCategoryService,
                public router: Router) {
        this.categoryTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<CategoryType>(CategoryType));
        this.assetPriorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AssetPriority>(AssetPriority));

        this.statusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AssetStatus>(AssetStatus));
        this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this)).subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            this.getAllAssetWithoutParentId();

        });
    }

    actionMode = ActionMode;
    mode: ActionMode;
    @Input() readService;
    MyModalSize = ModalSize;
    assetList: Asset[] = [];
    asset = new Asset();
    categoryType = CategoryDto.CategoryType;
    j = -1;
    lastAssetThenClicked = '-1';
    getAllByFilterAndPagination = new GetAllByFilterAndPagination();
    assetName = false;
    assetCode = false;
    assetTemplateId = false;
    categoryTypeId = false;
    categoryTypeList = [] as EnumObject[];
    assetPriorityList = [] as EnumObject[];
    status = false;
    assetSearchModal = ModalUtil.generateModalId();
    assetCopyModal = ModalUtil.generateModalId();
    assetTemplateList: AssetTemplateDto.Create[] = [];
    showSearchResult = false;
    loading = false;
    selectedItemForDelete = new DeleteModel();

    statusList = [] as EnumObject[];
    firstStatus = AssetStatus.ACTIVE;
    roleList = new TokenRoleList();
    assetCategoryList: any[] = [];
    assetNameAndIdList: any[] = [];

    ///////////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    listMode = true;

    loadingGetAllAssetWithoutParentId = false;

    selectedParentIdForGetChild: string;
    loadingForGetChild = false;

    listForDelete = [];
    parentForDeleteItems: Asset;

    selectedAssetId: string;
    assetForUpdate: Asset;
    ////////////دریافت  pdf,excel
    entityListForReport: GetAllAssetForReport[] = [];
    fileDataTableList: FileDataTable[] = [
        {thTitle: 'نام ', tdTitle: 'name'},
        {thTitle: 'استقرار', tdTitle: 'parentName'},
        {thTitle: 'کد', tdTitle: 'code'},
        {thTitle: 'خانواده گروه ', tdTitle: 'categoryTitle'},
        {thTitle: 'اولویت', tdTitle: 'assetPriorityTitle'},
        {thTitle: 'وضعیت', tdTitle: 'statusTitle'},
        {thTitle: 'نوع', tdTitle: 'categoryTypeTitle'},
    ];


    ////////////دریافت  pdf,excel
    ngOnInit() {
        // this.getAllByFilterAndPagination.status = this.FirstStatus[this.firstStatus.toString()] as unknown as AssetStatus;
        // this.getAllAssetWithoutParentId();
        this.getRoleListKey();
        this.getAllAssetCategory();
        this.getAllRootBuildings();

    }

    getAllAssetCategory() {
        this.assetCategoryService.getAll().pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.assetCategoryList = res;
            }
        });
    }
    /// خواندن داریی های که از نوع ساختمان هستند

    getAllRootBuildings() {
        this.assetService.getAllRootBuildings().pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.assetNameAndIdList = res;
            }
        });
    }

    ngOnChanges() {
        if (this.readService) {
            this.getAllAssetTemplate();
        }

    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    bySearch = false;

    getAllAssetWithoutParentId() {
        if (this.loadingGetAllAssetWithoutParentId) {
            return;
        }
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.assetList = [];
        this.loadingGetAllAssetWithoutParentId = true;
        if (this.getAllByFilterAndPagination.name ||
            this.getAllByFilterAndPagination.code ||
            this.getAllByFilterAndPagination.categoryId ||
            this.getAllByFilterAndPagination.categoryType ||
            this.getAllByFilterAndPagination.assetPriority ||
            this.getAllByFilterAndPagination.assetId ||
            !isNullOrUndefined(this.getAllByFilterAndPagination.status)) {
            const dto = this.getAllByFilterAndPagination;
            this.bySearch = false;
            this.assetService.getAllByFilterAndPagination(dto, {
                paging,
                totalElements: -1,
            })
                // this.entityService.getAll()
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingGetAllAssetWithoutParentId = false;
                if (res) {
                    this.assetList = res.content;
                    this.bySearch = true;
                    this.length = res.totalElements;
                }
            }, error => {
                this.loadingGetAllAssetWithoutParentId = false;
            });
        } else {

            this.assetService.getAllAssetWithoutParentId({
                paging,
                totalElements: -1, categoryType: 'All'
            }).pipe(takeUntilDestroyed(this))
                .subscribe((res: any) => {
                    this.loadingGetAllAssetWithoutParentId = false;

                    // this.loading = false;
                    if (res) {
                        if (res.content) {
                            this.length = res.totalElements;
                            this.bySearch = false;

                            for (const item of res.content) {
                                this.asset = new Asset();
                                this.asset.categoryType = item.categoryType;
                                this.asset.assetPriority = item.assetPriority;
                                this.asset.assetTemplateName = item.assetTemplateName;
                                this.asset.code = item.code;
                                this.asset.categoryId = item.categoryId;
                                this.asset.categoryTitle = item.categoryTitle;
                                this.asset.isPartOfAsset = item.isPartOfAsset;
                                this.asset.id = item.id;
                                this.asset.name = item.name;
                                this.asset.status = item.status;
                                this.asset.hasChild = item.hasChild;
                                // if (this.assetSelectedList.length)
                                this.assetList.push(this.asset);
                            }
                        }
                    }

                }, error => {
                    this.loadingGetAllAssetWithoutParentId = false;

                });
        }
    }

    getAllAssetWithoutParentId1() {
        this.loading = true;
        this.assetList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.assetService.getAllAssetWithoutParentId({
            paging,
            totalElements: -1, categoryType: 'All'
        }).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loading = false;
                if (res) {
                    if (res.content) {
                        this.length = res.totalElements;
                        for (const item of res.content) {
                            this.asset = new Asset();
                            this.asset.categoryType = item.categoryType;
                            // this.asset.assetTemplateName = item.assetTemplateName;
                            this.asset.assetPriority = item.assetPriority;
                            this.asset.code = item.code;
                            this.asset.categoryId = item.categoryId;
                            this.asset.categoryTitle = item.categoryTitle;
                            this.asset.isPartOfAsset = item.isPartOfAsset;
                            this.asset.id = item.id;
                            this.asset.name = item.name;
                            this.asset.status = item.status;
                            this.asset.hasChild = item.hasChild;
                            this.assetList.push(this.asset);
                        }
                    }
                }
            });
    }

    getChildList(parent: Asset) {
        if (this.loadingForGetChild) {
            return;
        }
        this.selectedParentIdForGetChild = parent.id;
        this.loadingForGetChild = true;
        this.assetService.getAllAssetByParentId({parentId: parent.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                parent.openPlus = true;
                this.loadingForGetChild = false;
                if (res && res.length) {
                    parent.childAssetList = res;
                } else {
                    parent.hasChild = false;
                    DefaultNotify.notifyDanger('زیر مجموعه ای یافت نگردید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingForGetChild = false;
            });
    }

    ngOnDestroy(): void {
    }


    methodTow(assetOfAssetList: Asset) {
        assetOfAssetList.childAssetList = [];
        assetOfAssetList.openPlus = false;

    }

    chooseSelectedItemForEdit(item: Asset) {
        this.assetForUpdate = item;
        this.selectedAssetId = item.id;
        this.mode = ActionMode.EDIT;
        this.showActionComponent('edit');

        // this.router.navigate(['action'], {
        //     queryParams: {mode: ActionMode.EDIT, entityId: item.id},
        //     relativeTo: this.activatedRoute
        // });
    }

    chooseSelectedItemForView(item: AssetDto.GetAllByFilterAndPagination) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;

            this.assetService.delete({assetId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (res === true) {
                    this.listForDelete.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
                    if (this.parentForDeleteItems.id) {
                        if (this.listForDelete.length === 0) {
                            this.parentForDeleteItems.hasChild = false;
                        }
                    }
                    // this.processPage();
                } else if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    // DefaultNotify.notifyDanger('این سازمان قابل حذف نمی باشد. برای حذف آن ابتدا باید کاربرهای سازمان را حذف نمایید.');
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);

                }
            });
        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    showModalDelete(item, i, listForDelete, parent?) {
        if (parent) {
            this.parentForDeleteItems = parent;
        } else {
            this.parentForDeleteItems = new Asset();
        }
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.listForDelete = listForDelete;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    showModalAssetSearch() {
        ModalUtil.showModal(this.assetSearchModal);
    }

    hideModalAssetSearch() {
        ModalUtil.hideModal(this.assetSearchModal);
    }

    changeStatus(event) {
        this.getAllByFilterAndPagination.status = event;
    }

    changeAssetTemplate(event) {
        if (event) {
            this.getAllByFilterAndPagination.assetTemplateId = event.id;
        } else {
            this.getAllByFilterAndPagination.assetTemplateId = null;
        }
    }

    getAllAssetTemplate() {
        this.assetTemplateService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetTemplateDto.Create[]) => {
                if (res && res.length) {
                    this.assetTemplateList = res;
                }
            });
    }

    search() {
        if (this.getAllByFilterAndPagination.name) {
            this.getAllByFilterAndPagination.name = this.getAllByFilterAndPagination.name.trim();
        }
        if (this.getAllByFilterAndPagination.code) {
            this.getAllByFilterAndPagination.code = this.getAllByFilterAndPagination.code.trim();
            this.getAllByFilterAndPagination.code = Toolkit2.Common.Fa2En(this.getAllByFilterAndPagination.code);
        }

        this.pageIndex = 0;
        this.getAllAssetWithoutParentId();

    }

    getListByFilter() {
        if (this.getAllByFilterAndPagination.name ||
            this.getAllByFilterAndPagination.code ||
            this.getAllByFilterAndPagination.categoryId ||
            this.getAllByFilterAndPagination.categoryType ||
            this.getAllByFilterAndPagination.assetPriority ||
            this.getAllByFilterAndPagination.assetId ||
            !isNullOrUndefined(this.getAllByFilterAndPagination.status)) {
            this.showSearchResult = true;
            this.getAllByFilterAndPagination = JSON.parse(JSON.stringify(this.getAllByFilterAndPagination));
            // setTimeout(() => {
            //     this.showSearchResult = true;
            // }, 5);
        } else {
            this.showSearchResult = false;
        }
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            },
        });

    }

    showActionComponent(type) {
        if (type === 'add') {
            this.mode = ActionMode.ADD;
            this.selectedAssetId = null;
        }
        setTimeout(e => {
            this.listMode = false;
        }, 1);
    }

    emitAssetForUpdate(event: Asset) {
        this.assetForUpdate.name = event.name;
        this.assetForUpdate.code = event.code;
        this.assetForUpdate.categoryId = event.categoryId;
        this.assetForUpdate.categoryTitle = event.categoryTitle;
        this.assetForUpdate.categoryType = event.categoryType;
        this.assetForUpdate.status = event.status;


    }

    backEmit() {
        this.listMode = true;
        if (this.getAllByFilterAndPagination.name ||
            this.getAllByFilterAndPagination.code ||
            this.getAllByFilterAndPagination.categoryId ||
            this.getAllByFilterAndPagination.categoryType ||
            this.getAllByFilterAndPagination.assetPriority ||
            this.getAllByFilterAndPagination.assetId ||
            !isNullOrUndefined(this.getAllByFilterAndPagination.status)) {
            setTimeout(e => {
                // $('#assets-search-btn').click();
                $('#assets-search').addClass('show');
                this.search();
            }, 5);
        }
    }

    loadingCopy = false;
    assetForCopyId: string;
    codeForCopy: string;
    parentListForCopy: Asset[];
    showModalBody = false;

    showModalAssetCopyModal(assetId, parentList: Asset[]) {
        this.codeForCopy = null;
        if (this.loadingCopy) {
            return;
        }
        this.parentListForCopy = parentList;
        this.assetForCopyId = assetId;
        this.showModalBody = true;

        setTimeout(() => {
            ModalUtil.showModal(this.assetCopyModal);
        }, 100);

    }

    changeAssetCode() {
        if (!this.codeForCopy) {
            DefaultNotify.notifyDanger('کد وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        this.assetService.checkAssetCode({assetCode: this.codeForCopy})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res && res.exist) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
            } else {
                ModalUtil.hideModal(this.assetCopyModal);
                this.copyAsset();
            }
        });
    }

    // resetInput(id) {
    //     const $el = $('#' + id);
    //     $el.wrap('<form>').closest('form').get(0).reset();
    //     $el.unwrap();
    // }

    copyAsset() {
        this.loadingCopy = true;
        this.assetService.getOneTow({assetId: this.assetForCopyId})
            .pipe(takeUntilDestroyed(this)).subscribe((resGetOne: AssetDto.GetOneAsset) => {
            let asset = new AssetDto.CreateAsset();
            asset = resGetOne.mainAsset;
            asset.id = null;
            asset.code = this.codeForCopy;
            asset.hasChild = false;
            asset.name = ' کپی _  ' + asset.name;
            this.assetService.create(asset)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loadingCopy = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت کپی  شد.', '', NotiConfig.notifyConfig);
                    this.parentListForCopy.push(JSON.parse(JSON.stringify(res)));
                    this.scrollTop();

                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingCopy = false;
            });
        }, errorGetOne => {
            this.loadingCopy = false;

        });

    }

    scrollTop() {
        $('#content').animate({
            scrollTop: $(window).height() * 10
        }, 1200);
    }

    /////خواندن دیتا برای گزارش اکسل
    EmActivityGetPageForExcel() {
        const dto = this.getAllByFilterAndPagination;
        this.assetService.getAllForExcel(dto).pipe(takeUntilDestroyed(this)
        ).subscribe((res) => {
            const list: GetAllAssetForReport[] = res;
            list.map(e => {
                e.statusTitle = 'فعال';
                if (e.status === false) {
                    e.statusTitle = 'غیر فعال';
                }
                switch (e.categoryType.toString()) {
                    case CategoryType[CategoryType.FACILITY]: {
                        e.categoryTypeTitle = CategoryType.FACILITY.toString();
                        break;
                    }
                    case CategoryType[CategoryType.BUILDING]: {
                        e.categoryTypeTitle = CategoryType.BUILDING.toString();
                        break;
                    }
                    case CategoryType[CategoryType.TOOLS]: {
                        e.categoryTypeTitle = CategoryType.TOOLS.toString();
                        break;
                    }

                }
                switch (e.assetPriority.toString()) {
                    case AssetPriority[AssetPriority.important]: {
                        e.assetPriorityTitle = AssetPriority.important.toString();
                        break;
                    }
                    case AssetPriority[AssetPriority.normal]: {
                        e.assetPriorityTitle = AssetPriority.normal.toString();
                        break;
                    }
                    case AssetPriority[AssetPriority.strategic]: {
                        e.assetPriorityTitle = AssetPriority.strategic.toString();
                        break;
                    }

                }
            });
            this.entityListForReport = list;
        }, error => {
        });
    }
}

// ====================================00000=======================================
export class Asset {
    id: string;
    name: string; //
    assetTemplateName: string; //
    assetPriority: string; //
    assetTemplateId: string;
    // description: string;  //
    code: string; //
    categoryId: string; // خانواده گروه
    categoryTitle: string; // خانواده گروه
    status; //
    // assetTemplateId: string; //
    isPartOfAsset: string;
    // image: DocumentFile = new DocumentFile();
    // users: Array<any>; //
    categoryType: CategoryType;
    // documents: Array<CompanyDto.DocumentFile>; //
    childAssetList: AssetDto.CreateAsset[] = [];
    openPlus = false;
    marginRight = 5;
    hasChild = false;
}


export class GetAllByFilterAndPagination {
    name: string;
    code: string;
    categoryId: string;
    assetId: string;
    categoryType: CategoryType;
    assetTemplateId: string;
    assetPriority: string;
    status: AssetStatusSearch;
    id: string;
    userId: string;
    userTypeId: string;
    parentLocationId: string;
}

export enum AssetStatus {
    ACTIVE = 'فعال' as any,
    INACTIVE = 'غیرفعال' as any,
    NULL = 'NULL' as any,

}

export enum AssetStatusSearch {
    ACTIVE = 'فعال' as any,
    INACTIVE = 'غیرفعال' as any,
    ALL = 'همه' as any,

}

export class GetAllAssetForReport {
    id: string;
    name: string;
    parentName: string;
    code: string;
    status: boolean;
    statusTitle: string;
    categoryType: CategoryType;
    categoryTypeTitle: string;
    assetPriority: AssetPriority;
    assetPriorityTitle: string;
    categoryId: string;
    categoryTitle: string;
}
