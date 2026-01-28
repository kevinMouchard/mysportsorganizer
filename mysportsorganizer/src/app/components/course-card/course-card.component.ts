import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Course} from '../../models/course.model';
import {differenceInCalendarDays} from 'date-fns';
import {DatePipe} from '@angular/common';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'course-card',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    Button,
    Card,
    DatePipe
  ],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCard {

  confirmationService = inject(ConfirmationService);

  course: InputSignal<Course | undefined> = input<Course | undefined>();
  showTimeLeft: InputSignal<boolean> = input<boolean>(true);
  courseToDelete = output<Course | undefined>();


  public getRemaingDays(date: Date) {
    const now = new Date();
    return differenceInCalendarDays(date, now);
  }

  protected deleteRace() {
    this.courseToDelete.emit(this.course())
    if (this.course()) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('Item deleted');
        },
        reject: () => {
          console.log('Deletion cancelled');
        }
      });
    }
  }

}
