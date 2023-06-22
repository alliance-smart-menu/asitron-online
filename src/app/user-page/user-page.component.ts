import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { codes } from "../code";

import { AuthService } from "src/app/services/auth.service";
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  html: any = {
    profile: {
      ru: "Мой профиль",
      en: "My profile",
      md: "Profilul meu"
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
      ru: "Сохранить",
      en: "Save",
      md: "Salvați"
    },
    change_password: {
      ru: "Сменить пароль",
      en: "Change Password",
      md: "Schimbaţi parola"
    },
    change: {
      ru: "Сменить",
      en: "Change",
      md: "Schimbare"
    },
    logout: {
      ru: "Выйти",
      en: "Logout",
      md: "Ieși"
    }
  }

  loading: boolean = false;
  pennding: boolean = false;

  codes = codes;
  filteredCodes: any[] = [];


  _id: string | undefined
  user: FormGroup;
  password: FormGroup;


  constructor(
    private snackbar: SnackbarService,
    public authService: AuthService,
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
    }); // Set the validators at the FormGroup level

    this.password = new FormGroup({
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
    }, { validators: this.matchPassword() })

    this.user.get('code')?.valueChanges.subscribe((value) => {
      this.filteredCodes = this.codes.filter((item) => item.code.includes(value));
    });

  }

  ngOnInit(): void {
    this.getUser();
  }

  saveInfo() {
    this.patch(this.user.getRawValue())
  }

  savePassword() {
    const data = this.password.getRawValue();
    this.patch({password: data.password})
    this.password.reset({
      password: undefined,
      confirm_password: undefined
    })
  }

  patch(data: any) {
    this.pennding = true

    this.authService.patch(data, this._id!).subscribe(
      data => {
        this.snackbar.open(data.message[this.authService.language])
        this.unZip(data.client)

        if (this.authService.user) {
          this.authService.user.name = data.client.name
        }

        this.pennding = false
      },
      error => {
        this.pennding = false
        console.warn(error)
      }
    )
  }

  getUser() {
    if (this.authService.user) {
      this.loading = true
      
      this.authService.findOne({_id: this.authService.user._id}).subscribe(
        data => {
          this.unZip(data)
          this.loading = false
        },
        error => {
          console.warn(error)
        }
      )
    }
  }

  unZip(data: any) {
    this._id = data._id
    this.user.patchValue({
      login: data.login,
      code: data.code,
      phone: data.phone,
      name: data.name
    })
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
