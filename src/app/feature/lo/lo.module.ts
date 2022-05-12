
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { LoRoutingModule } from '../lo/lo-routing.module';
import { ChartModule } from 'angular2-chartjs';
import { WebcamModule } from 'ngx-webcam';
import { AgmCoreModule } from '@agm/core';

// ---Component---
import { Lomt01Component } from './lomt01/lomt01.component';
import { Lomt02Component } from './lomt02/lomt02.component';
import { Lomt02ModalComponent } from './lomt02/lomt02-modal.component';
import { Lomt03Component } from './lomt03/lomt03.component';
import { Lomt04Component } from './lomt04/lomt04.component';
import { Lomt05Component } from './lomt05/lomt05.component';
import { Lomt06Component } from './lomt06/lomt06.component';
import { Lomt07Component } from './lomt07/lomt07.component';
import { Lomt08Component } from './lomt08/lomt08.component';
import { Lomt09Component } from './lomt09/lomt09.component';
import { Lomt10Component } from './lomt10/lomt10.component';
import { Lomt10ViewComponent } from './lomt10/lomt10-view.component';
import { Lomt11Component } from './lomt11/lomt11.component';
import { Lomt12Component } from './lomt12/lomt12.component';
import { Lomt12ModalComponent } from './lomt12/lomt12-modal.component';
import { Lomt13Component } from './lomt13/lomt13.component';
import { Lomt14Component } from './lomt14/lomt14.component';
import { Lomt15Component } from './lomt15/lomt15.component';
import { Lomt16Component } from './lomt16/lomt16.component';

// ---TS
import { Lots00Component } from './lots00/lots00.component';
import { Lots01Component } from './lots01/lots01.component';
import { Lots01ModalComponent } from './lots01/lots01-modal.component';
import { Lots02Component } from './lots02/lots02.component';
import { Lots03Component } from './lots03/lots03.component';
import { Lots04Component } from './lots04/lots04.component';
import { Lots05Component } from './lots05/lots05.component';
import { Lots06Component } from './lots06/lots06.component';
import { Lots07Component } from './lots07/lots07.component';
import { Lots08Component } from './lots08/lots08.component';
import { Lots09Component } from './lots09/lots09.component';
import { Lots10Component } from './lots10/lots10.component';
import { Lots11Component } from './lots11/lots11.component';
import { Lots12Component } from './lots12/lots12.component';
import { Lots13Component } from './lots13/lots13.component';
import { Lots14Component } from './lots14/lots14.component';
import { Lots15Component } from './lots15/lots15.component';
import { Lots16Component } from './lots16/lots16.component';
import { Lots18Component } from './lots18/lots18.component';
import { Lots19Component } from './lots19/lots19.component';
import { Lots20Component } from './lots20/lots20.component';
import { Lots21Component } from './lots21/lots21.component';
import { Lots22Component } from './lots22/lots22.component';
import { Lots23Component } from './lots23/lots23.component';
import { Lots24Component } from './lots24/lots24.component';
import { Lots24AComponent } from './lots24A/lots24A.component';
import { Lots24BComponent } from './lots24B/lots24B.component';
import { Lots24CComponent } from './lots24C/lots24C.component';
import { Lots25Component } from './lots25/lots25.component';
import { Lots25AComponent } from './lots25A/lots25A.component';
import { Lots25BComponent } from './lots25B/lots25B.component';
import { Lots25CComponent } from './lots25C/lots25C.component';
import { Lots26Component } from './lots26/lots26.component';
import { Lots27Component } from './lots27/lots27.component';
import { Lots28Component } from './lots28/lots28.component';
import { Lots29Component } from './lots29/lots29.component';
import { Lots30Component } from './lots30/lots30.component';

