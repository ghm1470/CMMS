import {Injectable} from '@angular/core';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Platform} from '@angular/cdk/platform';
import {CacheService} from '../../main-modules/formBuilder/shared/cache-service/cache.service';
import {CacheType} from '../../main-modules/formBuilder/shared/cache-service/cache-type.enum';
import {PromptComponent} from '../../prompt/prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform,
    private cacheService: CacheService
  ) {
  }

  initPwaPrompt() {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.promptEvent = event;
        this.openPromptComponent('android');
      });
    }
    if (this.platform.IOS) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    }
  }

  openPromptComponent(mobileType: 'ios' | 'android') {
      this.cacheService.getItem('pwa', CacheType.LOCAL_STORAGE).subscribe(res => {
        if (!res) {
          timer(500)
            .pipe(take(1))
            .subscribe(() => {
              this.bottomSheet.open(PromptComponent, {data: {mobileType, promptEvent: this.promptEvent}});
            });
        }
      });
    // else if (mobileType === 'ios') {
    //   timer(500)
    //     .pipe(take(1))
    //     .subscribe(() => {
    //       const isSafari = Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0;
    //       if (isSafari) {
    //         this.bottomSheet.open(PromptComponent, {data: {mobileType, promptEvent: this.promptEvent}});
    //       }
    //     });
    //
    // }
  }
}
