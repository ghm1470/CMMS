import {RestServiceBaseService} from './rest-service-base.service';
import {Subject} from 'rxjs';
import {ResourceResponse} from '../model/rest/responce/resource-responce.model';
import {Observable} from 'rxjs';

export class ErrorHandlerServiceBaseService extends RestServiceBaseService {

  constructor() {
    super();
  }

  postService(body: any, postfixUrl: string): Observable<any> {
    const ret = new Subject();
    super.post(body, postfixUrl).subscribe(
      (res: ResourceResponse) => {
        const resourceResponse: ResourceResponse = res;
        if (this.logicErrorHandler(resourceResponse)) {
          ret.next(resourceResponse.data);
          // ret.next(resourceResponse.page);
        } else {
          return null;
        }
      },
      error => {
        this.onError(error);
      });
    return ret.asObservable();
  }

  postServiceList(body: any, postfixUrl: string): Observable<any> {
    const ret = new Subject();
    super.post(body, postfixUrl).subscribe(
      (res) => {
        const resourceResponse: ResourceResponse = res;
        if (this.logicErrorHandler(resourceResponse)) {
          ret.next(resourceResponse);
          // ret.next(resourceResponse.page);
        } else {
          return null;
        }
      },
      error => {
        this.onError(error);
      });
    return ret.asObservable();
  }

  logicErrorHandler(resourceResponse: ResourceResponse): boolean {
    return true;
  }

  onError(error) {
    if (error.status === 0) {
      // this.accountService.resetLogin();
      // if (this.cacheService.isItem('account', CacheType.LOCAL_STORAGE)) {
        location.href = '//' + location.hostname + ':' + location.port +  '/account/login';
      // }
    }
  }
}
