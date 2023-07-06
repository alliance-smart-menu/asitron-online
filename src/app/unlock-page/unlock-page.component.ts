import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-unlock-page',
  templateUrl: './unlock-page.component.html',
  styleUrls: ['./unlock-page.component.css']
})
export class UnlockPageComponent implements OnInit {

  html: any = {
    start: {
      ru: "Оформить заявку",
      en: "Make a request",
      md: "A face o cerere"
    }
  }

  folder: string = "desktop"

  constructor(
    public authService: AuthService
  ) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.checkWindowSize();
  }

  ngOnInit(): void {
    this.checkWindowSize();
  }

  getImagePath(): string {
    return `../../assets/${this.folder}/page-1.svg`;
  }


  checkWindowSize() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 768) {
      this.folder = 'mobile';
    } else {
      this.folder = 'desktop';
    }
  }

}
