import {Injector} from '@angular/core';
import {BaseComponent} from '../../../../shared/base-component/baseComponent';

export abstract class ActivityBaseComponent extends BaseComponent {
  constructor(injector: Injector) {
    super(injector);
  }
}
