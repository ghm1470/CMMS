import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
    super();
    this._objectName = 'download';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  downloadFile(query: { documentId: string }) {
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {}),
      urlQueryObject: query,
      responseContentType: ResponseContentType.Blob
    });
  }

}
