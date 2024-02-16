import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirstRegisterComponent} from './first-register/first-register.component';
import {MainStepsComponent} from './main-steps/main-steps.component';
import {LanguageService} from '../../shared/language-data-service/language.service';
import {FindLanguageFromKeyPipe} from '../../shared/language-data-service/find-language-from-key.pipe';
import {CacheService} from '../../shared/cache-service/cache.service';
import {UploadService} from '../../shared/services/upload-service/upload.service';
import {FinalRegisterComponent} from './final-register/final-register.component';
import {QuestionRelationComponent} from './question-relation/question-relation.component';
import {QuestionCreateComponent} from './question-design/question-create/question-create.component';
import {CheckBoxComponent} from './question-design/question-create/checkBox/checkBox.component';
import {ComboBoxComponent} from './question-design/question-create/comboBox/comboBox.component';
import {DateComponent} from './question-design/question-create/date/date.component';
import {MatrixComponent} from './question-design/question-create/matrix/matrix.component';
import {NumericalComponent} from './question-design/question-create/numerical/numerical.component';
import {RadioButtonComponent} from './question-design/question-create/radioButton/radioButton.component';
// import {StarRatingComponent} from './question-design/question-create/starRating/starRating.component';
import {TextAreaComponent} from './question-design/question-create/textArea/textArea.component';
import {TextFieldComponent} from './question-design/question-create/textField/textField.component';
import {TimeComponent} from './question-design/question-create/time/time.component';
import {QuestionDesignComponent} from './question-design/question-design/question-design.component';
import {CheckBoxEditComponent} from './question-design/question-edit/checkBox/checkBoxEdit.component';
import {QuestionEditComponent} from './question-design/question-edit/question-edit.component';
import {ComboBoxEditComponent} from './question-design/question-edit/comboBox/comboBoxEdit.component';
import {DateEditComponent} from './question-design/question-edit/date/dateEdit.component';
import {MatrixEditComponent} from './question-design/question-edit/matrix/matrixEdit.component';
import {NumericalEditComponent} from './question-design/question-edit/numerical/numericalEdit.component';
import {RadioButtonEditComponent} from './question-design/question-edit/radioButton/radioButtonEdit.component';
// import {StarRatingEditComponent} from './question-design/question-edit/starRating/starRatingEdit.component';
import {TextAreaEditComponent} from './question-design/question-edit/textArea/textAreaEdit.component';
import {TextFieldEditComponent} from './question-design/question-edit/textField/textFieldEdit.component';
import {TimeEditComponent} from './question-design/question-edit/time/timeEdit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LanguageModule} from '../../shared/language-data-service/language.module';
import {TooltipModule} from 'ngx-tooltip';
import {SliderModule} from 'primeng/components/slider/slider';
// import {StarRatingModule} from 'angular-star-rating/index';
import {MaterialModule} from '../../shared/material/material.module';
import {CacheModule} from '../../shared/cache-service/cache.module';
import {HttpClientModule} from '@angular/common/http';
import {FormPreviewComponent} from './preview/form-preview/form-preview.component';
import {SubQuestionPreviewComponent} from './preview/sub-question/sub-question-preview.component';
import {TextMaskModule} from 'angular2-text-mask';
import {FormService} from '../../fb-service/form.service';
import {FormCategoryService} from '../../fb-service/formCategory.service';
import {FormDataService} from '../../fb-service/form-data.service';
import { FileAttachComponent } from './question-design/question-create/file-attach/file-attach.component';
import { FileAttachEditComponent } from './question-design/question-edit/file-attach-edit/file-attach-edit.component';
import {ImageUploadModule} from '../../../../shared/util-module/image-upload/image-upload.module';
import {AttachmentModule} from '../../../../shared/util-module/attachment/attachment.module';
import {SurveyDataService} from './surveyData.service';
import {RouterModule} from "@angular/router";
import { FormForViewComponent } from './form-for-view/form-for-view.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbWidgetsModule} from '@angular-boot/widgets';

@NgModule({
  imports: [
    CommonModule,
    CacheModule,
    NbWidgetsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    LanguageModule,
    TooltipModule,
    SliderModule,
    MaterialModule,
    // StarRatingModule,
    TextMaskModule,
    ImageUploadModule,
    AttachmentModule,
    RouterModule,
    NgSelectModule
  ],
  declarations: [
    MainStepsComponent,
    FirstRegisterComponent,
    QuestionRelationComponent,
    FinalRegisterComponent,
    FormPreviewComponent,
    SubQuestionPreviewComponent,
    QuestionCreateComponent,
    CheckBoxComponent,
    ComboBoxComponent,
    DateComponent,
    MatrixComponent,
    NumericalComponent,
    RadioButtonComponent,
    // StarRatingComponent,
    TextAreaComponent,
    TextFieldComponent,
    TimeComponent,
    QuestionEditComponent,
    CheckBoxEditComponent,
    ComboBoxEditComponent,
    DateEditComponent,
    MatrixEditComponent,
    NumericalEditComponent,
    RadioButtonEditComponent,
    // StarRatingEditComponent,
    TextAreaEditComponent,
    TextFieldEditComponent,
    TimeEditComponent,
    QuestionDesignComponent,
    FileAttachComponent,
    FileAttachEditComponent,
    FormForViewComponent
  ],
  providers: [
    LanguageService,
    FindLanguageFromKeyPipe,
    FormService,
    FormCategoryService,
    CacheService,
    UploadService,
    FormDataService,
    SurveyDataService
  ],
  exports: [
    MainStepsComponent,
    QuestionDesignComponent,
    FirstRegisterComponent,
    FormPreviewComponent,
    QuestionRelationComponent,
    FinalRegisterComponent,
  ]
})
export class FormViewModule {
}
