import {Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {ToastService} from '../../services/toast.service';
import {Sport} from '../../models/sports.model';
import {SportsService} from '../../services/sports/sports.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {CoursesService} from '../../services/courses/courses.service';
import {Course} from '../../models/course.model';
import {DatePipe} from '@angular/common';
import {differenceInCalendarDays} from 'date-fns';

@Component({
  selector: 'my-races',
  standalone: true,
  providers: [ToastService],
  imports: [
    Button,
    Card,
    FormsModule,
    Select,
    DatePipe
  ],
  templateUrl: './my-races.component.html',
  styleUrl: './my-races.component.scss',
})
export class MyRacesComponent implements OnInit {

  toastService = inject(ToastService);
  sportsService = inject(SportsService);
  coursesService = inject(CoursesService);

  private destroyRef = inject(DestroyRef);

  _selectedSport = signal<Sport | undefined>(undefined);
  sports = signal<Sport[]>([]);

  courses = signal<Course[]>([]);

  constructor() {
  }


  ngOnInit(): void {
    this.getAllSports();
  }

  getAllSports() {
    this.sportsService.getAllSports().pipe(
      takeUntilDestroyed(this.destroyRef) // Auto-unsubscribe on destroy
    ).subscribe((sports: Sport[]) => {
      this.sports.set(sports);
    });
  }

  protected deleteRace() {
    this.toastService.showMessage('Courses supprimée');
  }

  protected onSportSelected($event: any) {
    this.coursesService.getCoursesBySportId($event?.value?.id).subscribe((courses: any[]) => {
      this.courses.set(courses);
    })
  }

  protected getRemaingDays(date: Date) {
    const now = new Date();
    return differenceInCalendarDays(date, now);
  }
}
