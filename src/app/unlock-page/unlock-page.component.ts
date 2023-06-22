import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-unlock-page',
  templateUrl: './unlock-page.component.html',
  styleUrls: ['./unlock-page.component.css']
})
export class UnlockPageComponent {

  html: any = {
    start: {
      ru: "Оформить заявку",
      en: "Make a request",
      md: "A face o cerere"
    }
  }

  constructor(
    public authService: AuthService
  ) {}

}
