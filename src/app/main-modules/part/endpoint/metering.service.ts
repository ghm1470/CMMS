import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class MeteringService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'metering';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  create(item) {
    const suffixPath = 'save';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  delete(query: {meteringId: string}) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
    });
  }
  update(item) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),

    });
  }

  getPage(query: { paging: Paging, totalElements: any, term?: string }) {
    const suffixPath =
      'get-page';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAll() {
    const suffixPath = 'get-metering';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  getList(query: {term , limit }) {
    const suffixPath =
      'get-list';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getOne(query: {meteringId: string}) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  getOneReading(query: {meteringId: string}) {
    const suffixPath =
      'get-one-with-associated-user';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  getMeteringListOfUnitOfAsset(query: {assetId: string, unitId: string}) {
    const suffixPath = 'get-metering-list-of-unit-of-asset';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getMeteringListOfUnitOfAssetPagination(query: {paging: Paging, totalElements: any , assetId: string, unitId: string}) {
    const suffixPath = 'get-metering-list-of-unit-of-asset-with-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getMaxMetring(query:{assetId , unitOfMeasurementId}) {
    const suffixPath =
      'get-max-metering-of-asset';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


}
