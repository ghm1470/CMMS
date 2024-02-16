import {Injectable, Renderer2} from '@angular/core';
import {CacheService} from '../cache-service/cache.service';
import {CacheType} from '../cache-service/cache-type.enum';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

/**
 * @author zahra + yaqub
 */

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public renderer: Renderer2;

  constructor(private cacheService: CacheService,
              private http: HttpClient) {
  }

  getSelectedLanguage(): Observable<any> {
    return this.cacheService.getItem('selectedLanguage', CacheType.LOCAL_STORAGE);
  }

  getLanguageData(): Observable<any> {
    const source = new BehaviorSubject<any>(null);
    // this.cacheService.getItem('selectedLanguage', CacheType.LOCAL_STORAGE).subscribe(selectedLanguage => {
      if (this.cacheService.isItem('FA', CacheType.LOCAL_STORAGE)) {
        this.cacheService.getItem('FA', CacheType.LOCAL_STORAGE).subscribe(res => {
            source.next(res);
          }
        );
      } else {
        this.http.get('~/../assets/i18n/FA' + '/global.json').subscribe(languageData => {
          this.cacheService.setItem('FA', languageData, CacheType.LOCAL_STORAGE);
          source.next(languageData);
        });
      }
    // });
    return source.asObservable();
  }
}
