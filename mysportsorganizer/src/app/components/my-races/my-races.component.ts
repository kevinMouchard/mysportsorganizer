import {Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {ToastService} from '../../services/toast.service';
import {Sport} from '../../models/sports.model';
import {SportsService} from '../../services/sports/sports.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {CoursesService} from '../../services/courses/courses.service';
import {Course} from '../../models/course.model';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {CourseCard} from '../course-card/course-card.component';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'my-races',
  standalone: true,
  providers: [ToastService],
  imports: [
    FormsModule,
    Select,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    CourseCard,
    Button,
    DialogModule, InputTextModule,
    ReactiveFormsModule,
    DatePickerModule
  ],
  templateUrl: './my-races.component.html',
  styleUrl: './my-races.component.scss',
})
export class MyRacesComponent implements OnInit {

  toastService = inject(ToastService);
  sportsService = inject(SportsService);
  coursesService = inject(CoursesService);
  private destroyRef = inject(DestroyRef);

  visible: boolean = false;

  courseForm = new FormGroup({
    titre: new FormControl('', { validators: [Validators.required] }),
    distance: new FormControl(null, { validators: [Validators.required, Validators.min(0)] }),
    denivele: new FormControl(null, { validators: [Validators.required, Validators.min(0)] }),
    nomCourse: new FormControl('', { validators: [Validators.required] }),
    date: new FormControl<Date | null>(null, {validators: [Validators.required] }),
    sport: new FormControl({}, { validators: [Validators.required] }),
  });

  _selectedSport = signal<Sport | undefined>(undefined);
  sports = signal<Sport[]>([]);

  coursesToCome = signal<Course[]>([]);
  coursesOld = signal<Course[]>([]);

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

  protected deleteRace(id: number | undefined) {
    if (id) {
      this.coursesService.deleteCourse(id).subscribe(() => {
        this.coursesToCome.set(this.coursesToCome().filter(c => c.id !== id));
        this.coursesOld.set(this.coursesOld().filter(c => c.id !== id));
        this.toastService.showMessage('Courses supprimée ' + id);
      })
    }
  }

  protected onSportSelected($event: any) {
    const now = new Date().getTime();
    this.coursesService.getCoursesBySportId($event?.value?.id).subscribe((courses: Course[]) => {
      const sortedCToComeCourses = courses?.filter(c => c.date.getTime() > now).sort((a, b) => a.date.getTime() - b.date.getTime());
      const sortedPassedCourses = courses?.filter(c => c.date.getTime() < now).sort((a, b) => a.date.getTime() - b.date.getTime());
      this.coursesToCome.set(sortedCToComeCourses);
      this.coursesOld.set(sortedPassedCourses);
    })
  }

  showAddRaceDialog() {
    this.courseForm.reset();
    this.visible = true;
  }

  saveRace() {
    if (this.courseForm?.valid) {
      this.visible = false;
      const courseToAdd: Course = {
        id: 0,
        titre: String(this.courseForm.value.titre),
        distance: Number(this.courseForm.value.distance),
        denivele: Number(this.courseForm.value.denivele),
        nomCourse: String(this.courseForm.value.nomCourse),
        date: new Date(this.courseForm.value.date || new Date()),
        sportId: (this.courseForm.value.sport as Sport).id
      }
      this.coursesService.addCourse(courseToAdd).subscribe(() => {
        this.toastService.showMessage('Course ajoutée ' + this.courseForm.value.titre);
        // add to liste
      })
    } else {
      this.courseForm.markAsDirty();
      this.courseForm.markAllAsTouched();
      return;
    }
  }
}
