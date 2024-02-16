import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
// import {LanguageService} from '../../feature/formBuilder/shared/language-data-service/language.service';
// import {CacheModule} from '../../feature/formBuilder/shared/cache-service/cache.module';

@NgModule({
  imports: [
    CommonModule,
    // CacheModule
  ],
  declarations: [ImageUploadComponent],
  providers: [
    // LanguageService,
  ],
  exports: [ImageUploadComponent]
})
export class ImageUploadModule { }
