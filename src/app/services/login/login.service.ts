import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {mapUser, User, UserDto} from '../../models/user.model';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private dataUrl = `${environment.apiUrl}/auth`;

  private http = inject(HttpClient);

  userConnected = signal<User | undefined>(undefined);

  login(email: string, password: string) {
    return this.http.post(
      this.dataUrl + '/login',
      { email, password },
      { withCredentials: true } // 🔑 important
    ).pipe(
      tap((userConnected) => {
      this.userConnected.set(mapUser(userConnected as UserDto));
    }))
  }

  logout() {
    return this.http.post(this.dataUrl + '/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.userConnected.set(undefined))
    );
  }

  me() {
    return this.http.get('/profile', { withCredentials: true });
  }


}
