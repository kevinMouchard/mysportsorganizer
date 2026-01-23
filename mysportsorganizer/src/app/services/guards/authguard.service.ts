import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {LoginService} from '../login/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private authService = inject(LoginService);
  private router = inject(Router);

  canActivate(): boolean {
    const user = this.authService.userConnected; // synchronous check
    if (user()) return true;

    // Not logged in → redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
