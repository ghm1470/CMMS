import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormCompleteComponent} from './form-complete/form-complete.component';
import {SubQuestionDisplayComponent} from './sub-question-display/sub-question-display.component';
import {FormService} from '../../fb-service/form.service';
import {FormDataService} from '../../fb-service/form-data.service';
import {LanguageService} from '../../shared/language-data-service/language.service';
import {CacheService} from '../../shared/cache-service/cache.service';
import {FindLanguageFromKeyPipe} from '../../shared/language-data-service/find-language-from-key.pipe';
import {UploadService} from '../../shared/services/upload-service/upload.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CacheModule} from '../../shared/cache-service/cache.module';
import {HttpClientModule} from '@angular/common/http';
import {LanguageModule} from '../../shared/language-data-service/language.module';
import {TooltipModule} from 'ngx-tooltip';
import {SliderModule} from 'primeng/components/slider/slider';
import {MaterialModule} from '../../shared/material/material.module';
// import {StarRatingModule} from 'angular-star-rating/index';
import {TextMaskModule} from 'angular2-text-mask';
import {AttachmentModule} from '../../../../shared/util-module/attachment/attachment.module';
import {ImageUploadModule} from '../../../../shared/util-module/image-upload/image-upload.module';
import {DataService} from '../../../../shared/service/data.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoadingSpinnerModule} from '../../../../shared/shared/loading-spinner/loading-spinner.module';
import {FormCompletForHistoryComponent} from './form-complet-for-history/form-complet-for-history.component';
import { FormCompleteWorkTableComponent } from './form-complete-work-table/form-complete-work-table.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {NbValidationModule} from "@angular-boot/validation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        CacheModule,
        HttpClientModule,
        LanguageModule,
        TooltipModule,
        SliderModule,
        MaterialModule,
        // StarRatingModule,
        TextMaskModule,
        AttachmentModule,
        ImageUploadModule,
        LoadingSpinnerModule,
        NgSelectModule,
        NbValidationModule
    ],
  declarations: [
    FormCompletForHistoryComponent,
    FormCompleteComponent,
    SubQuestionDisplayComponent,
    FormCompleteWorkTableComponent
  ],
  providers: [
    FormService,
    FormDataService,
    LanguageService,
    CacheService,
    FindLanguageFromKeyPipe,
    UploadService,
    DataService
  ],
  exports: [
    FormCompleteComponent,
    FormCompleteWorkTableComponent,
    SubQuestionDisplayComponent
  ]
})
export class FormCompleteModule {
}
