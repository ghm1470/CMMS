import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CacheService} from './cache.service';
import {CacheInMemoryTimestampService} from './cache-in-memory-timestamp.service';
import {CacheSessionStorageTimestampService} from './cache-session-storage-timestamp.service';
import {CacheLocalStorageTimestampService} from './cache-local-storage-timestamp.service';

/**
 * @author yaqub
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [CacheInMemoryTimestampService, CacheSessionStorageTimestampService, CacheLocalStorageTimestampService, CacheService]
})
export class CacheModule {
}
