import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.authService.isUserLoggedInAsObservable().pipe(
      tap(data => {
        if (!data) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}
