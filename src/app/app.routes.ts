import { Routes } from '@angular/router';
import {MyRacesComponent} from './components/my-races/my-races.component';
import {LoginComponent} from './components/user/login.component';
import {AuthGuard} from './services/guards/authguard.service';

export const routes: Routes = [
  {path: '', redirectTo: 'my-races', pathMatch: 'full'},
  {path: 'my-races', component: MyRacesComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
];