// ---RP
import { Lorp01Component } from './lorp01/lorp01.component';
import { Lorp02Component } from './lorp02/lorp02.component';
import { Lorp03Component } from './lorp03/lorp03.component';
import { Lorp04Component } from './lorp04/lorp04.component';
import { Lorp05Component } from './lorp05/lorp05.component';
import { Lorp06Component } from './lorp06/lorp06.component';
import { Lorp07Component } from './lorp07/lorp07.component';
import { Lorp08Component } from './lorp08/lorp08.component';
import { Lorp09Component } from './lorp09/lorp09.component';
import { Lorp10Component } from './lorp10/lorp10.component';
import { Lorp11Component } from './lorp11/lorp11.component';
import { Lorp12Component } from './lorp12/lorp12.component';
import { Lorp13Component } from './lorp13/lorp13.component';
import { Lorp14Component } from './lorp14/lorp14.component';
import { Lorp15Component } from './lorp15/lorp15.component';
import { Lorp16Component } from './lorp16/lorp16.component';
import { Lorp17Component } from './lorp17/lorp17.component';
import { Lorp18Component } from './lorp18/lorp18.component';
import { Lorp19Component } from './lorp19/lorp19.component';
import { Lorp20Component } from './lorp20/lorp20.component';
import { Lorp21Component } from './lorp21/lorp21.component';
import { Lorp22Component } from './lorp22/lorp22.component';
import { Lorp23Component } from './lorp23/lorp23.component';
import { Lorp25Component } from './lorp25/lorp25.component';
import { Lorp26Component } from './lorp26/lorp26.component';
import { Lorp27Component } from './lorp27/lorp27.component';
import { Lorp28Component } from './lorp28/lorp28.component';
import { Lorp29Component } from './lorp29/lorp29.component';
import { Lorp30Component } from './lorp30/lorp30.component';
import { Lorp31Component } from './lorp31/lorp31.component';
import { Lorp32Component } from './lorp32/lorp32.component';
import { Lorp33Component } from './lorp33/lorp33.component';
import { Lorp34Component } from './lorp34/lorp34.component';
import { Lorp35Component } from './lorp35/lorp35.component';
import { Lorp36Component } from './lorp36/lorp36.component';
import { Lorp37Component } from './lorp37/lorp37.component';
import { Lorp38Component } from './lorp38/lorp38.component';
import { Lorp39Component } from './lorp39/lorp39.component';
import { Lorp40Component } from './lorp40/lorp40.component';
import { Lorp41Component } from './lorp41/lorp41.component';
import { Lorp42Component } from './lorp42/lorp42.component';
import { Lorp43Component } from './lorp43/lorp43.component';
import { Lorp44Component } from './lorp44/lorp44.component';
import { Lorp45Component } from './lorp45/lorp45.component';
import { Lorp47Component } from './lorp47/lorp47.component';
import { Lorp48Component } from './lorp48/lorp48.component';
import { Lorp49Component } from './lorp49/lorp49.component';
import { Lorp50Component } from './lorp50/lorp50.component';

// ---RF
import { Lorf01Component } from './lorf01/lorf01.component';
import { Lorf02Component } from './lorf02/lorf02.component';
import { Lorf03Component } from './lorf03/lorf03.component';
import { Lorf06Component } from './lorf06/lorf06.component';
import { Lorf09Component } from './lorf09/lorf09.component';
import { Lorf11Component } from './lorf11/lorf11.component';

// ---DetailComponent---
import { Lomt01DetailComponent } from './lomt01/lomt01-detail.component';
import { Lomt02DetailComponent } from './lomt02/lomt02-detail.component';
import { Lomt04DetailComponent } from './lomt04/lomt04-detail.component';
import { Lomt05DetailComponent } from './lomt05/lomt05-detail.component';
import { Lomt06DetailComponent } from './lomt06/lomt06-detail.component';
import { Lomt07DetailComponent } from './lomt07/lomt07-detail.component';
import { Lomt08DetailComponent } from './lomt08/lomt08-detail.component';
import { Lomt09DetailComponent } from './lomt09/lomt09-detail.component';
import { Lomt10DetailComponent } from './lomt10/lomt10-detail.component';
import { Lomt10ViewDetailComponent } from './lomt10/lomt10-view-detail.component';
import { Lomt11DetailComponent } from './lomt11/lomt11-detail.component';
import { Lomt12DetailComponent } from './lomt12/lomt12-detail.component';
import { Lomt13DetailComponent } from './lomt13/lomt13-detail.component';
import { Lomt14DetailComponent } from './lomt14/lomt14-detail.component';
import { Lomt15DetailComponent } from './lomt15/lomt15-detail.component';

