import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {LoginService} from '../../services/login/login.service';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoginService', ['login']);
    spy.login.and.returnValue(of({ token: '123' }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: LoginService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render email and password inputs', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    const submitButton = fixture.debugElement.query(By.css('p-button[label="login"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should mark form invalid when empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should mark form valid with correct values', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call LoginService.doLogin when form is valid', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });

    const button = fixture.debugElement.query(By.css('p-button[label="login"]'));
    button.nativeElement.click();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
  });

  it('should not call LoginService.doLogin when form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });

    component.doLogin(); // call directly
    expect(authService.login).not.toHaveBeenCalled();
  });
});
