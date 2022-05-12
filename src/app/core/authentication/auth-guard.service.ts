import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isSignedIn().pipe(
      map(isSignIn => {
        if (isSignIn) return true;
        else {
          this.authService.redirectUrl = state.url;
          // Navigate to the login page with extras
          this.router.navigate(['/login']);

          return false;
        }
      })
    )

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isSignedIn().pipe(
      concatMap(isSignIn => {
        return this.authService.userChanged().pipe(
          map((user) => {
            if (isSignIn && user.profiles.includes(route.data.code)) {
               return true;
            }
            this.router.navigate(['/demo']);
            return false;
          })
        )
      }),
    );
  }



}