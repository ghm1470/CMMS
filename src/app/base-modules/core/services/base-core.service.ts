import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseCoreService {

  constructor() {
  }

  isDocRtl() {
    if (document.querySelector('html').getAttribute('dir') === 'rtl') {
      return true;
    }
  }
}
