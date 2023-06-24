import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { UnlockService } from '../services/unlock.service';

@Component({
  selector: 'app-unlock-form',
  templateUrl: './unlock-form.component.html',
  styleUrls: ['./unlock-form.component.css']
})
export class UnlockFormComponent implements OnInit {

  methods: any[] = [
    {method: "Victoriabank", valuta: "mdl"},
    {method: "MICB", valuta: "mdl"},
    {method: "MAIB", valuta: "mdl"},
    {method: "Paynet", valuta: "mdl"},
    {method: "USDT-TRC20", valuta: "usdt"}
  ]

  html: any = {
    start: {
      ru: "Оформить заявку",
      en: "Make a request",
      md: "A face o cerere"
    },
    model: {
      ru: "Модель",
      en: "Model",
      md: "Model"
    },
    comment: {
      ru: "Комментарий",
      en: "Comment",
      md: "Comentariu"
    },
    payment: {
      ru: "Способ оплаты",
      en: "Payment method",
      md: "Modalitate de plată"
    },
    total: {
      ru: "К оплате",
      en: "To pay",
      md: "A plăti"
    },
    create: {
      ru: "Создать",
      en: "Create",
      md: "Creați"
    },
    unlocks_title_1: {
      ru: "Создайте первую заявку!",
      en: "Create your first application!",
      md: "Creați-vă prima aplicație!"
    },
    unlocks_number: {
      ru: "Номер заявки",
      en: "Numarul aplicatiei",
      md: "Application number"
    },
    unlocks_date: {
      ru: "Дата подачи",
      en: "Date of application",
      md: "Data aplicării"
    },
    unlocks_paid: {
      ru: "Платеж принят",
      en: "Payment accepted",
      md: "Plata acceptata"
    },
    unlocks_done: {
      ru: "Завершен",
      en: "Completed",
      md: "Terminat"
    },
    unlocks_total: {
      ru: "Всего заявок",
      en: "Total applications",
      md: "Total de aplicații"
    },
    open: {
      ru: "Открытые",
      en: "Open",
      md: "Deschis"
    },
    closed: {
      ru: "Закрытые",
      en: "Closed",
      md: "Închis"
    },
    balance: {
      ru: "Баланс",
      en: "Balance",
      md: "Balance"
    },
    paid: {
      ru: "Оплатить",
      en: "Pay",
      md: "A plati"
    }
  }

  loading: boolean = false
  pennding: boolean = false

  unlock: FormGroup;

  unlocks: any[] | undefined

  total: number = 0
  open: number = 0
  closed: number = 0
  
  constructor(
    public authService: AuthService,
    private snackbar: SnackbarService,
    private unlockService: UnlockService
  ) 
  {
    this.unlock = new FormGroup({
      model: new FormControl(undefined, [Validators.required, Validators.minLength(5)]),
      comment: new FormControl(undefined),
    });
  }

  ngOnInit(): void {
    this.get();
  } 

  post() {
    this.pennding = true

    this.unlockService.post(this.unlock.getRawValue()).subscribe(
      data => {
        this.snackbar.open(data[this.authService.language])
        this.clear()
        this.get()
        this.pennding = false
      },
      error => {
        this.pennding = false
        console.warn(error);
        this.snackbar.open(error.error.message ? error.error.message : "Ошибка", 5);
      }
    )
  }

  get() {
    this.loading = true

    this.unlockService.get().subscribe(
      data => {
        this.unlocks = data.map( (item: any) => {

          if (item.price && !item.payment && !item.paid) {
            item.payment = {method: "Victoriabank", valuta: "mdl"}
          }

          return item
        } )

        data.forEach((element: any) => {
          if (element.done) {
            this.closed++
          } else {
            this.open++
          }
        });

        this.total = data.length
        this.loading = false
      },
      error => {
        console.warn(error)
      }
    )
  }

  clear() {
    this.unlock.patchValue({
      model: undefined,
      comment: undefined,
      payment: {method: "Victoriabank", valuta: "mdl"},
      price: 150
    })
  }

  onPaymentChange() {
    const payment = this.unlock.get('payment')?.value;
    
    if (this.authService.user) {
      
      this.unlock.patchValue({
        price: this.authService.user.price[payment.valuta]
      });

    }
  }

  subscribeToMethodChange() {
    this.unlock.get('payment')?.valueChanges.subscribe(() => {
      this.onPaymentChange();
    });
  }


}
