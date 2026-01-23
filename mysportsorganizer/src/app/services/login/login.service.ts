import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/user.model';

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
    );
  }

  logout() {
    return this.http.post('/logout', {}, { withCredentials: true });
  }

  me() {
    return this.http.get('/profile', { withCredentials: true });
  }


}
