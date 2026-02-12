import {Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {ToastService} from '../../services/toast.service';
import {Sport} from '../../models/sports.model';
import {SportsService} from '../../services/sports/sports.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {CoursesService} from '../../services/courses/courses.service';
import {Course, CourseDto, mapCourse} from '../../models/course.model';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DatePickerModule} from 'primeng/datepicker';
import {ConfirmationService, MessageService} from 'primeng/api';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {differenceInCalendarDays} from 'date-fns';
import {DatePipe, NgStyle} from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import {forkJoin} from 'rxjs';
import {LoginService} from '../../services/login/login.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {GpxTrackComponent} from '../gpx-track/gpx-track.component';

@Component({
  selector: 'my-races',
  standalone: true,
  providers: [MessageService],
  imports: [
    FormsModule,
    Select,
    Button,
    DialogModule, InputTextModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectButtonModule,
    TableModule, DatePipe,
    CheckboxModule, NgStyle,
    GpxTrackComponent, ButtonDirective
  ],
  templateUrl: './my-races.component.html',
  styleUrl: './my-races.component.scss',
})
export class MyRacesComponent implements OnInit {

  toastService = inject(ToastService);
  sportsService = inject(SportsService);
  coursesService = inject(CoursesService);
  confirmationService = inject(ConfirmationService);
  loginService = inject(LoginService);
  destroyRef = inject(DestroyRef);

  courseOptions: any = [
    {label: 'A venir', value: 0},
    {label: 'Passé', value: 1}
  ];
  courseTypeSelected = signal(0);
  visible = signal(false);

  courseForm = new FormGroup({
    titre: new FormControl('', { validators: [Validators.required] }),
    distance: new FormControl(null, { validators: [Validators.required, Validators.min(0)] }),
    denivele: new FormControl(null, { validators: [Validators.required, Validators.min(0)] }),
    nomCourse: new FormControl('', { validators: [Validators.required] }),
    time: new FormControl(null),
    finished: new FormControl(false),
    date: new FormControl<Date | null>(null, {validators: [Validators.required] }),
    sport: new FormControl({}, { validators: [Validators.required] }),
  });

  _selectedSport = signal<Sport | undefined>(undefined);
  sports = signal<Sport[]>([]);

  coursesToCome = signal<Course[]>([]);
  coursesOld = signal<Course[]>([]);

  selectedCourse =  signal<Course[]>([]);

  isMobile = signal(false);
  modalWidth = signal('60');

  gpxFileToLoad = signal('');

  constructor() {
    this.setEffects();
    inject(BreakpointObserver)
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (this.isMobile()) {
          this.modalWidth.set(this.isMobile() ? '95' : '60');
        }
      });
  }

  ngOnInit(): void {
    this.getAllSports();
    this.courseTypeSelected.set(this.courseOptions[0].value);
    console.log('in course');
  }

  getAllSports() {
    this.sportsService.getAllSports().pipe(
      takeUntilDestroyed(this.destroyRef) // Auto-unsubscribe on destroy
    ).subscribe((sports: Sport[]) => {
      this.sports.set(sports);
      this._selectedSport.set(this.sports().find(s => s.code === 'TRA'));
    });
  }

  protected deleteRace() {
    if (!this.selectedCourse() || !this.selectedCourse()?.length) {
      return;
    }
    const ids: number[] = this.selectedCourse()!.map(s => s.id);
    this.confirmationService.confirm({
      message: 'Supprimer <span class="bold">' + this.selectedCourse()!.map(s => s.titre).join(', ') + '</span> ?',
      header: 'Suppression',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger'
      },

      accept: () => {
        const reqs = this.selectedCourse()!.map(s => this.coursesService.deleteCourse(s.id));
        forkJoin(reqs).subscribe(() => {
          this.coursesToCome.set(this.coursesToCome().filter(c => !ids.find(i => c.id === i)));
          this.coursesOld.set(this.coursesOld().filter(c => !ids.find(i => c.id === i)));
          this.toastService.showMessage(this.selectedCourse()!.length > 1 ? 'Courses supprimées' : 'Course supprimée');
          this.selectedCourse.set([]);
        })
      },
      reject: () => {
      }
    });
  }

  protected onSportSelected(id: any) {
    const now = new Date().getTime();
    this.coursesService.getCoursesBySportId(id).subscribe((courses: Course[]) => {
      const sortedCToComeCourses = courses?.filter(c => c.date.getTime() > now).sort((a, b) => a.date.getTime() - b.date.getTime());
      const sortedPassedCourses = courses?.filter(c => c.date.getTime() < now).sort((a, b) => b.date.getTime() - a.date.getTime());
      this.coursesToCome.set(sortedCToComeCourses);
      this.coursesOld.set(sortedPassedCourses);
    })
  }

  showAddRaceDialog() {
    this.courseForm.reset();
    this.courseForm.patchValue({
      sport: this._selectedSport()
    })
    this.visible.set(true);
  }

  saveRace() {
    if (this.courseForm?.valid) {
      this.visible.set(false);
      const courseToAdd: Course = {
        id: 0,
        titre: String(this.courseForm.value.titre),
        distance: Number(this.courseForm.value.distance),
        denivele: Number(this.courseForm.value.denivele),
        nomCourse: String(this.courseForm.value.nomCourse),
        time: Number(this.courseForm.value.time),
        finished: Boolean(this.courseForm.value.finished),
        date: new Date(this.courseForm.value.date || new Date()),
        sportId: (this.courseForm.value.sport as Sport).id,
        userId: this.loginService.userConnected()!.id,
        gpxFile: '',
      }
      this.coursesService.addCourse(courseToAdd).subscribe((res: CourseDto) => {
        if (res && res.TITRE) {
          courseToAdd.id = mapCourse(res).id;
          this.toastService.showMessage('Course ajoutée ' + this.courseForm.value.titre);
          if (courseToAdd.date.getTime() > new Date().getTime()) {
            this.coursesToCome.update(courses => [...courses, courseToAdd]);
          } else {
            this.coursesOld.update(courses => [...courses, courseToAdd]);
          }
        }
      })
    } else {
      this.courseForm.markAsDirty();
      this.courseForm.markAllAsTouched();
      return;
    }
  }

  protected courseTypeChanged(selected: any) {
    this.courseTypeSelected.set(selected.value);
    this.selectedCourse.set([]);
  }

  public getRemaingDays(date: Date) {
    const now = new Date();
    return differenceInCalendarDays(date, now);
  }

  public milisecondsToTime(ms: number) {
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);

    return hours + 'h' + minutes;
  }

  protected setSelected($event: any) {
    this.selectedCourse.set($event)
  }

  private setEffects() {
    effect(() => {
      const sport = this._selectedSport();
      if (!sport) {
        return;
      }
      this.onSportSelected(sport.id);
    });
  }

  protected onShowRowMap(course: Course) {
      const file = course.gpxFile;
    if (file) {
      this.gpxFileToLoad.set(file);
    } else {
      this.gpxFileToLoad.set('');
    }
  }
}
