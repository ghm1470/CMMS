import {Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { isNullOrUndefined } from 'util';
import {FormBuilder} from '@angular/forms';

declare var $: any;

export abstract class BaseComponent {
  router: Router;
  route: ActivatedRoute;
  location: Location;
  formBuilder: FormBuilder;
  isSubmited = false;
  submittedError = false;

  constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.location = injector.get(Location);
    this.formBuilder = injector.get(FormBuilder);
  }

  isNullOrUndefined(val) {
    return isNullOrUndefined(val);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
  }


}
