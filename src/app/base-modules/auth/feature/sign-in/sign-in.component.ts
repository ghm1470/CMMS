import {Component, Injector, OnInit} from '@angular/core';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {DefaultNotify} from '@angular-boot/util';
import {SignIn} from '../../model/dto/sign-in';
import {AuthBaseComponent} from '../authBaseComponent';
import {isNullOrUndefined} from 'util';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../auth/auth.component.scss']
})
export class SignInComponent extends AuthBaseComponent implements OnInit {
  signIn = new SignIn();
  action = true;
  loader = false;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  signInFunction(form) {
    if (form.valid) {
      if (this.action) {
        this.action = false;
        this.authService.signin(this.signIn)
          .pipe(untilDestroyed(this))
          .subscribe((res) => {
            this.action = true;
            this.loader = true;
            if (!isNullOrUndefined(res) && !isNullOrUndefined(res.token)) {
              setTimeout(() => {
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('user', res.user);
                this.router.navigateByUrl('/panel');
              }, 2000);
            } else {
              DefaultNotify.notifyDanger('ورود انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
          });
      }
    } else {
      DefaultNotify.notifyDanger('اطلاعات فرم کامل نیست.', '', NotiConfig.notifyConfig);
    }
  }

}
