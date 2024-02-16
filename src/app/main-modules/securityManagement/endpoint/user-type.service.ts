import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'userType';
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

  search(query: { name: string, role: string }) {
    const suffixPath = 'all/filter';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  editRole(item) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllRole() {
    const suffixPath = 'get-all-type';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  getUserTypeListByOrganizationId(query: {orgId: string}) {
    const suffixPath = 'get-user-type-list-by-organization-id';
    return super.getService({
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
    });

}

  getRoleById(roleId) {
    const suffixPath = roleId;
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllUserTypesOfThOrganization(query: { organizationId: string }) {
    const suffixPath = 'get-all-userTypes-of-the-organization';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllUserTypesOfThOrganizationByFilter(query: { organizationId: string, term?: string }) {
    const suffixPath = 'get-all-userTypes-by-term';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  // deleteRole(roleId) {
  //   const suffixPath = roleId;
  //   return super.deleteService({
  //     needToken: true,
  //     objectPrefix: this.getPrefix({}),
  //     objectSuffix: this.replaceParams(suffixPath, {}),
  //   });
  // }

  deleteRole(query: { userTypeId: string }) {
    const suffixPath = 'delete';
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query,
      responseContentType: ResponseContentType.Text
    });
  }
}
