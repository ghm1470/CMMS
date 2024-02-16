// I provide a proxy to the native in-memory object that operates on an in-memory
// cache and only reads from the in-memory as a fallback.
// --
// CAUTION: This services returns direct references to the cached data. This creates
// an inconsistent API in that it sometimes returns new values and sometimes returns
// shared values. This means that mutations to a returned value may or may not be
// observed in other parts of the code. It is advised that you DO NOT DIRECTLY MUTATE
// the values passed-to or returned-from this service.
import {KeyValueObservable} from './key-value-observable.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

/**
 * @author yaqub
 */
@Injectable({
  providedIn: 'root'
})
export class CacheInMemoryTimestampService {
  private cacheList: KeyValueObservable[] = [];

  constructor() {
  }

// remove just value of item
  public removeItemValue(key: string): void {
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {
        this.cacheList[i].source.next(null);
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

  // I return the in-memory item with the given key.
  public getItem(key: string): Observable<any> {
    for (const cache of this.cacheList) {
      if (cache.key === key) {
        return cache.source;
      }
    }

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
    let found = false;
    for (let i = 0; i < this.cacheList.length; i++) {
      if (this.cacheList[i].key === key) {
        this.cacheList[i].source.next(value);
        this.cacheList[i].timestamp = new Date().getTime();
        this.cacheList[i].hours = hours;
        found = true;
        break;
      }
    }
    if (!found) {
      const keyValue: KeyValueObservable = new KeyValueObservable();
      keyValue.key = key;
      keyValue.source.next(value);
      keyValue.timestamp = new Date().getTime();
      keyValue.hours = hours;
      this.cacheList.push(keyValue);
    }
  }

  // I store the item at the given key. infinite time
  public setItem(key: string, value: any): void {
    this.setItemTimed(key, value, 999999);
  }
}
