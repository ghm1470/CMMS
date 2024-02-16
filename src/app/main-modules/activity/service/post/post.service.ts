

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {Post} from '../../model/post/post';

@Injectable({
  providedIn: 'root'
})
export class PostService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'post';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  getAllByOrganization(orgId) {
    const suffixPath = 'getAll';
    return this.getService({
      needToken: true,
      urlQueryObject: {organizationId: orgId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllByParkId(pId) {
    const suffixPath = 'getAll';
    return this.getService({
      needToken: true,
      urlQueryObject: {organizationId: pId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getOne(pId: string) {
    const suffixPath = '';
    return this.getService({
      needToken: true,
      urlQueryObject: { id: pId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  create(item: Post) {
    const suffixPath = '';
    return this.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  update(item: Post) {
    const suffixPath = '';
    return this.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  delete(pId: string) {
    const suffixPath = '';
    return this.deleteService({
      needToken: true,
      urlQueryObject: {id: pId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }


}
