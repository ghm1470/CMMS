import { Injectable } from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'captcha';
    this.prefixMatches = this.getMatches(this._prefix);
  }
  createCaptcha() {
    const suffixPath = 'create';
    return super.getService( {
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

}