// ---TS
import { Lots01DetailComponent } from './lots01/lots01-detail.component';
import { Lots02DetailComponent } from './lots02/lots02-detail.component';
import { Lots03DetailComponent } from './lots03/lots03-detail.component';
import { Lots07DetailComponent } from './lots07/lots07-detail.component';
import { Lots08DetailComponent } from './lots08/lots08-detail.component';
import { Lots09DetailComponent } from './lots09/lots09-detail.component';
import { Lots13DetailComponent } from './lots13/lots13-detail.component';
import { Lots14DetailComponent } from './lots14/lots14-detail.component';
import { Lots15DetailComponent } from './lots15/lots15-detail.component';
import { Lots16DetailComponent } from './lots16/lots16-detail.component';
import { Lots17DetailComponent } from './lots17/lots17-detail.component';
import { Lots19DetailComponent } from './lots19/lots19-detail.component';
import { Lots20DetailComponent } from './lots20/lots20-detail.component';
import { Lots20DetailPackageComponent } from './lots20/lots20-detail-package.component';
import { Lots21DetailDocumentComponent } from './lots21/lots21-detail-document.component';
import { Lots21DetailPackageComponent } from './lots21/lots21-detail-package.component';
import { Lots22DetailComponent } from './lots22/lots22-detail.component';
import { Lots23DetailComponent } from './lots23/lots23-detail.component';
import { Lots24DetailComponent } from './lots24/lots24-detail.component';
import { Lots25DetailComponent } from './lots25/lots25-detail.component';
import { Lots26DetailComponent } from './lots26/lots26-detail.component';
import { Lots27DetailComponent } from './lots27/lots27-detail.component';
import { Lots29DetailComponent } from './lots29/lots29-detail.component';
import { Lots30DetailComponent } from './lots30/lots30-detail.component';

// ---Lookup---
import { Lomt01SecuritiesAttributeLookupComponent } from './lomt01/lomt01-securities-attribute-lookup.component';
import { Lorp09LookupComponent } from './lorp09/lorp09-lookup.component';
import { Lorp09LookupCustomerCodeComponent } from './lorp09/lorp09-lookup-customer-code.component';
import { Lorp13LookupComponent } from './lorp13/lorp13-lookup.component';
import { Lorp13LookupCustomerCodeComponent } from './lorp13/lorp13-lookup-customer-code.component';
import { Lorp17LookupCustomerCodeComponent } from './lorp17/lorp17-lookup-customer-code.component';
import { Lorp22LookupCustomerCodeComponent } from './lorp22/lorp22-lookup-customer-code.component';
import { Lots07LookupComponent } from './lots07/lots07-lookup.component';
import { Lots07LookupInvoiceNoComponent } from './lots07/lots07-lookup-invoice-no.component';
import { Lots07LookupDetailComponent } from './lots07/lots07-lookup-detail.component';
import { Lots08ContractLookupComponent } from './lots08/lots08-contract-lookup.component';
import { Lots08InvoiceLookupComponent } from './lots08/lots08-invoice-lookup.component';
import { Lots02LookupComponent } from './lots02/lots02-lookup.component';
import { SecuritiesVerifyDetailPopupComponent } from './lots14/lots14-verify-detail.component';
import { SecuritiesHistoryVerifyDetailPopupComponent } from './lots13/lots13-history-verify-detail.component';
import { Lots09ContractLookupComponent } from './lots09/lots09-contract-lookup.component';
import { Lots09ReceiptLookupComponent } from './lots09/lots09-receipt-lookup.component';
import { Lots15ContractLookupComponent } from './lots15/lots15-contract-lookup.component';
import { Lots15ReceiptLookupComponent } from './lots15/lots15-receipt-lookup.component';
import { Lots16CustomerLookupComponent } from './lots16/lots16-customer-lookup.component';
import { Lorp10LookupLoantypeFromComponent } from './lorp10/lorp10-lookup-loantypefrom.component';
import { Lorp10LookupLoanContractFromComponent } from './lorp10/lorp10-lookup-contractcodefrom.component';
import { Lorp10LookupCostomerCodeFromComponent } from './lorp10/lorp10-lookup-customercodefrom.component';
import { Lorp19LookupLoantypeComponent } from './lorp19/lorp19-lookup-loantypefrom.component';
import { Lorp19LookupCostomerCodeComponent } from './lorp19/lorp19-lookup-customercodefrom.component';
import { Lorp18LookupComponent } from './lorp18/lorp18-lookup.component';
import { Lorp15LookupComponent } from './lorp15/lorp15-lookup.component';
import { Lorp15LookupCustomerCodeComponent } from './lorp15/lorp15-lookup-customercode.component';
import { Lorp16LookupCostomerCodeComponent } from './lorp16/lorp16-lookup-customercodefrom.component';
import { Lorp16LookupLoantypeComponent } from './lorp16/lorp16-lookup-loantypefrom.component';
import { Lorp23LookupLoanContractComponent } from './lorp23/lorp23-lookup-contractcode.component';
import { Lorp25LookupComponent } from './lorp25/lorp25-lookup.component';
import { CustomerLookupComponent } from './lots04/customer-lookup.component';
import { CustomerSecuritiesLookupComponent } from './lots04/customer-securities-lookup.component';
import { Lots03CustomerLookupComponent } from './lots03/customer-lookup.component';
import { MainContractLookupComponent } from './lots04/main-contract-lookup.component';
import { BorrowerLookupComponent } from './lots04/borrower-lookup.component';
import { Lots19ContractLookupComponent } from './lots19/lots19-contract-lookup.component';
import { Lots20ContractLookupComponent } from './lots20/lots20-contract-lookup.component';
import { Lots21ContractLookupComponent } from './lots21/lots21-contract-lookup.component';
import { Lorp34LookupCustomerCodeComponent } from './lorp34/lorp34-lookup-customer-code.component';
import { Lorp34LookupComponent } from './lorp34/lorp34-lookup.component';
import { Lots22BorrowerLookupComponent } from './lots22/lots22-borrower-lookup.component';
import { Lots23BorrowerLookupComponent } from './lots23/lots23-borrower-lookup.component';
import { Lots24CustomerLookupComponent } from './lots24/customer-lookup.component';
import { Borrower24LookupComponent } from './lots24/borrower-lookup.component';
import { Lots24MainContractLookupComponent } from './lots24/main-contract-lookup.component';
import { Lots24ACustomerLookupComponent } from './lots24A/customer-lookup.component';
import { Borrower24ALookupComponent } from './lots24A/borrower-lookup.component';
import { Lots24AMainContractLookupComponent } from './lots24A/main-contract-lookup.component';
import { Lots24BCustomerLookupComponent } from './lots24B/customer-lookup.component';
import { Borrower24BLookupComponent } from './lots24B/borrower-lookup.component';
import { Lots24BMainContractLookupComponent } from './lots24B/main-contract-lookup.component';
import { Lots24CCustomerLookupComponent } from './lots24C/customer-lookup.component';
import { Borrower24CLookupComponent } from './lots24C/borrower-lookup.component';
import { Lots24CMainContractLookupComponent } from './lots24C/main-contract-lookup.component';
import { Lots25CustomerLookupComponent } from './lots25/customer-lookup.component';
import { Borrower25LookupComponent } from './lots25/borrower-lookup.component';
import { Lots25MainContractLookupComponent } from './lots25/main-contract-lookup.component';
import { Lots01BorrowerLookupComponent } from './lots01/lots01-borrower-lookup.component';
import { Lots25ACustomerLookupComponent } from './lots25A/customer-lookup.component';
import { Borrower25ALookupComponent } from './lots25A/borrower-lookup.component';
import { Lots25AMainContractLookupComponent } from './lots25A/main-contract-lookup.component';
import { Lots25BCustomerLookupComponent } from './lots25B/customer-lookup.component';
import { Borrower25BLookupComponent } from './lots25B/borrower-lookup.component';
import { Lots25BMainContractLookupComponent } from './lots25B/main-contract-lookup.component';
import { Lots25CCustomerLookupComponent } from './lots25C/customer-lookup.component';
import { Borrower25CLookupComponent } from './lots25C/borrower-lookup.component';
import { Lots25CMainContractLookupComponent } from './lots25C/main-contract-lookup.component';

