import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {Menubar} from 'primeng/menubar';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Button} from 'primeng/button';
import {LoginService} from './services/login/login.service';
import {ToastService} from './services/toast.service';

@Component({
  selector: 'app-root',
  providers: [MessageService, ConfirmationService, ToastService],
  standalone: true,
  imports: [RouterOutlet, Menubar, Toast, ConfirmDialogModule, Button],
  template: `
    <div class="flex flex-wrap">
      <div class="w-1/12">
        {{ title() }}
      </div>
      <div class="w-9/12">
        <p-menubar [model]="items"/>
      </div>
      <div class="w-2/12 flex flex-wrap">
        @if (loginService.userConnected() != undefined) {
          <div class="w-10/12">
              <p>{{'Bienvenue ' +  loginService.userConnected()?.prenom + ' ' + loginService.userConnected()?.nom }}</p>
          </div>
          <div class="w-2/12">
            <p-button class="right" label="Logout" (click)="logout()"/>
          </div>
        } @else {
          <div class="w-10/12">
              <p>No user</p>
          </div>
          <div class="w-2/12">
            <p-button class="right" label="Login" (click)="login()"/>
          </div>
        }
      </div>
    </div>
    <p-toast/>
    <p-confirmDialog></p-confirmDialog>
    <router-outlet/>
  `,
  styles: [],
})
export class App implements OnInit {

  private primeng = inject(PrimeNG);
  private router = inject(Router);
  public loginService = inject(LoginService);
  toastService = inject(ToastService);

  protected readonly title = signal('MySports Organizer');

  items: MenuItem[] | undefined;




  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.items = [
      {
        label: '',
        icon: 'pi pi-home',
        routerLink: ['/my-races']
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

  protected login() {
    this.toastService.showMessage('Vous êtes connecté');
    this.router.navigate(['/login']);
  }

  protected logout() {
    this.loginService.logout().subscribe((result) => {
      this.toastService.showMessage('Vous êtes déconnecté');
      this.router.navigate(['/login']);
    })
  }
}
