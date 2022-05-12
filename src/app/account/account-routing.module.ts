import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';
import { ApproveLoanComponent } from './approve_loan/approve_loan.component';
import { ResetResolver } from './reset/reset-resolver.service';
import { ApproveLoanResolver } from './approve_loan/approve_loan-resolver.service';
import { ResetCompleteComponent } from './reset/reset-complete.component';
import { RegisterComponent } from './register/register.component';
import { RegisterResolver } from './register/register-resolver.service';
import { LinePayComponent } from './line_pay/line_pay.component';
import { LinePayResolver } from './line_pay/line_pay-resolver.service';
import { HistoryPaymentComponent } from './history_payment/history_payment.component';
import { HistoryPaymentResolver } from './history_payment/history_payment-resolver.service';
import { SettingAlertComponent } from './setting_alert/setting-alert.component';
import { SettingAlertResolver } from './setting_alert/setting-alert-resolver.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'reset/:id', component: ResetComponent, resolve: {
      reset: ResetResolver
    },
  },
  { path: 'resetcomplete', component: ResetCompleteComponent },
  {
    path: 'lots02',
    component: ApproveLoanComponent,
    data: {
      code: 'LOTS02'
    },
    resolve: {
      LOTS02: ApproveLoanResolver
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      code: 'REGISTER'
    },
    resolve: {
      approveloan: RegisterResolver
    }
  },
  {
    path: 'linepay',
    component: LinePayComponent,
    data: {
      code: 'LINEPAY'
    },
    resolve: {
      linepay: LinePayResolver
    }
  },
  {
    path: 'historypayment',
    component: HistoryPaymentComponent,
    data: {
      code: 'HISTORYPAYMENT'
    },
    resolve: {
      historypayment: HistoryPaymentResolver
    }
  },
  {
    path: 'settingalert',
    component: SettingAlertComponent,
    data: {
      code: 'settingalert'
    },
    resolve: {
      settingAlert: SettingAlertResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ResetResolver, ApproveLoanResolver
    , RegisterResolver, LinePayResolver
    , SettingAlertResolver, HistoryPaymentResolver]
})
export class AccountRoutingModule { }
