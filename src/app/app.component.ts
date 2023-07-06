import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading: boolean = false

  html: any = {
    home: {
      ru: "Главная",
      en: "Home",
      md: "Acasă"
    },
    enter: {
      ru: "Войти",
      en: "Enter",
      md: "Intra"
    },
    unlock: {
      ru: "Заявка",
      en: "Bid",
      md: "Aplicație"
    },
    payment: {
      ru: "Оплата",
      en: "Payment",
      md: "Plată"
    },
    contacts: {
      ru: "Контакты",
      en: "Contacts",
      md: "Contacte"
    }
  }

  constructor(
    public authSerivce: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUser();
    this.checkLanguage();
  }


  setLanguage(language: string) {
    this.authSerivce.language = language
    localStorage.setItem("language", language)
  }

  LangColor(lang: string) {
    if (lang == this.authSerivce.language) {
      return "active"
    } else {
      return ""
    }
  }

  checkLanguage() {
    const candidate = localStorage.getItem("language")
    if (candidate) {
      this.authSerivce.language = candidate
    }
  }

  checkUser() {

    const candidate = localStorage.getItem('auth-token')

    if (candidate) {
      this.loading = true

      this.authSerivce.setToken(candidate)

      this.authSerivce.userInfo().subscribe(
        data => {
          this.authSerivce.setUser(data)
          setTimeout(() => {
            this.loading = false
          }, 1000);
        },
        error => {
          console.warn(error)
          this.loading = false
        }
      )


    } 

  }

}
