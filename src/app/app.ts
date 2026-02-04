import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {PrimeNG} from 'primeng/config';
import {Menubar} from 'primeng/menubar';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Button} from 'primeng/button';
import {LoginService} from './services/login/login.service';
import {ToastService} from './services/toast.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  providers: [MessageService, ConfirmationService, ToastService],
  standalone: true,
  imports: [RouterOutlet, Menubar, ToastModule, ConfirmDialogModule, Button],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  private primeng = inject(PrimeNG);
  private router = inject(Router);
  public loginService = inject(LoginService);
  toastService = inject(ToastService);

  protected readonly title = signal('MySports Organizer');

  items: MenuItem[] | undefined;

  isMobile = signal(false);

  constructor() {
    inject(BreakpointObserver)
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }


  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.items = [
      {
        label: '',
        icon: 'pi pi-home',
        routerLink: ['/my-races']
      },
      // {
      //   label: 'Courses',
      //   icon: 'pi pi-star',
      //   items: [
      //     {
      //       label: 'Mes courses',
      //       routerLink: ['/my-races']
      //     }
      //   ]
      // },
      // {
      //   label: 'Entrainements',
      //   icon: 'pi pi-search'
      // }
    ]
  }

  protected login() {
    this.router.navigate(['/login']);
  }

  protected logout() {
    this.loginService.logout().subscribe((result) => {
      this.toastService.showMessage('Vous êtes déconnecté');
      this.router.navigate(['/login']);
    })
  }
}
