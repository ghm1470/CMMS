import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultNotify, ModalSize} from '@angular-boot/util';
import {AssetDto} from '../../model/dto/assetDto';
import {AssetService} from '../../endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnDestroy, OnChanges {
    @Input() sendTypeGetAll: string;
    @Input() mainAssetId: string;
    @Output() parentAsset = new EventEmitter<Asset>();
    MyModalSize = ModalSize;
    assetList: Asset[] = [];
    asset = new Asset();
    categoryType = CategoryDto.CategoryType;

    constructor(private assetService: AssetService) {
    }

    ngOnInit() {
    }

    ngOnChanges(): void {
        this.getAllAssetWithoutParentId();
        console.log('mainAssetId', this.mainAssetId)

    }

    getAllAssetWithoutParentId() {
        if (this.sendTypeGetAll === 'B') {
            this.assetService.getAllAssetWithoutParentIdForB({categoryType: 'BUILDING'}).pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetDto.CreateAsset[]) => {
                    if (res && res.length) {
                        this.assetList = [];
                        for (const item of res) {
                            const asset = new Asset();
                            // this.asset = new Asset();
                            // this.asset.categoryType = item.categoryType;
                            // this.asset.code = item.code;
                            // this.asset.isPartOfAsset = item.isPartOfAsset;
                            // this.asset.id = item.id;
                            // this.asset.name = item.name;
                            // this.asset.status = item.status;
                            // this.asset.hasChild = item.hasChild;
                            asset.categoryType = item.categoryType;
                            asset.code = item.code;
                            asset.isPartOfAsset = item.isPartOfAsset;
                            asset.id = item.id;
                            asset.name = item.name;
                            asset.status = item.status;
                            asset.hasChild = item.hasChild;
                            this.assetList.push(asset);
                            console.log('this.assetList', this.assetList)

                        }
                    }
                });
        }
        if (this.sendTypeGetAll === 'F' || this.sendTypeGetAll === 'T') {
            this.assetService.getAllAssetWithoutParentIdForTAndF().pipe(takeUntilDestroyed(this))
                .subscribe((res: AssetDto.CreateAsset[]) => {
                    if (res && res.length) {
                        this.assetList = [];
                        for (const item of res) {
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
                });
        }
    }


    selectedParentIdForGetChild: string;
    loadingForGetChild = false;

    getChildList(parent: Asset) {
        if (parent.id === this.mainAssetId) {
            DefaultNotify.notifyDanger('امکان انتخاب از دارایی های زیر مجموعه نیست.', '', NotiConfig.notifyConfig);
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
            });
    }

    methodTow(assetOfAssetList: Asset) {
        assetOfAssetList.childAssetList = [];
        assetOfAssetList.openPlus = false;

    }

    ngOnDestroy(): void {
    }


    cancelModal() {
        ModalUtil.hideModal('treeAsset');
    }


    treeMethod(item: Asset) {
        console.log('item treeMethod===>', item);
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
