import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { ResetComponent } from './reset/reset.component';
import { ResetService } from './reset/reset.service';
import { ResetCompleteComponent } from './reset/reset-complete.component';
import { ApproveLoanComponent } from './approve_loan/approve_loan.component';
import { ApproveLoanService } from './approve_loan/approve_loan.service';
import { RegisterService } from './register/register.service';
import { RegisterComponent } from './register/register.component';
import { LinePayComponent } from './line_pay/line_pay.component';
import { LinePayService } from './line_pay/line_pay.service';
import { HistoryPaymentComponent } from './history_payment/history_payment.component';
import { HistoryPaymentService } from './history_payment/history_payment.service';
import { SettingAlertComponent } from './setting_alert/setting-alert.component';
import { SettingAlertService } from './setting_alert/setting-alert.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    ResetComponent,
    ResetCompleteComponent,
    ApproveLoanComponent,
    RegisterComponent,
    LinePayComponent,
    HistoryPaymentComponent,
    SettingAlertComponent
  ],
  providers: [
    LoginService, ResetService, ApproveLoanService
    , RegisterService, LinePayService, HistoryPaymentService
    , SettingAlertService
  ]
})
export class AccountModule { }
