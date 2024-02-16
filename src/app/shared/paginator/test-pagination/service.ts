import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Model} from './model';

@Injectable()
export class Service extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient,
              public _ServiceConfig: ServiceConfig) {
    super();
    this._prefix = '';
    this._objectName = '';
    this.prefixMatches = this.getMatches(this._prefix);
  }


  create(item: Model.Create) {
    const suffixPath = 'create';
    return super.postService(item, {
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      responseContentType: ResponseContentType.Text,
    });
  }

  update(query: { id: string }, item: Model.Create) {
    const suffixPath = 'update';
    return super.putService(item, {
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query

    });
  }

  getPage(query: { page: number, size: number, term: string }) {
    const suffixPath =
      'get-page';
    return super.getService({
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getList(query: { term: string, limit: number }) {
    const suffixPath =
      'get-list';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }


  getOne(query: { id: string }) {
    const suffixPath =
      'get-one';
    return super.getService({
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getOneByAddress(query: { address: string }) {
    const suffixPath =
      'get-one/by-address';
    return super.getService({
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  delete(query: { id: string }) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,

    });
  }
}
