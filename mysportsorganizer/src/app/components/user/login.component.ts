import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DatePickerModule} from 'primeng/datepicker';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-user',
  imports: [
    Button,
    DialogModule, InputTextModule,
    ReactiveFormsModule,
    DatePickerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  loginService = inject(LoginService);
  userService = inject(UserService);
  router = inject(Router);

  userConnected = signal<LoginComponent | undefined>(undefined);
  isLogin = signal<boolean>(true);

  userForm = new FormGroup({
    nom: new FormControl('', { validators: [Validators.required] }),
    prenom: new FormControl('', { validators: [Validators.required] }),
    ddn: new FormControl<Date | null>(null, {validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] })
  });


  loginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] })
  });

  protected doLogin() {
    if (this.loginForm.valid) {
      this.loginService.login(String(this.loginForm.value.email), String(this.loginForm.value.password)).subscribe({
        next: () => this.router.navigate(['/my-races']),
        error: () => alert('Login failed')
      });
    } else {
      this.loginForm.markAsDirty();
      this.loginForm.markAllAsTouched();
      return;
    }
  }


  protected createUser() {
    if (this.userForm?.valid) {
      const userToAdd: User = {
        id: 0,
        nom: String(this.userForm.value.nom),
        prenom: String(this.userForm.value.prenom),
        ddn: new Date(this.userForm.value.ddn || new Date()),
        email: String(this.userForm.value.email),
        password: String(this.userForm.value.password),
      }
      this.userService.addUser(userToAdd).subscribe({
        next: () => this.router.navigate(['/my-races']),
        error: () => alert('Login failed')
      });
    } else {
      this.loginForm.markAsDirty();
      this.loginForm.markAllAsTouched();
      return;
    }
  }


  protected closeDialog() {

  }
}
