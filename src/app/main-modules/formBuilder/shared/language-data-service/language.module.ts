import {NgModule} from '@angular/core';
import {FindLanguageFromKeyPipe} from './find-language-from-key.pipe';
import {LanguageService} from './language.service';
import {CacheService} from '../cache-service/cache.service';

@NgModule({
  declarations: [
    FindLanguageFromKeyPipe
  ],
  imports: [
  ],
  providers: [
    LanguageService,
    CacheService
  ],
})
export class LanguageModule {
}
