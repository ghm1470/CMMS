import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularBootBaseModule} from './_base/angular-boot/angular-boot-base.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {PwaService} from './shared/service/pwa.service';
import {MatBottomSheetModule, MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule} from '@angular/material';
import {PromptComponent} from './prompt/prompt.component';
const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();
import {PushNotificationService} from 'ngx-push-notifications';
import {MatProgressBarModule} from "@angular/material/progress-bar";



@NgModule({
  declarations: [
    AppComponent,
    PromptComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularBootBaseModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerImmediately'
        }),
        MatBottomSheetModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
    ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true},
      PushNotificationService
  ],
  entryComponents: [
    PromptComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
