import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class InboxService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'Inbox';
    this.prefixMatches = this.getMatches(this._prefix);
  }


  create(item) {
    const suffixPath = 'save';
    return super.postService(item, {
      needToken: true,
      // responseContentType: ResponseContentType.Json,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),

    });
  }
  getAllByPagination(query: {paging: Paging, totalElements: any, term: string, partId: string}) {
    const suffixPath = 'get-all-by-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }



  delete(query: { ACRId: string}) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }



  update(item, query: {inboxId: string}) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
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

  getAll(item: any) {
    console.log(item);
    const suffixPath = 'get-all-dto';
    return super.postService(item, {
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



  getOne(query: {ACRId: string}) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getOnePrivate(query: {partId: string}) {
    const suffixPath =
      'get-one-private';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }



}

