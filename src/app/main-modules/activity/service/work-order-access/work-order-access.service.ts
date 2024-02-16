import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../../model/post/post';
import {WorkOrderAccess} from '../../model/work-order-access';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderAccessService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'work-order-access';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  getOne(query: { workOrderAccessId: string }) {
    const suffixPath = 'get-one';
    return this.getService({
      needToken: true,
      urlQueryObject: query,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  create(item: WorkOrderAccess) {
    const suffixPath = 'save';
    return this.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  update(item: WorkOrderAccess, query: { workOrderAccessId: string }) {
    const suffixPath = 'update';
    return this.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
    });
  }


}
