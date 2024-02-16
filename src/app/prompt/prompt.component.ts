import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {CacheService} from '../main-modules/formBuilder/shared/cache-service/cache.service';
import {CacheType} from '../main-modules/formBuilder/shared/cache-service/cache-type.enum';


@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {
  pwa;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { mobileType: 'ios' | 'android', promptEvent?: any },
    private bottomSheetRef: MatBottomSheetRef<PromptComponent>,
    private cacheService: CacheService
  ) {
    this.cacheService.getItem('pwa', CacheType.LOCAL_STORAGE).subscribe(res => {
      if (res) {
        this.pwa = res;
      }
    });
  }

  public installPwa(): void {
    this.data.promptEvent.prompt();
    this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
    setTimeout(() => {
      this.cacheService.setItem('pwa', true, CacheType.LOCAL_STORAGE);
    }, 1000);
  }

}
