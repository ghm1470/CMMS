import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {DefaultNotify, ModalSize, Paging, Toolkit2} from '@angular-boot/util';
import {BOM} from '../../model/bom';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {GetAllByFilterAndPagination} from "../../../asset/feature/tree-list/tree-list.component";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-modal2',
    templateUrl: './modal2.component.html',
    styleUrls: ['./modal2.component.scss']
})
export class Modal2Component implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() BOMId;
    @Input() VariableToDeclareGet;
    @Output() getAssetList = new EventEmitter<boolean>();
    doSave = false;
    MyModalSize = ModalSize;
    assetSelectedList: BOM.BOMAsset[] = [];
    assetSelectedListCopy: BOM.BOMAsset[] = [];
    exist = false;
    disabledButton = false;
    BOMAssetList: BOM.BOMAssetListCreate [] = [];
    BOMAsset = new BOM.BOMAssetListCreate();

    assetList: Asset[] = [];
    assetList11: Asset[] = [];
    assetList12: Asset[] = [];
    assetList13: Asset[] = [];
    assetList2: Asset[] = [];
    asset = new Asset();
    categoryType = CategoryDto.CategoryType;
    parentId: string;
    list: any[] = [];
    allAssetSelectedList: BOM.BOMAsset[] = [];
    term: string;
    code: string;

    constructor(public assetService: AssetService,
                public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
                public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public router: Router) {
    }


    ngOnInit() {
        this.getAllAssetWithoutParentId();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.VariableToDeclareGet) {
            this.getCacheServiceList();
        }
    }

    pageSize = 10;
    pageIndex = 0;
    length = -1;

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getAllAssetWithoutParentId();

    }


    search() {
        if (this.term) {
            this.term = this.term.trim();
        }
        if (this.code) {
            this.code = this.code.trim();
            this.code = Toolkit2.Common.Fa2En(this.code);
        }

            this.pageIndex = 0;
            this.getAllAssetWithoutParentId();

    }

    loadingGetAllAssetWithoutParentId = false;

    getAllAssetWithoutParentId() {
        if (this.loadingGetAllAssetWithoutParentId) {
            return;
        }
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.assetList = [];
        this.loadingGetAllAssetWithoutParentId = true;

        if (this.term || this.code) {
            const dto = new GetAllByFilterAndPagination();
            dto.name = this.term;
            dto.code = this.code;
            this.assetService.getAllByFilterAndPagination(dto, {
                paging,
                totalElements:-1,
            })
                // this.entityService.getAll()
                .subscribe((res: any) => {
                    this.loadingGetAllAssetWithoutParentId = false;
                    if (res) {
                        this.assetList = res.content;
                        this.length = res.totalElements;
                    }
                    ;
                }, error => {
                    this.loadingGetAllAssetWithoutParentId = false;
                });
        } else {

            this.assetService.getAllAssetWithoutParentId({
                paging,
                totalElements:-1, categoryType: 'All'
            }).pipe(takeUntilDestroyed(this))
                .subscribe((res: any) => {
                    this.loadingGetAllAssetWithoutParentId = false;

                    // this.loading = false;
                    if (res) {
                        if (res.content) {
                            this.length = res.totalElements;

                            for (const item of res.content) {
                                this.asset = new Asset();
                                this.asset.categoryType = item.categoryType;
                                this.asset.code = item.code;
                                this.asset.isPartOfAsset = item.isPartOfAsset;
                                this.asset.id = item.id;
                                this.asset.name = item.name;
                                this.asset.status = item.status;
                                this.asset.hasChild = item.hasChild;
                                // if (this.assetSelectedList.length)
                                if (this.assetSelectedList.findIndex(e => e.assetId === this.asset.id) !== -1) {
                                    this.asset.assetQuantity = this.assetSelectedList.find(e => e.assetId === this.asset.id).assetQuantity;
                                }
                                this.assetList.push(this.asset);
                            }
                        }
                    }

                }, error => {
                    this.loadingGetAllAssetWithoutParentId = false;

                });
        }
    }

    selectedParentIdForGetChild: string;
    loadingForGetChild = false;

    getChildList(parent: Asset) {
        this.selectedParentIdForGetChild = parent.id;
        this.loadingForGetChild = true;
        this.assetService.getAllAssetByParentId({parentId: parent.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetDto.CreateAsset[]) => {
                parent.openPlus = true;
                this.loadingForGetChild = false;
                if (res && res.length) {
                    parent.childAssetList = res;
                } else {
                    DefaultNotify.notifyDanger('زیر مجموعه ای یافت نگردید.', '', NotiConfig.notifyConfig);
                }
            });
    }

    getCacheServiceList() {
        this.assetSelectedList = [];
        this.assetSelectedList = this.cacheService.get('AssetSelectedList', CacheType.LOCAL_STORAGE);
        for (const item of this.assetList) {
            item.assetQuantity = 0;
            for (const one of this.assetSelectedList) {
                if (one.assetId === item.id) {
                    item.assetQuantity = one.assetQuantity;
                }

            }

        }

    }


    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
    }

    // getListOnCallback(): Function {
    //   return undefined;
    // }

    sendItemForModal2(item: Asset) {
        this.exist = false;
        const assetSelected = new BOM.BOMAsset();
        if (this.assetSelectedList.length > 0) {
            for (let i = 0; i < this.assetSelectedList.length; i++) {
                if (this.assetSelectedList[i].assetId === item.id) {
                    this.exist = true;
                    break;
                }
            }
            if (this.exist === false) {
                if (!item.assetQuantity) {
                    DefaultNotify.notifyDanger('تعداد دارایی را انتخاب کنید.', '', NotiConfig.notifyConfig);
                    return;
                }
                assetSelected.assetId = item.id;
                assetSelected.assetName = item.name;
                assetSelected.assetCode = item.code;
                assetSelected.assetQuantity = item.assetQuantity;
                this.assetSelectedList.push(assetSelected);
                this.assetSelectedListCopy = this.assetSelectedListCopy.filter(e => e.assetId === assetSelected.assetId);
            }
            this.exist = false;
        } else if (this.assetSelectedList.length === 0) {
            if (!item.assetQuantity) {
                DefaultNotify.notifyDanger('تعداد دارایی را انتخاب کنید.', '', NotiConfig.notifyConfig);
                return;
            }
            assetSelected.assetId = item.id;
            assetSelected.assetName = item.name;
            assetSelected.assetCode = item.code;
            assetSelected.assetQuantity = item.assetQuantity;
            assetSelected.assetQuantity = item.assetQuantity;
            this.assetSelectedList.push(assetSelected);
            this.assetSelectedListCopy = [];
        }
        this.exist = false;
    }


    // openChildWhenOpenModal(id) {
    //   this.assetService.getAllParent({assetId: id})
    //     .pipe(takeUntilDestroyed(this)).subscribe((idList: any[]) => {
    //     if (idList && idList.length) {
    //       this.openMenu(idList, 0);
    //     }
    //   });
    // }

    openMenu(list, index) {
        if (list.length > index) {
            setTimeout(() => {
                $('#imagFalse' + list[index]).click();
                this.openMenu(list, index + 1);
            }, 200);
        }
    }


    hasItem(id: string) {
        let has = false;
        if (this.assetSelectedList) {
            if (this.assetSelectedList.length) {
                for (const item of this.assetSelectedList) {
                    if (item.assetId === id) {
                        has = true;
                        break;
                    } else {
                        has = false;
                    }
                }
                return has;
            }
        }
    }

    deleteItemFromModal2(item: BOM.BOMAsset, i) {
        this.assetSelectedList.splice(i, 1);
        this.assetList.find(e => e.id === item.assetId).assetQuantity = new Asset().assetQuantity;
    }

    action() {
        this.BOMAssetList = [];
        for (const item of this.assetSelectedList) {
            this.BOMAsset = new BOM.BOMAssetListCreate();
            this.BOMAsset.assetId = item.assetId;
            this.BOMAsset.assetQuantity = item.assetQuantity;
            this.BOMAssetList.push(this.BOMAsset);
        }
        // for (let i = 0 ;i < this.assetSelectedList.length; i++) {
        //   this.BOMAssetList[i].assetQuantity =  this.assetSelectedList[i].assetQuantity;
        // }
        this.allAssetSelectedList = this.assetSelectedList;
        this.cacheService.set('AssetSelectedList', this.allAssetSelectedList, CacheType.LOCAL_STORAGE);

        this.billOfMaterialsGroupsService.updateAssetBOM(this.BOMAssetList, {id: this.BOMId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            if (res) {
                this.disabledButton = false;
                DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                this.cancelModal();
            }
        });
    }

    cancelModal() {
        this.getAssetList.emit(true);
        ModalUtil.hideModal('modal2');
    }

    // getOneBOMByCacheService() {
    //   this.assetSelectedList = [];
    //   this.assetSelectedList = this.cacheService.get('allAssetsList', CacheType.LOCAL_STORAGE);
    //
    // }


    methodTow(assetOfAssetList: Asset) {
        assetOfAssetList.childAssetList = [];
        assetOfAssetList.openPlus = false;

    }

    hideModal() {
        ModalUtil.hideModal('modal2');

    }
}


export class Asset {
    id: string;
    name: string; //
    // description: string;  //
    code: string; //
    status: boolean; //
    // assetTemplateId: string; //
    isPartOfAsset: string;
    assetQuantity: number;
    // image: DocumentFile = new DocumentFile();
    // users: Array<any>; //
    categoryType: CategoryType;
    // documents: Array<CompanyDto.DocumentFile>; //
    childAssetList: AssetDto.CreateAsset[] = [];
    openPlus = false;
    marginRight = 5;
    hasChild = false;
}
