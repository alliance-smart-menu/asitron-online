import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {


  html: any = {
    methods: {
      ru: "Методы оплаты",
      en: "Payment Methods",
      md: "Metode de plata"
    },
    call: {
      ru: "Контакты",
      en: "Contacte",
      md: "Contact"
    },
    name: {
      ru: "Георгий",
      en: "George",
      md: "Georgii"
    },
    phone: {
      ru: "Номер телефона",
      en: "Phone number",
      md: "Număr de telefon"
    }
  }

  methods: any[] = [
    {
      method: "Victoriabank",
      valuta: "mdl",
      image: "../../assets/payments/Victoria.svg",
      card: "4779 1800 0211 7886",
      name: "Georgi Mita"
    },
    {
      method: "MICB",
      image: "../../assets/payments/MICB.svg",
      card: "4028 1102 8151 0294",
      valuta: "mdl",
      name: "Georgi Mita"
    },
    {
      method: "MAIB", 
      valuta: "mdl",
      image: "../../assets/payments/MAIB.svg",
      card: "4356 9600 6337 5635",
      name: "Georgi Mita"
    },
    {
      method: "Paynet", 
      valuta: "mdl",
      image: "../../assets/payments/Paynet.svg",
      card: "+373 79 006 119"
    },
    // {method: "USDT-TRC20", valuta: "usdt"}
  ]


  payments = this.methods
  price: number | undefined


  constructor(
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkQueryParams();
  }

  checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      const method = params['method'];
      const price = params['price'];
      
      if (method) {
        this.payments = this.methods.filter( item => item.method == method )
      }
  
      if (price) {
        this.price = +price
      }

    });
  }

}
