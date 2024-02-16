import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {OrganizationDto} from '../model/organizationDto';
import {Paging} from '@angular-boot/util';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'organization';
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

  update(item, query: { organizationId: string}) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
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
  getAllOrganizationName() {
    const suffixPath = 'get-organization-name';
    return super.getService({
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  getOrganizationById(organizationId) {
    const suffixPath = organizationId;
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  deleteOrganization(organizationId) {
    const suffixPath = organizationId;
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllByFilterAndPagination(item: OrganizationDto.GetAllByFilter,
                              query: { paging: Paging, totalElements: any }) {
    const suffixPath =
      'get-all-by-filter-and-pagination';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllParentOrganization() {
    const suffixPath = 'get-all-parent-organizations';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {})
    });
  }

  delete(query: {id: string }) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
    });
  }

  getOne(query: {orgId: string}) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }



  checkOrganizationCode(query: {organCode: string}) {
    const suffixPath =
      'check-organization-is-unique';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

}