// ---Service---
import { Lomt01Service } from './lomt01/lomt01.service';
import { Lomt02Service } from './lomt02/lomt02.service';
import { Lomt03Service } from './lomt03/lomt03.service';
import { Lomt04Service } from './lomt04/lomt04.service';
import { Lomt05Service } from './lomt05/lomt05.service';
import { Lomt06Service } from './lomt06/lomt06.service';
import { Lomt07Service } from './lomt07/lomt07.service';
import { Lomt08Service } from './lomt08/lomt08.service';
import { Lomt09Service } from './lomt09/lomt09.service';
import { Lomt10Service } from './lomt10/lomt10.service';
import { Lomt11Service } from './lomt11/lomt11.service';
import { Lomt12Service } from './lomt12/lomt12.service';
import { Lomt13Service } from './lomt13/lomt13.service';
import { Lomt14Service } from './lomt14/lomt14.service';
import { Lomt15Service } from './lomt15/lomt15.service';
import { Lomt16Service } from './lomt16/lomt16.service';

// ---TS
import { Lots00Service } from './lots00/lots00.service';
import { Lots01Service } from './lots01/lots01.service';
import { Lots02Service } from './lots02/lots02.service';
import { Lots03Service } from './lots03/lots03.service';
import { Lots04Service } from './lots04/lots04.service';
import { Lots05Service } from './lots05/lots05.service';
import { Lots06Service } from './lots06/lots06.service';
import { Lots07Service } from './lots07/lots07.service';
import { Lots08Service } from './lots08/lots08.service';
import { Lots09Service } from './lots09/lots09.service';
import { Lots10Service } from './lots10/lots10.service';
import { Lots11Service } from './lots11/lots11.service';
import { Lots12Service } from './lots12/lots12.service';
import { Lots13Service } from './lots13/lots13.service';
import { Lots14Service } from './lots14/lots14.service';
import { Lots15Service } from './lots15/lots15.service';
import { Lots16Service } from './lots16/lots16.service';
import { Lots17Service } from './lots17/lots17.service';
import { Lots18Service } from './lots18/lots18.service';
import { Lots19Service } from './lots19/lots19.service';
import { Lots20Service } from './lots20/lots20.service';
import { Lots21Service } from './lots21/lots21.service';
import { Lots22Service } from './lots22/lots22.service';
import { Lots23Service } from './lots23/lots23.service';
import { Lots24Service } from './lots24/lots24.service';
import { Lots24AService } from './lots24A/lots24A.service';
import { Lots24BService } from './lots24B/lots24B.service';
import { Lots24CService } from './lots24C/lots24C.service';
import { Lots25Service } from './lots25/lots25.service';
import { Lots25AService } from './lots25A/lots25A.service';
import { Lots25BService } from './lots25B/lots25B.service';
import { Lots25CService } from './lots25C/lots25C.service';
import { Lots26Service } from './lots26/lots26.service';
import { Lots27Service } from './lots27/lots27.service';
import { Lots28Service } from './lots28/lots28.service';
import { Lots29Service } from './lots29/lots29.service';
import { Lots30Service } from './lots30/lots30.service';

