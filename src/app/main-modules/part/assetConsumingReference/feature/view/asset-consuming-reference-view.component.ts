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
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';

import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    ModalSize,
    PageContainer,
    Paging
} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';


import {ModalUtil} from '@angular-boot/widgets';
import CategoryType = CategoryDto.CategoryType;
import {CategoryDto} from '../../../../category/model/dto/categoryDto';
import {AssetService} from '../../../../asset/endpoint/asset.service';
import {AssetDto} from '../../../../asset/model/dto/assetDto';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-asset-consuming-reference-view',
    templateUrl: './asset-consuming-reference-view.component.html',
    styleUrls: ['./asset-consuming-reference-view.component.scss']
})
export class AssetConsumingReferenceViewComponent implements OnInit, OnDestroy, OnChanges {
    @Output() parentAsset = new EventEmitter<Asset>();
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

    constructor(private assetService: AssetService) {
    }

    ngOnInit() {
        this.assetList2 = [];
        this.assetList = [];
        this.getAllAssetWithoutParentId();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //   if (changes.parentAsset) {
        //     alert(this.parentAsset)
        //   }
        //
    }
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    getAllAssetWithoutParentId() {
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
                    parent.hasChild = false;
                    DefaultNotify.notifyDanger('زیر مجموعه ای یافت نگردید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingForGetChild = false;
            });
    }
    methodTow(assetOfAssetList: Asset) {
        assetOfAssetList.childAssetList = [];
        assetOfAssetList.openPlus = false;

    }
    getChildList1(parent: Asset, i) {
        if (this.j !== i && this.lastAssetThenClicked !== parent.id) {
            this.j = i;
            this.assetService.getAllAssetByParentId({parentId: parent.id}).pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetDto.CreateAsset[]) => {
                    if (res && res.length) {
                        this.assetList2 = this.assetList;
                        this.assetList = [];
                        for (let j = 0; j <= i; j++) {
                            this.assetList.push(this.assetList2[j]);
                        }
                        for (const item of res) {
                            this.asset = new Asset();
                            this.asset.categoryType = item.categoryType;
                            this.asset.code = item.code;
                            this.asset.isPartOfAsset = item.isPartOfAsset;
                            this.asset.id = item.id;
                            this.asset.name = item.name;
                            this.asset.status = item.status;
                            this.asset.hasChild = item.hasChild;
                            this.asset.marginRight = parent.marginRight + 30;
                            this.assetList.push(this.asset);
                        }
                        this.assetList.find(e => e.id === parent.id).openPlus = true;
                    }
                    for (let k = i + 1; k < this.assetList2.length; k++) {
                        this.assetList.push(this.assetList2[k]);
                    }
                });
        }
    }

    ngOnDestroy(): void {
    }


    cancelModal() {
        ModalUtil.hideModal('AssetConsumingReferenceViewModal');
    }


    methodTow1(id) {
        this.j = -1;
        this.lastAssetThenClicked = '-1';
        this.assetList.find(e => e.id === id).openPlus = false;
        this.assetList5 = this.assetList.filter(e => e.isPartOfAsset !== id);
        this.assetList7 = this.assetList.filter(e => e.isPartOfAsset === id);
        this.assetList6 = this.assetList7;
        while (this.assetList6.length > 0) {
            this.assetList6 = [];
            for (const deleted of this.assetList7) {
                this.assetList6.concat(this.assetList5.filter(e => e.isPartOfAsset === deleted.id));
                this.assetList5 = this.assetList5.filter(e => e.isPartOfAsset !== deleted.id);
            }
            this.assetList7 = this.assetList6;
        }
        this.assetList = [];
        this.assetList = this.assetList5;
        // console.log('this.assetList5ooo', this.assetList5)
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
