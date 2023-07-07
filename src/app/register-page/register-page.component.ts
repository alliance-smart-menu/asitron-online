import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { codes } from "../code";

import { AuthService } from "src/app/services/auth.service";
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  html: any = {
    registration: {
      ru: "Регистрация",
      en: "Registration",
      md: "Înregistrare"
    },
    login: {
      ru: "Логин",
      en: "Login",
      md: "Login"
    },
    code: {
      ru: "Код",
      en: "Code",
      md: "Code"
    },
    phone: {
      ru: "Номер телефона",
      en: "Phone number",
      md: "Număr de telefon"
    },
    password: {
      ru: "Пароль",
      en: "Password",
      md: "Parola"
    },
    confirm_password: {
      ru: "Повторите пароль",
      en: "Repeat the password",
      md: "Repetați parola"
    },
    name: {
      ru: "Имя & Фамилия",
      en: "First Name & Last Name",
      md: "Prenume & Nume"
    },
    end: {
      ru: "Зарегистрироваться",
      en: "Register",
      md: "Inregistreazate"
    },
  }

  loading: boolean = false;
  pennding: boolean = false;

  codes = codes;
  filteredCodes: any[] = [];

  user: FormGroup;

  constructor(
    private snackbar: SnackbarService,
    public authService: AuthService,
    private router: Router
  ) {

    this.user = new FormGroup({
      login: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_!]+$/)
      ]),
      code: new FormControl("373", [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)
      ]),
      phone: new FormControl(undefined, 
        [
        Validators.required, 
        Validators.minLength(5),
        Validators.pattern(/^[0-9]+$/)
      ]),
      name: new FormControl(undefined, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9_!]+$/)
      ]),
      confirm_password: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9_!]+$/),
        this.matchPassword()
      ])
    }, { validators: this.matchPassword() }); // Set the validators at the FormGroup level

    this.user.get('code')?.valueChanges.subscribe((value) => {
      this.filteredCodes = this.codes.filter((item) => item.code.includes(value));
    });
  }

  post() {
    this.pennding = true;

    this.authService.register(this.user.getRawValue()).subscribe(
      data => {
        this.snackbar.open(data[this.authService.language]);
        this.router.navigate(['/login']);
      },
      error => {
        this.pennding = false
        console.warn(error);
        this.snackbar.open(error.error.message ? error.error.message[this.authService.language] : "Ошибка", 5);
      }
    );
  }

  displayCode(code: string): string {
    return code ? `+${code}` : '';
  }

  matchPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirm_password')?.value;
      return password === confirmPassword ? null : { 'passwordMismatch': true };
    };
  }
}
