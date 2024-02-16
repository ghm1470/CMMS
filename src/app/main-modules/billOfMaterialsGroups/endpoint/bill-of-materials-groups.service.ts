import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class BillOfMaterialsGroupsService  extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'bill-of-materials-group';
    this.prefixMatches = this.getMatches(this._prefix);
  }


  createBOM(item) {
    const suffixPath = 'save';
    return super.postService(item, {
      needToken: true,
      // responseContentType: ResponseContentType.Json,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      responseContentType: ResponseContentType.Text

    });
  }
  updateBOM(item) {
    const suffixPath = 'update-first-page';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getOneBOM(query: {BOMId: string}) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllByPaginationBOM(query: {paging: Paging, totalElements: any, name: string , code: string}) {
    const suffixPath = 'get-all-by-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  deleteBOM(query: { BOMId: string}) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  checkBOMCode(query: { BOMCode: string }) {
    const suffixPath =
      'check-bom-code';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  // ================================================PartList========================================
  updatePartBOM(item, query: {id: string}) {
    const suffixPath = 'update-part-bom';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  getAllByPaginationPartBOM(query: {paging: Paging, totalElements: any,  BOMId: string}) {
    const suffixPath = 'get-all-part-by-bomId-with-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  deletePartBOM(query: { BOMPartId: string, BOMId?: string}) {
    const suffixPath = 'delete-part-list';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  // ================================================AssetList========================================
  getAllByPaginationAssetBOM(query: {paging: Paging, totalElements: any, BOMId: string}) {
    const suffixPath = 'get-all-asset-by-bomId-with-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  deleteAssetBOM(query: { assetId: string, BOMId?: string}) {
    const suffixPath = 'delete-asset-list';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  updateAssetBOM(item, query: {id: string}) {
    const suffixPath = 'update-asset-bom';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

}