// ---RP
import { Lorp01Service } from './lorp01/lorp01.service';
import { Lorp02Service } from './lorp02/lorp02.service';
import { Lorp03Service } from './lorp03/lorp03.service';
import { Lorp04Service } from './lorp04/lorp04.service';
import { Lorp05Service } from './lorp05/lorp05.service';
import { Lorp06Service } from './lorp06/lorp06.service';
import { Lorp07Service } from './lorp07/lorp07.service';
import { Lorp08Service } from './lorp08/lorp08.service';
import { Lorp09Service } from './lorp09/lorp09.service';
import { Lorp10Service } from './lorp10/lorp10.service';
import { Lorp11Service } from './lorp11/lorp11.service';
import { Lorp12Service } from './lorp12/lorp12.service';
import { Lorp13Service } from './lorp13/lorp13.service';
import { Lorp14Service } from './lorp14/lorp14.service';
import { Lorp15Service } from './lorp15/lorp15.service';
import { Lorp16Service } from './lorp16/lorp16.service';
import { Lorp17Service } from './lorp17/lorp17.service';
import { Lorp18Service } from './lorp18/lorp18.service';
import { Lorp19Service } from './lorp19/lorp19.service';
import { Lorp20Service } from './lorp20/lorp20.service';
import { Lorp21Service } from './lorp21/lorp21.service';
import { Lorp22Service } from './lorp22/lorp22.service';
import { Lorp23Service } from './lorp23/lorp23.service';
import { Lorp25Service } from './lorp25/lorp25.service';
import { Lorp26Service } from './lorp26/lorp26.service';
import { Lorp27Service } from './lorp27/lorp27.service';
import { Lorp28Service } from './lorp28/lorp28.service';
import { Lorp29Service } from './lorp29/lorp29.service';
import { Lorp30Service } from './lorp30/lorp30.service';
import { Lorp31Service } from './lorp31/lorp31.service';
import { Lorp32Service } from './lorp32/lorp32.service';
import { Lorp33Service } from './lorp33/lorp33.service';
import { Lorp34Service } from './lorp34/lorp34.service';
import { Lorp35Service } from './lorp35/lorp35.service';
import { Lorp36Service } from './lorp36/lorp36.service';
import { Lorp37Service } from './lorp37/lorp37.service';
import { Lorp38Service } from './lorp38/lorp38.service';
import { Lorp39Service } from './lorp39/lorp39.service';
import { Lorp40Service } from './lorp40/lorp40.service';
import { Lorp41Service } from './lorp41/lorp41.service';
import { Lorp42Service } from './lorp42/lorp42.service';
import { Lorp43Service } from './lorp43/lorp43.service';
import { Lorp44Service } from './lorp44/lorp44.service';
import { Lorp45Service } from './lorp45/lorp45.service';
import { Lorp47Service } from './lorp47/lorp47.service';
import { Lorp48Service } from './lorp48/lorp48.service';
import { Lorp49Service } from './lorp49/lorp49.service';
import { Lorp50Service } from './lorp50/lorp50.service';

