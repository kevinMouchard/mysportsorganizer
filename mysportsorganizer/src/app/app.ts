import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {Menubar} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  providers: [MessageService],
  standalone: true,
  imports: [RouterOutlet, Menubar, Toast],
  template: `
    <div class="flex flex-wrap">
      <div class="w-1/12">
        {{title()}}
      </div>
      <div class="w-11/12">
        <p-menubar [model]="items" />
      </div>
    </div>
    <p-toast />

    <router-outlet />
  `,
  styles: [],
})
export class App implements OnInit {

  private primeng = inject(PrimeNG);
  protected readonly title = signal('MySports Organizer');
  items: MenuItem[] | undefined;


  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.items = [
      {
        label: '',
        icon: 'pi pi-home',
        routerLink: ['/myRaces']
      },
      {
        label: 'Courses',
        icon: 'pi pi-star',
        items: [
          {
            label: 'Mes courses',
            routerLink: ['/my-races']
          }
        ]
      },
      {
        label: 'Entrainements',
        icon: 'pi pi-search'
      }
    ]
  }
}
