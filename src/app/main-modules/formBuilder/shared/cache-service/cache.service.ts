import {Injectable} from '@angular/core';
import {CacheType} from './cache-type.enum';
import {Observable} from 'rxjs';
import {CacheInMemoryTimestampService} from './cache-in-memory-timestamp.service';
import {CacheSessionStorageTimestampService} from './cache-session-storage-timestamp.service';
import {CacheLocalStorageTimestampService} from './cache-local-storage-timestamp.service';

/**
 * @author yaqub
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor(private  cacheInMemoryService: CacheInMemoryTimestampService,
              private  cacheSessionStorageService: CacheSessionStorageTimestampService,
              private  cacheLocalStorageService: CacheLocalStorageTimestampService) {
  }

  getItemNotExpired(key: string, type: CacheType): Observable<any> {
    if (type === CacheType.IN_MEMORY) {
      return this.cacheInMemoryService.getItemNotExpired(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      return this.cacheSessionStorageService.getItemNotExpired(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      return this.cacheLocalStorageService.getItemNotExpired(key);
    }
  }

  updateTimestamp(key: string, hours: number, type: CacheType): void {
    if (type === CacheType.IN_MEMORY) {
      this.cacheInMemoryService.updateTimestamp(key, hours);
    } else if (type === CacheType.SESSION_STORAGE) {
      this.cacheSessionStorageService.updateTimestamp(key, hours);
    } else if (type === CacheType.LOCAL_STORAGE) {
      this.cacheLocalStorageService.updateTimestamp(key, hours);
    }
  }

  isItemAndNotExpired(key: string, type: CacheType): boolean {
    if (type === CacheType.IN_MEMORY) {
      return this.cacheInMemoryService.isItemAndNotExpired(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      return this.cacheSessionStorageService.isItemAndNotExpired(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      return this.cacheLocalStorageService.isItemAndNotExpired(key);
    }
  }

  setItem(key: string, value: any, type: CacheType): void {
    if (type === CacheType.IN_MEMORY) {
      this.cacheInMemoryService.setItem(key, value);
    } else if (type === CacheType.SESSION_STORAGE) {
      this.cacheSessionStorageService.setItem(key, value);
    } else if (type === CacheType.LOCAL_STORAGE) {
      this.cacheLocalStorageService.setItem(key, value);
    }
  }

  setItemTimed(key: string, value: any, hours: number, type: CacheType): void {
    if (type === CacheType.IN_MEMORY) {
      this.cacheInMemoryService.setItemTimed(key, value, hours);
    } else if (type === CacheType.SESSION_STORAGE) {
      this.cacheSessionStorageService.setItemTimed(key, value, hours);
    } else if (type === CacheType.LOCAL_STORAGE) {
      this.cacheLocalStorageService.setItemTimed(key, value, hours);
    }
  }

  getItem(key: string, type: CacheType): Observable<any> {
    if (type === CacheType.IN_MEMORY) {
      return this.cacheInMemoryService.getItem(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      return this.cacheSessionStorageService.getItem(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      return this.cacheLocalStorageService.getItem(key);
    }
  }

  isItem(key: string, type: CacheType): boolean {
    if (type === CacheType.IN_MEMORY) {
      return this.cacheInMemoryService.isItem(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      return this.cacheSessionStorageService.isItem(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      return this.cacheLocalStorageService.isItem(key);
    }
  }

  removeItemValue(key: string, type: CacheType): void {
    if (type === CacheType.IN_MEMORY) {
      this.cacheInMemoryService.removeItemValue(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      this.cacheSessionStorageService.removeItemValue(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      this.cacheLocalStorageService.removeItemValue(key);
    }
  }

  removeCompletelyItem(key: string, type: CacheType): void {
    if (type === CacheType.IN_MEMORY) {
      this.cacheInMemoryService.removeCompletelyItem(key);
    } else if (type === CacheType.SESSION_STORAGE) {
      this.cacheSessionStorageService.removeCompletelyItem(key);
    } else if (type === CacheType.LOCAL_STORAGE) {
      this.cacheLocalStorageService.removeCompletelyItem(key);
    }
  }
}
