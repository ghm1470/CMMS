import {Injector} from '@angular/core';
import {BaseComponent} from '../../../shared/base-component/baseComponent';
import {AuthService} from '../endpoint/auth.service';

export abstract class AuthBaseComponent extends BaseComponent {
  authService: AuthService;


  constructor(injector: Injector) {
    super(injector);
    this.authService = injector.get(AuthService);
  }

}
