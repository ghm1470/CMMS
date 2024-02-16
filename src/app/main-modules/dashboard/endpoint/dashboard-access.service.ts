import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from "@angular-boot/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
  export class DashboardAccessService extends ServiceBase2 {
  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'dashboard-access';
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


  updateUserDashboardAccess(item) {
    const suffixPath = 'update-user-dashboard-access';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      // urlQueryObject: query
    });
  }

  getAll() {
    const suffixPath = 'get-all';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  delete(query: { workOrderId: string }) {
    const suffixPath =
      'delete-create-work-order';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
    });
  }

  getOne(query: { userId: string }) {
    const suffixPath = 'get-dashboard-by-user-id';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


}
