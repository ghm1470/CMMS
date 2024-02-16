import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'messaging';
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


  update(item) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  getOne(query: { userId: string }) {
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
