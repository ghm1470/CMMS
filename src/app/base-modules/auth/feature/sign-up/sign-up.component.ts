import {Component, Injector, OnInit} from '@angular/core';
import {SignUp} from '../../model/dto/sign-up';
import {AuthBaseComponent} from '../authBaseComponent';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth/auth.component.scss']
})
export class SignUpComponent extends AuthBaseComponent implements OnInit {

  signUp: SignUp;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

}
