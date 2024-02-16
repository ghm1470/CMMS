import {KeyValueObservable} from './key-value-observable.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Data} from './data';

/**
 * @author yaqub
 */
@Injectable({
  providedIn: 'root'
})
export class CacheLocalStorageTimestampService {
  private cacheList: KeyValueObservable[] = [];

  // I initialize the localStorage service.
  constructor() {
    // load all local storage and set into cache array
    for (let i = 0; i < sessionStorage.length; i++) {

        try {
          const keyValue: KeyValueObservable = new KeyValueObservable();
          let data: Data = new Data();
          data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
          keyValue.key = sessionStorage.key(i);
          keyValue.source.next(data.value);
          keyValue.timestamp = data.timestamp;
          keyValue.hours = data.hours;
          this.cacheList.push(keyValue);
        }
        catch(e) {
        }


    }
  }

  // remove just value of item
  public removeItemValue(key: string): void {
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {

        this.cacheList[i].source.next(null);

        // localStorage data change
        const data: Data = new Data();
        data.value = null;
        data.timestamp = this.cacheList[i].timestamp;
        data.hours = this.cacheList[i].hours;
        sessionStorage.setItem(key, JSON.stringify(data));

        break;
      }
    }
  }

  // update expire time of data
  public updateTimestamp(key: string, hours: number): void {
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {
        this.cacheList[i].timestamp = new Date().getTime();
        this.cacheList[i].hours = hours;

        // localStorage data change
        let data: Data = new Data();
        data = JSON.parse(sessionStorage.getItem(key));
        data.timestamp = this.cacheList[i].timestamp;
        data.hours = this.cacheList[i].hours;
        sessionStorage.setItem(key, JSON.stringify(data));

        break;
      }
    }
  }


  // remove item and that  Observable source
  public removeCompletelyItem(key: string): void {
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {
        this.cacheList.splice(i, 1);
        break;
      }
    }
    sessionStorage.removeItem(key);
  }

  public isItem(key: string): boolean {
    for (const cache of this.cacheList) {
      if (cache.key === key) {
        return true;
      }
    }
    return false;
  }

  public isItemAndNotExpired(key: string): boolean {
    for (const cache of this.cacheList) {
      if (cache.key === key) {
        if (cache.getHours() > new Date().getTime()) {
          return true;
        }
      }
    }
    return false;
  }

  // I return the localStorage item with the given key.
  public getItem(key: string): Observable<any> {
    for (const cache of this.cacheList) {
      if (cache.key === key) {
        return cache.source;
      }
    }

    // if item not found create new item and return that
    this.setItem(key, null);
    return this.getItem(key);
  }

  // I return the in-memory item with the given key.
  public getItemNotExpired(key: string): Observable<any> {
    for (const cache of this.cacheList) {
      if (cache.key === key) {
        if (cache.getHours() > new Date().getTime()) {
          return cache.source;
        }
      }
    }

    this.setItem(key, null);
    return this.getItemNotExpired(key);
  }

  // I store the item at the given key. with hours
  public setItemTimed(key: string, value: any, hours: number): void {
    const data: Data = new Data();
    data.value = value;
    data.hours = hours;
    data.timestamp = new Date().getTime();

    let found = false;
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {
        this.cacheList[i].source.next(data.value);
        this.cacheList[i].timestamp = data.timestamp;
        this.cacheList[i].hours = data.hours;
        found = true;
        break;
      }
    }
    if (!found) {
      const keyValue: KeyValueObservable = new KeyValueObservable();
      keyValue.key = key;
      keyValue.source.next(data.value);
      keyValue.timestamp = data.timestamp;
      keyValue.hours = data.hours;
      this.cacheList.push(keyValue);
    }

    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // I store the item at the given key. infinite time
  public setItem(key: string, value: any): void {
    this.setItemTimed(key, value, 999999);
  }
}
