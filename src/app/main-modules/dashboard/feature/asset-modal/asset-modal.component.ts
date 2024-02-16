import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ModalSize} from '@angular-boot/util';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {Asset} from '../../../asset/feature/tree-list/tree-list.component';
import {takeUntilDestroyed} from '@angular-boot/core';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {AssetService} from '../../../asset/endpoint/asset.service';

@Component({
  selector: 'app-asset-modal',
  templateUrl: './asset-modal.component.html',
  styleUrls: ['./asset-modal.component.scss']
})
export class AssetModalComponent implements OnInit, OnChanges {
  MyModalSize = ModalSize;
  @Input() modalId;
  @Input() title;
  @Input() assetsList: Asset[] = [];

  assetList2: Asset[] = [];
  assetList11: Asset[] = [];
  assetList12: Asset[] = [];
  assetList13: Asset[] = [];
  asset = new Asset();
  categoryType = CategoryDto.CategoryType;
  j = -1;
  lastAssetThenClicked = '-1';


  constructor(
    private assetService: AssetService,
  ) {
  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getChildList(parent: Asset, i) {
    if (this.j !== i && this.lastAssetThenClicked !== parent.id) {
      this.j = i;
      this.lastAssetThenClicked = parent.id;
      this.assetService.getAllAssetByParentId({parentId: parent.id}).pipe(takeUntilDestroyed(this))
        .subscribe((res: AssetDto.CreateAsset[]) => {
          if (res && res.length) {
            this.assetList2 = this.assetsList;
            this.assetsList = [];
            for (let j = 0; j <= i; j++) {
              this.assetsList.push(this.assetList2[j]);
            }
            for (const item of res) {
              this.asset = new Asset();
              this.asset.categoryType = item.categoryType;
              this.asset.code = item.code;
              this.asset.isPartOfAsset = item.isPartOfAsset;
              this.asset.id = item.id;
              this.asset.name = item.name;
              // this.asset.status = item.status;
              this.asset.hasChild = item.hasChild;
              this.asset.marginRight = parent.marginRight + 30;
              this.assetsList.push(this.asset);
            }
            this.assetsList.find(e => e.id === parent.id).openPlus = true;
          }
          for (let k = i + 1; k < this.assetList2.length; k++) {
            this.assetsList.push(this.assetList2[k]);
          }
        });
    }
  }



  methodTow(id: string) {
    this.j = -1;
    this.lastAssetThenClicked = '-1';
    // =====================================================================
    this.assetsList.find(e => e.id === id).openPlus = false;
    this.assetList11 = this.assetsList.filter(e => e.isPartOfAsset === id);
    this.assetList12 = this.assetsList.filter(e => e.isPartOfAsset !== id);
    this.assetsList = this.assetList12;
    this.assetList13 = this.assetList11;
    while (this.assetList11.length > 0) {
      for (const item of this.assetList13) {
        this.assetList11 = [];
        this.assetList12 = [];
        this.assetList11 = this.assetsList.filter(e => e.isPartOfAsset === item.id);
        this.assetList12 = this.assetsList.filter(e => e.isPartOfAsset !== item.id);
        this.assetsList = this.assetList12;
        this.assetList13 = this.assetList11;
      }
    }
  }

}
