import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './classes/auth.guard';

import { UnlockPageComponent } from './unlock-page/unlock-page.component';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { UserPageComponent } from './user-page/user-page.component';

import { UnlockFormComponent } from './unlock-form/unlock-form.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';

const routes: Routes = [

  {path: 'home',  component: UnlockPageComponent},
  {path: 'login',  component: LoginPageComponent},
  {path: 'register',  component: RegisterPageComponent},
  {path: 'user', canActivate: [AuthGuard],  component: UserPageComponent},
  {path: 'unlock', canActivate: [AuthGuard],  component: UnlockFormComponent},
  {path: 'payment', canActivate: [AuthGuard],  component: PaymentPageComponent},

  { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
