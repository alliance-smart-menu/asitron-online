import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { codes } from "../code";

import { AuthService } from "src/app/services/auth.service";
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  html: any = {
    my_account: {
      ru: "Мой аккаунт",
      en: "My account",
      md: "Contul meu"
    },
    enter: {
      ru: "Войти",
      en: "Enter",
      md: "Intra"
    },
    login: {
      ru: "Логин",
      en: "Login",
      md: "Login"
    },
    password: {
      ru: "Пароль",
      en: "Password",
      md: "Parola"
    },
    registration: {
      ru: "Регистрация",
      en: "Registration",
      md: "Înregistrare"
    },
  }

  pennding: boolean = false;
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
      password: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9_!]+$/)
      ]),
    })

  }

  ngOnInit(): void {
    if (this.authService.user) {
      this.router.navigate(['/unlock'])
    }
  }

  login() {
    this.pennding = true

    this.authService.login(this.user.getRawValue()).subscribe(
      data => {
        this.snackbar.open(data.message[this.authService.language])
        this.router.navigate(['/unlock'])
      },
      error => {
        this.pennding = false
        console.warn(error);
        this.snackbar.open(error.error.message ? error.error.message[this.authService.language] : "Ошибка", 5);
      }
    )
  }

}


