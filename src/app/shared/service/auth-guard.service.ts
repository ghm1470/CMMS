import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem('token')) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
