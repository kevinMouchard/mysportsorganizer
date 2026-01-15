import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of} from 'rxjs';
import {mapSport, Sport} from '../../models/sports.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SportsService {

  private dataUrl = `${environment.apiUrl}/sports`;
  private http = inject(HttpClient);

  getAllSports(): Observable<Sport[]> {
    return this.http.get<any[]>(this.dataUrl).pipe(
      catchError((error) => {
        console.error('Error fetching sports:', error);
        return of([]);
      }),
      map(response => response.map(sport => {
        return mapSport(sport);
      }))
    );
  }
}
