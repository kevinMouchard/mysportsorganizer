import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {Course, courseToDto, mapCourse} from '../../models/course.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private dataUrl = `${environment.apiUrl}/courses`;

  private http = inject(HttpClient);

  getAllCourses(): Observable<Course[]> {
    return this.http.get<any[]>(this.dataUrl, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error fetching courses:', error);
        return of([]);
      }),
      map(response => response.map(course => {
        return mapCourse(course)
      }))
    );
  }


  getCoursesBySportId(sportId: number): Observable<Course[]> {
    return this.http.get<any[]>(this.dataUrl + '/' + sportId, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error fetching courses:', error);
        return of([]);
      }),
      map(response => response.map(course => {
        return mapCourse(course)
      }))
    );
  }

  addCourse(course: Course) {
     return this.http.post(this.dataUrl, courseToDto(course), { withCredentials: true }).pipe(
       catchError((error) => {
         console.error('Error adding course:', error);
         return of([]);
       })
     );
   }

  deleteCourse(courseId: number) {
     return this.http.delete(this.dataUrl + '/' + courseId, { withCredentials: true }).pipe(
       catchError((error) => {
         console.error('Error deleting course:', error);
         return of([]);
       })
     );
   }

}
