// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import {By} from '@angular/platform-browser';
// import localeFr from '@angular/common/locales/fr';
// import {registerLocaleData} from '@angular/common';
// import {LOCALE_ID} from '@angular/core';
// import {MyRacesComponent} from './my-races.component';
// import {mapSport, Sport, SportDto} from '../../models/sports.model';
//
// describe('CourseCard', () => {
//   let component: MyRacesComponent;
//   let fixture: ComponentFixture<MyRacesComponent>;
//
//   const sportsMock: SportDto[] = [
//     {
//       CODE: "TRA",
//       ID: 1,
//       NOM: "Trail"
//     },
//     {
//       CODE: "CAP",
//       ID: 2,
//       NOM: "Course a pied"
//     },
//     {
//       CODE: "VTT",
//       ID: 3,
//       NOM: "VTT"
//     }
//   ]
//
//   beforeAll(() => {
//     // Register once for this spec file
//     registerLocaleData(localeFr);
//   });
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [MyRacesComponent],
//       providers: [
//         { provide: LOCALE_ID, useValue: 'fr-FR' }
//       ]
//     })
//       .compileComponents();
//
//     fixture = TestBed.createComponent(MyRacesComponent);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   //
//   // it('should show the course card', () => {
//   //   fixture.componentInstance.sports.set(sportsMock.map(s => mapSport(s)));
//   //   fixture.detectChanges();
//   //
//   //   const cardHeader = fixture.debugElement.query(
//   //     By.css('.p-card-title')
//   //   );
//   //   const cardBody = fixture.debugElement.query(
//   //     By.css('.p-card-content')
//   //   );
//   //
//   //   expect(cardHeader).toBeTruthy();
//   //   expect(cardHeader.nativeElement.textContent).toContain('Trail de Cuers 2026');
//   //
//   //   expect(cardBody).toBeTruthy();
//   //
//   //   const tempsRestant = fixture.componentInstance.getRemaingDays(mockCourse.DATE);
//   //
//   //   expect(cardBody.nativeElement.textContent).toContain(' 25 Km  - 1150D+  Le Trail des Massacans  dimanche 29 mars 2026  Temps restant: ' + tempsRestant + ' jours');
//   // });
//
// });
