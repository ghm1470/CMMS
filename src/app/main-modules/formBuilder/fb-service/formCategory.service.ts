import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormCategoryService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'form';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  getOne(id) {
    const suffixPath = id;
    return super.getService( {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {})
    });
  }

  getAll() {
    return super.getService( {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {})
    });
  }

  update(item) {
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {})
    });
  }

  create(item) {
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {})
    });
  }

  delete(id) {
    const suffixPath = id;
    return super.deleteService( {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {})
    });
  }
}
