import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User, userToDto} from '../../models/user.model';
import {catchError, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private dataUrl = `${environment.apiUrl}/users`;

  private http = inject(HttpClient);

  // userConnected = signal<User | undefined>(undefined);

  addUser(user: User) {
    return this.http.post(this.dataUrl, userToDto(user)).pipe(
      catchError((error) => {
        console.error('Error adding course:', error);
        return of([]);
      })
    );
  }



}
