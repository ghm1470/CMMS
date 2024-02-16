import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'user';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  signin(item) {
    const suffixPath = 'signin';
    return super.postService(item, {
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  firstSignIn(item) {
    const suffixPath = 'first-sign-in';
    return super.postService(item, {
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }
  secondLogin(item) {
    const suffixPath = 'second-login';
    return super.postService(item, {
      needToken: false,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }


}


