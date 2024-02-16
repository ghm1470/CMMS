

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {Organization} from '../../model/organization/organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'organization';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  getAllByParkId(pId: string) {
    const suffixPath = 'getAll';
    return this.getService({
      needToken: true,
      urlQueryObject: { parkId: pId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getOne(orgId: string) {
    const suffixPath = '';
    return this.getService({
      needToken: true,
      urlQueryObject: { id: orgId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  create(item: Organization) {
    const suffixPath = '';
    return this.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  update(item: Organization) {
    const suffixPath = '';
    return this.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  delete(orgId: string) {
    const suffixPath = '';
    return this.deleteService({
      needToken: true,
      urlQueryObject: {id: orgId},
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

}
