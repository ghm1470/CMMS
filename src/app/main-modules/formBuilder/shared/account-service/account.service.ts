import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {CacheService} from '../cache-service/cache.service';
import {CacheType} from '../cache-service/cache-type.enum';
import {map} from 'rxjs/operators';
import {UserDto} from '../../../user/model/dto/user-dto';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url = '/account';

  constructor(private http: HttpClient,
              private cacheService: CacheService) {

  }

  login() {
    this.http.get(this.url + '/get').subscribe((res: UserDto.Create) => {
      this.cacheService.setItem('account', res, CacheType.LOCAL_STORAGE);
    }, error => {
      location.href = '//' + location.hostname + ':' + location.port + this.url + '/login';
    });
  }


  resetLogin() {
    if (this.cacheService.isItem('account', CacheType.LOCAL_STORAGE)) {
      location.href = '//' + location.hostname + ':' + location.port + this.url + '/login';
    }
  }

  logout() {
    this.http.get(this.url + '/logout').subscribe(res => {
      this.cacheService.removeCompletelyItem('account', CacheType.LOCAL_STORAGE);
      this.login();
    });
  }

  get(): Observable<UserDto.Create> {
    const source = new BehaviorSubject<UserDto.Create>(null);
    if (this.cacheService.isItem('account', CacheType.LOCAL_STORAGE)) {
      this.cacheService.getItem('account', CacheType.LOCAL_STORAGE).subscribe((res: UserDto.Create) => {
        source.next(res);
      });
    } else {
      this.http.get(this.url + '/get').subscribe((res: UserDto.Create) => {
        this.cacheService.setItem('account', res, CacheType.LOCAL_STORAGE);
        source.next(res);
      });
    }
    return source.asObservable();
  }

  getUsersInfo(idList) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/get-user-list-by-id-list', idList, {headers: headers}).pipe(map(res => res));
  }


}