// ---RF
import { Lorf01Service } from './lorf01/lorf01.service';
import { Lorf02Service } from './lorf02/lorf02.service';
import { Lorf03Service } from './lorf03/lorf03.service';
import { Lorf06Service } from './lorf06/lorf06.service';
import { Lorf09Service } from './lorf09/lorf09.service';
import { Lorf11Service } from './lorf11/lorf11.service';
import { Lots18ContractLookupComponent } from './lots18/lots18-contract-lookup.component';
import { Lots18CustomerLookupComponent } from './lots18/lots18-customer-lookup.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoRoutingModule,
    SharedModule,
    TranslateModule,
    ChartModule,
    WebcamModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBrPDcGALMcZsq7tKos1lj_JbsnVqqROik',
      libraries: ['places']
    })
  ],
  declarations: [
    // ---MT
    Lomt01Component, Lomt01DetailComponent, Lomt01SecuritiesAttributeLookupComponent,
    Lomt02Component, Lomt02DetailComponent, Lomt02ModalComponent,
    Lomt03Component,
    Lomt04Component, Lomt04DetailComponent,
    Lomt05Component, Lomt05DetailComponent,
    Lomt06Component, Lomt06DetailComponent,
    Lomt07Component, Lomt07DetailComponent,
    Lomt08Component, Lomt08DetailComponent,
    Lomt09Component, Lomt09DetailComponent,
    Lomt10Component, Lomt10DetailComponent,
    Lomt10ViewComponent, Lomt10ViewDetailComponent,
    Lomt11Component, Lomt11DetailComponent,
    Lomt12Component, Lomt12DetailComponent, Lomt12ModalComponent,
    Lomt13Component, Lomt13DetailComponent,
    Lomt14Component, Lomt14DetailComponent,
    Lomt15Component, Lomt15DetailComponent,
    Lomt16Component,

    // ---TS
    Lots00Component,
    Lots01Component, Lots01DetailComponent, Lots01ModalComponent, Lots01BorrowerLookupComponent,
    Lots02Component, Lots02DetailComponent, Lots02LookupComponent,
    Lots03Component, Lots03DetailComponent, Lots03CustomerLookupComponent,
    Lots04Component, CustomerLookupComponent, CustomerSecuritiesLookupComponent, MainContractLookupComponent, BorrowerLookupComponent,
    Lots05Component,
    Lots06Component,
    Lots07Component, Lots07DetailComponent, Lots07LookupComponent, Lots07LookupInvoiceNoComponent, Lots07LookupDetailComponent,
    Lots08Component, Lots08DetailComponent, Lots08ContractLookupComponent, Lots08InvoiceLookupComponent,
    Lots09Component, Lots09DetailComponent, Lots09ContractLookupComponent, Lots09ReceiptLookupComponent,
    Lots10Component,
    Lots11Component,
    Lots12Component,
    Lots13Component, Lots13DetailComponent, SecuritiesHistoryVerifyDetailPopupComponent,
    Lots14Component, Lots14DetailComponent, SecuritiesVerifyDetailPopupComponent,
    Lots15Component, Lots15DetailComponent, Lots15ContractLookupComponent, Lots15ReceiptLookupComponent,
    Lots16Component, Lots16DetailComponent, Lots16CustomerLookupComponent,
    Lots17DetailComponent,
    Lots18Component, Lots18ContractLookupComponent, Lots18CustomerLookupComponent,
    Lots19Component, Lots19DetailComponent, Lots19ContractLookupComponent,
    Lots20Component, Lots20DetailComponent, Lots20DetailPackageComponent, Lots20ContractLookupComponent,
    Lots21Component, Lots21DetailDocumentComponent, Lots21DetailPackageComponent, Lots21ContractLookupComponent,
    Lots22Component, Lots22DetailComponent, Lots22BorrowerLookupComponent,
    Lots23Component, Lots23DetailComponent, Lots23BorrowerLookupComponent,
    Lots24Component, Lots24DetailComponent, Lots24CustomerLookupComponent, Borrower24LookupComponent, Lots24MainContractLookupComponent,
    Lots24AComponent, Lots24ACustomerLookupComponent, Borrower24ALookupComponent, Lots24AMainContractLookupComponent,
    Lots24BComponent, Lots24BCustomerLookupComponent, Borrower24BLookupComponent, Lots24BMainContractLookupComponent,
    Lots24CComponent, Lots24CCustomerLookupComponent, Borrower24CLookupComponent, Lots24CMainContractLookupComponent,
    Lots25Component, Lots25DetailComponent, Lots25CustomerLookupComponent, Borrower25LookupComponent, Lots25MainContractLookupComponent,
    Lots25AComponent, Lots25ACustomerLookupComponent, Borrower25ALookupComponent, Lots25AMainContractLookupComponent,
    Lots25BComponent, Lots25BCustomerLookupComponent, Borrower25BLookupComponent, Lots25BMainContractLookupComponent,
    Lots25CComponent, Lots25CCustomerLookupComponent, Borrower25CLookupComponent, Lots25CMainContractLookupComponent,
    Lots26Component, Lots26DetailComponent,
    Lots27Component, Lots27DetailComponent,
    Lots28Component,
    Lots29Component, Lots29DetailComponent,
    Lots30Component, Lots30DetailComponent,

    // ---RP
    Lorp01Component,
    Lorp02Component,
    Lorp03Component,
    Lorp04Component,
    Lorp05Component,
    Lorp06Component,
    Lorp07Component,
    Lorp08Component,
    Lorp09Component, Lorp09LookupComponent, Lorp09LookupCustomerCodeComponent,
    Lorp10Component, Lorp10LookupLoantypeFromComponent, Lorp10LookupLoanContractFromComponent, Lorp10LookupCostomerCodeFromComponent,
    Lorp11Component,
    Lorp12Component,
    Lorp13Component, Lorp13LookupComponent, Lorp13LookupCustomerCodeComponent,
    Lorp14Component,
    Lorp15Component, Lorp15LookupComponent, Lorp15LookupCustomerCodeComponent,
    Lorp16Component, Lorp16LookupCostomerCodeComponent, Lorp16LookupLoantypeComponent,
    Lorp17Component, Lorp17LookupCustomerCodeComponent,
    Lorp18Component, Lorp18LookupComponent,
    Lorp19Component, Lorp19LookupLoantypeComponent, Lorp19LookupCostomerCodeComponent,
    Lorp20Component,
    Lorp21Component,
    Lorp22Component, Lorp22LookupCustomerCodeComponent,
    Lorp23Component, Lorp23LookupLoanContractComponent,
    Lorp25Component, Lorp25LookupComponent,
    Lorp26Component,
    Lorp27Component,
    Lorp28Component,
    Lorp29Component,
    Lorp30Component,
    Lorp31Component,
    Lorp32Component,
    Lorp33Component,
    Lorp34Component, Lorp34LookupComponent, Lorp34LookupCustomerCodeComponent,
    Lorp35Component,
    Lorp36Component,
    Lorp37Component,
    Lorp38Component,
    Lorp39Component,
    Lorp40Component,
    Lorp41Component,
    Lorp42Component,
    Lorp43Component,
    Lorp44Component,
    Lorp45Component,
    Lorp47Component,
    Lorp48Component,
    Lorp49Component,
    Lorp50Component,

    // RF
    Lorf01Component,
    Lorf02Component,
    Lorf03Component,
    Lorf06Component,
    Lorf09Component,
    Lorf11Component,
  ],
  entryComponents: [
    Lomt01SecuritiesAttributeLookupComponent,
    Lomt02ModalComponent,
    Lomt12ModalComponent,
    Lorp09LookupComponent,
    Lorp09LookupCustomerCodeComponent,
    Lorp13LookupComponent,
    Lorp13LookupCustomerCodeComponent,
    Lorp15LookupComponent,
    Lorp15LookupCustomerCodeComponent,
    Lorp17LookupCustomerCodeComponent,
    Lorp22LookupCustomerCodeComponent,
    Lots01ModalComponent,
    Lots07LookupComponent,
    Lots07LookupInvoiceNoComponent,
    Lots07LookupDetailComponent,
    Lots08ContractLookupComponent,
    Lots08InvoiceLookupComponent,
    Lorp10LookupLoantypeFromComponent,
    Lorp10LookupLoanContractFromComponent,
    Lorp10LookupCostomerCodeFromComponent,
    Lorp16LookupCostomerCodeComponent,
    Lorp16LookupLoantypeComponent,
    Lorp19LookupLoantypeComponent,
    Lorp19LookupCostomerCodeComponent,
    Lorp23LookupLoanContractComponent,
    CustomerLookupComponent,
    CustomerSecuritiesLookupComponent,
    Lots03CustomerLookupComponent,
    Lots19ContractLookupComponent,
    Lots20ContractLookupComponent,
    Lots21ContractLookupComponent,
    Lots22BorrowerLookupComponent,
    Lots23BorrowerLookupComponent,
    Lots24CustomerLookupComponent,
    Borrower24LookupComponent,
    Lots24MainContractLookupComponent,
    Lots24ACustomerLookupComponent,
    Borrower24ALookupComponent,
    Lots24AMainContractLookupComponent,
    Lots24BCustomerLookupComponent,
    Borrower24BLookupComponent,
    Lots24BMainContractLookupComponent,
    Lots24CCustomerLookupComponent,
    Borrower24CLookupComponent,
    Lots24CMainContractLookupComponent,
    Lots25CustomerLookupComponent,
    Lots25MainContractLookupComponent,
    Borrower25LookupComponent,
    Lots25ACustomerLookupComponent,
    Lots25AMainContractLookupComponent,
    Borrower25ALookupComponent,
    Lots25BCustomerLookupComponent,
    Lots25BMainContractLookupComponent,
    Borrower25BLookupComponent,
    Lots25CCustomerLookupComponent,
    Lots25CMainContractLookupComponent,
    Borrower25CLookupComponent,
    Lots25CCustomerLookupComponent,
    Lots25CMainContractLookupComponent,
    Borrower25CLookupComponent,
    MainContractLookupComponent,
    Lots02LookupComponent,
    SecuritiesVerifyDetailPopupComponent,
    SecuritiesHistoryVerifyDetailPopupComponent,
    Lots09ContractLookupComponent,
    Lots09ReceiptLookupComponent,
    Lots15ContractLookupComponent,
    Lots15ReceiptLookupComponent,
    Lots16CustomerLookupComponent,
    Lorp18LookupComponent,
    Lorp25LookupComponent,
    Lots18ContractLookupComponent,
    Lorp25LookupComponent,
    Lots18CustomerLookupComponent,
    BorrowerLookupComponent,
    Lorp34LookupComponent,
    Lorp34LookupCustomerCodeComponent,
    Lots01BorrowerLookupComponent
  ],
  providers: [
    // ---MT
    Lomt01Service,
    Lomt02Service,
    Lomt03Service,
    Lomt04Service,
    Lomt05Service,
    Lomt06Service,
    Lomt07Service,
    Lomt08Service,
    Lomt09Service,
    Lomt10Service,
    Lomt11Service,
    Lomt12Service,
    Lomt13Service,
    Lomt14Service,
    Lomt15Service,
    Lomt16Service,

    // ---TS
    Lots00Service,
    Lots01Service,
    Lots02Service,
    Lots03Service,
    Lots04Service,
    Lots05Service,
    Lots06Service,
    Lots07Service,
    Lots08Service,
    Lots09Service,
    Lots10Service,
    Lots11Service,
    Lots12Service,
    Lots13Service,
    Lots14Service,
    Lots15Service,
    Lots16Service,
    Lots17Service,
    Lots18Service,
    Lots19Service,
    Lots20Service,
    Lots21Service,
    Lots22Service,
    Lots23Service,
    Lots24Service,
    Lots24AService,
    Lots24BService,
    Lots24CService,
    Lots25Service,
    Lots25AService,
    Lots25BService,
    Lots25CService,
    Lots26Service,
    Lots27Service,
    Lots28Service,
    Lots29Service,
    Lots30Service,

    // ---RP
    Lorp01Service,
    Lorp02Service,
    Lorp03Service,
    Lorp04Service,
    Lorp05Service,
    Lorp06Service,
    Lorp07Service,
    Lorp08Service,
    Lorp09Service,
    Lorp10Service,
    Lorp11Service,
    Lorp12Service,
    Lorp13Service,
    Lorp14Service,
    Lorp15Service,
    Lorp16Service,
    Lorp17Service,
    Lorp18Service,
    Lorp19Service,
    Lorp20Service,
    Lorp21Service,
    Lorp22Service,
    Lorp23Service,
    Lorp25Service,
    Lorp26Service,
    Lorp27Service,
    Lorp28Service,
    Lorp29Service,
    Lorp30Service,
    Lorp31Service,
    Lorp33Service,
    Lorp34Service,
    Lorp35Service,
    Lorp36Service,
    Lorp37Service,
    Lorp38Service,
    Lorp39Service,
    Lorp40Service,
    Lorp41Service,
    Lorp42Service,
    Lorp43Service,
    Lorp44Service,
    Lorp45Service,
    Lorp47Service,
    Lorp48Service,
    Lorp49Service,
    Lorp50Service,

    // ---RF
    Lorf01Service,
    Lorf02Service,
    Lorf03Service,
    Lorf06Service,
    Lorf09Service,
    Lorf11Service,
    Lorp32Service,
  ]
})
export class LoModule { }
