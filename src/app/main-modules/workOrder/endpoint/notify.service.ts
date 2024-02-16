import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class NotifyService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'notify';
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

  createScheduleMaintenance(item) {
    const suffixPath = 'save-schedule-maintenance-notify';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  update(item, query: { notifyId: string }) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }
  updateScheduleMaintenance(item, query: { notifyId: string }) {
    const suffixPath = 'update-notify-of-schedule-maintenance';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getNotifyListByReferenceId(query: { referenceId: string }) {
    const suffixPath = 'get-notify-list-by-reference-id';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getAllByPagination(query: { paging: Paging, totalElements: any, term: string }) {
    const suffixPath = 'get-all-by-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  delete(query: { notifyId: string }) {
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {}),
      urlQueryObject: query,
    });
  }

  getOne(query: { notifyId: string }) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

}
