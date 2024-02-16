import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';


export class RestServiceBaseService {
  public microserviceName: string;
  public prefixUrl: string;
  public http: HttpClient;
  // public accountService: AccountService;

  constructor() {
    this.microserviceName = '';
    this.prefixUrl = '';
  }


  post(body: any, postfixUrl: string): any {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.microserviceName + '/' + this.prefixUrl + '/' + postfixUrl
      , JSON.stringify(body), {headers: headers}).pipe(map(res => res));
  }


}
