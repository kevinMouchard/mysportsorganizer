import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCard } from './course-card.component';
import {By} from '@angular/platform-browser';
import {CourseDto, mapCourse} from '../../models/course.model';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {LOCALE_ID} from '@angular/core';

describe('CourseCard', () => {
  let component: CourseCard;
  let fixture: ComponentFixture<CourseCard>;

  const mockCourse: CourseDto = {
    ID: 6,
    TITRE: 'Trail de Cuers 2026',
    DISTANCE: 25000,
    DENIVELE: 1150,
    NOM_COURSE: 'Le Trail des Massacans',
    DATE: new Date('2026-03-29'),
    SPORT_ID: 1
}

  beforeAll(() => {
    // Register once for this spec file
    registerLocaleData(localeFr);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCard],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the course card', () => {
    fixture.componentRef.setInput('course', mapCourse(mockCourse));

    fixture.detectChanges();

    const cardHeader = fixture.debugElement.query(
      By.css('.p-card-title')
    );
    const cardBody = fixture.debugElement.query(
      By.css('.p-card-content')
    );

    expect(cardHeader).toBeTruthy();
    expect(cardHeader.nativeElement.textContent).toContain('Trail de Cuers 2026');

    expect(cardBody).toBeTruthy();

    const tempsRestant = fixture.componentInstance.getRemaingDays(mockCourse.DATE);

    expect(cardBody.nativeElement.textContent).toContain(' 25 Km  - 1150D+  Le Trail des Massacans  dimanche 29 mars 2026  Temps restant: ' + tempsRestant + ' jours');
  });

});
