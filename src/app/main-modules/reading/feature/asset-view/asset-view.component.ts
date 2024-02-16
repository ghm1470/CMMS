import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultNotify, ModalSize} from '@angular-boot/util';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {ModalUtil} from '@angular-boot/widgets';
import CategoryType = CategoryDto.CategoryType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-asset-view',
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.scss']
})
export class AssetViewComponent implements OnInit, OnDestroy, OnChanges {
@Input() show: boolean;
@Output() parentAsset = new EventEmitter<Asset>();
  sendTypeGetAll = 'F';
  MyModalSize = ModalSize;
  assetList: Asset[] = [];
  asset = new Asset();
  loading = true;
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
  }

  ngOnChanges(): void {
    this.assetList2 = [];
    this.assetList = [];
    this.getAllAssetWithoutParentId();
}

  getAllAssetWithoutParentId() {
    this.loading = true;
    if (this.sendTypeGetAll === 'B') {
      this.assetService.getAllAssetWithoutParentIdForB({categoryType: 'BUILDING'}).pipe(takeUntilDestroyed(this))
        .subscribe((res: AssetDto.CreateAsset[]) => {
          this.loading = false;
          if (res && res.length) {
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
    if (this.sendTypeGetAll === 'F' || this.sendTypeGetAll === 'T') {
      this.assetService.getAllAssetWithoutParentIdForTAndF().pipe(takeUntilDestroyed(this))
        .subscribe((res: AssetDto.CreateAsset[]) => {
          if (res && res.length) {
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
              console.log('ddd', this.assetList);
            }
          }
        });
    }
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
            console.log('=/=/=/==========>', this.asset.marginRight);
          }
          for (let k = i + 1; k < this.assetList2.length; k++) {
            this.assetList.push(this.assetList2[k]);
          }
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
  ngOnDestroy(): void {
  }


  cancelModal() {
    ModalUtil.hideModal('ViewAsset');
  }



  methodTow(assetOfAssetList: Asset) {
    assetOfAssetList.childAssetList = [];
    assetOfAssetList.openPlus = false;

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
