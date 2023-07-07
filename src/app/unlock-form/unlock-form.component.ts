import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { UnlockService } from '../services/unlock.service';
import { Router } from '@angular/router';

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
      md: "Creați o comandă"
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
      md: "Modalitatea de plată"
    },
    total: {
      ru: "К оплате",
      en: "To pay",
      md: "Spre plate"
    },
    create: {
      ru: "Создать",
      en: "Create",
      md: "Creați"
    },
    unlocks_title_1: {
      ru: "Создайте первую заявку!",
      en: "Create your first application!",
      md: "Creați prima comandă!"
    },
    unlocks_number: {
      ru: "Номер заявки",
      en: "Application number",
      md: "Numărul comandei"
    },
    unlocks_date: {
      ru: "Дата подачи",
      en: "Date of application",
      md: "Data comenzei"
    },
    master_call: {
      ru: "Связаться",
      en: "Contact",
      md: "Contactați"
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
      md: "Toate comenzele"
    },
    open: {
      ru: "Открытые",
      en: "Opens",
      md: "Deschise"
    },
    closed: {
      ru: "Закрытые",
      en: "Closeds",
      md: "Închise"
    },
    balance: {
      ru: "Баланс",
      en: "Balance",
      md: "Balanța"
    },
    paid: {
      ru: "Оплатить",
      en: "Pay",
      md: "A chetați"
    },
    programm: {
      ru: "Программа для доступа мастера",
      en: "Worker access program",
      md: "Programul de acces ameștirilor"
    },
    download: {
      ru: "Скачать",
      en: "Download",
      md: "Descărcați"
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
    private unlockService: UnlockService,
    private router: Router
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

  patch(item: any) {
    this.pennding = true

    this.unlockService.patch(item, item._id).subscribe(
      data => {
        this.router.navigate(
          ['/payment'], 
          { queryParams: 
            { 
              method: item.payment.method,
              price: item.price[item.payment.valuta]
            } 
          }
        );
      },
      error => {
        console.warn(error)
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
