import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultNotify, ModalSize, Paging, Toolkit2} from '@angular-boot/util';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {ModalUtil} from '@angular-boot/widgets';
import CategoryType = CategoryDto.CategoryType;
import {GetAllByFilterAndPagination} from "../../../asset/feature/tree-list/tree-list.component";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-view-asset',
    templateUrl: './view-asset.component.html',
    styleUrls: ['./view-asset.component.scss']
})
export class ViewAssetComponent implements OnInit, OnDestroy, OnChanges {
    @Output() parentAsset = new EventEmitter<Asset>();
    @Input() openModal: boolean;
    MyModalSize = ModalSize;
    assetList: Asset[] = [];
    asset = new Asset();
    categoryType = CategoryDto.CategoryType;
    assetList2: Asset[] = [];
    assetList5: Asset[] = [];
    assetList6: Asset[] = [];
    assetList7: Asset[] = [];
    j = -1;
    lastAssetThenClicked = '-1';
    term: string;
    code: string;

    constructor(private assetService: AssetService) {
    }

    ngOnInit() {
        this.assetList2 = [];
        this.assetList = [];
        this.getAllAssetWithoutParentId();
    }

    ngOnChanges(): void {

    }

    pageSize = 10;
    pageIndex = 0;
    length = -1;

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
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.assetService.getAllAssetWithoutParentId({
            paging,
            totalElements:-1, categoryType: 'All'
        }).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
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
                            this.assetList.push(this.asset);
                        }
                    }
                }
                // if (res && res.length) {
                //
                //     for (const item of res) {
                //         this.asset = new Asset();
                //         this.asset.categoryType = item.categoryType;
                //         this.asset.code = item.code;
                //         this.asset.isPartOfAsset = item.isPartOfAsset;
                //         this.asset.id = item.id;
                //         this.asset.name = item.name;
                //         this.asset.status = item.status;
                //         this.asset.hasChild = item.hasChild;
                //         this.assetList.push(this.asset);
                //     }
                // }
            });
    }

    selectedParentIdForGetChild: string;
    loadingForGetChild = false;

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
                    DefaultNotify.notifyDanger('زیر مجموعه ای یافت نگردید.', '', NotiConfig.notifyConfig);
                }
            },error => {
                this.loadingForGetChild = false;
            });
    }

    ngOnDestroy(): void {
    }


    cancelModal() {
        ModalUtil.hideModal('viewAssetForScheduleMaintenance');
    }


    methodTow(assetOfAssetList: Asset) {
        assetOfAssetList.childAssetList = [];
        assetOfAssetList.openPlus = false;

    }

    treeMethod(item: Asset) {
        this.parentAsset.emit(item);
        this.cancelModal();
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
    // image: DocumentFile = new DocumentFile();
    // users: Array<any>; //
    categoryType: CategoryType;
    // documents: Array<CompanyDto.DocumentFile>; //
    childAssetList: AssetDto.CreateAsset[] = [];
    openPlus = false;
    marginRight = 5;
    hasChild = false;
}
