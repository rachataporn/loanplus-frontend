import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core';

// ---Component---
import { Lomt01Component } from './lomt01/lomt01.component';
import { Lomt02Component } from './lomt02/lomt02.component';
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
import { Lomt13Component } from './lomt13/lomt13.component';
import { Lomt14Component } from './lomt14/lomt14.component';
import { Lomt15Component } from './lomt15/lomt15.component';
import { Lomt16Component } from './lomt16/lomt16.component';

// ---TS
import { Lots00Component } from './lots00/lots00.component';
import { Lots01Component } from './lots01/lots01.component';
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

// RF
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
import { Lomt07DetailComponent } from './lomt07/lomt07-detail.component';
import { Lomt06DetailComponent } from './lomt06/lomt06-detail.component';
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

// ---Resolve---
// ---TS
import { Lots01Resolver } from './lots01/lots01-resolver.service';
import { Lots02Resolver } from './lots02/lots02-resolver.service';
import { Lots05Resolver } from './lots05/lots05-resolver.service';
import { Lots06Resolver } from './lots06/lots06-resolver.service';
import { Lots07Resolver } from './lots07/lots07-resolver.service';
import { Lots08Resolver } from './lots08/lots08-resolver.service';
import { Lots09Resolver } from './lots09/lots09-resolver.service';
import { Lots10Resolver } from './lots10/lots10-resolver.service';
import { Lots11Resolver } from './lots11/lots11-resolver.service';
import { Lots13Resolver } from './lots13/lots13-resolver.service';
import { Lots14Resolver } from './lots14/lots14-resolver.service';
import { Lots15Resolver } from './lots15/lots15-resolver.service';
import { Lots16Resolver } from './lots16/lots16-resolver.service';
import { Lots17Resolver } from './lots17/lots17-resolver.service';
import { Lots18Resolver } from './lots18/lots18-resolver.service';
import { Lots19Resolver } from './lots19/lots19-resolver.service';
import { Lots20Resolver } from './lots20/lots20-resolver.service';
import { Lots21Resolver } from './lots21/lots21-resolver.service';
import { Lots22Resolver } from './lots22/lots22-resolver.service';
import { Lots23Resolver } from './lots23/lots23-resolver.service';
import { Lots24Resolver } from './lots24/lots24-resolver.service';
import { Lots24AResolver } from './lots24A/lots24A-resolver.service';
import { Lots24BResolver } from './lots24B/lots24B-resolver.service';
import { Lots24CResolver } from './lots24C/lots24C-resolver.service';
import { Lots25Resolver } from './lots25/lots25-resolver.service';
import { Lots25AResolver } from './lots25A/lots25A-resolver.service';
import { Lots25BResolver } from './lots25B/lots25B-resolver.service';
import { Lots25CResolver } from './lots25C/lots25C-resolver.service';
import { Lots26Resolver } from './lots26/lots26-resolver.service';
import { Lots27Resolver } from './lots27/lots27-resolver.service';
import { Lots28Resolver } from './lots28/lots28-resolver.service';
import { Lots29Resolver } from './lots29/lots29-resolver.service';
import { Lots30Resolver } from './lots30/lots30-resolver.service';

// ---MT
import { Lomt01Resolver } from './lomt01/lomt01-resolver.service';
import { Lomt02Resolver } from './lomt02/lomt02-resolver.service';
import { Lomt03Resolver } from './lomt03/lomt03-resolver.service';
import { Lomt04Resolver } from './lomt04/lomt04-resolver.service';
import { Lomt05Resolver } from './lomt05/lomt05-resolver.service';
import { Lomt06Resolver } from './lomt06/lomt06-resolver.service';
import { Lomt07Resolver } from './lomt07/lomt07-resolver.service';
import { Lomt08Resolver } from './lomt08/lomt08-resolver.service';
import { Lots04Resolver } from './lots04/lots04-resolver.service';
import { Lots03Resolver } from './lots03/lots03-resolver.service';
import { Lomt09Resolver } from './lomt09/lomt09-resolver.service';
import { Lomt10Resolver } from './lomt10/lomt10-resolver.service';
import { Lomt11Resolver } from './lomt11/lomt11-resolver.service';
import { Lomt12Resolver } from './lomt12/lomt12-resolver.service';
import { Lomt13Resolver } from './lomt13/lomt13-resolver.service';
import { Lomt14Resolver } from './lomt14/lomt14-resolver.service';
import { Lomt15Resolver } from './lomt15/lomt15-resolver.service';
import { Lomt16Resolver } from './lomt16/lomt16.resolver.service';

// ---RP
import { Lorp01Resolver } from './lorp01/lorp01-resolver.service';
import { Lorp02Resolver } from './lorp02/lorp02-resolver.service';
import { Lorp03Resolver } from './lorp03/lorp03-resolver.service';
import { Lorp04Resolver } from './lorp04/lorp04-resolver.service';
import { Lorp05Resolver } from './lorp05/lorp05-resolver.service';
import { Lorp06Resolver } from './lorp06/lorp06-resolver.service';
import { Lorp07Resolver } from './lorp07/lorp07-resolver.service';
import { Lorp08Resolver } from './lorp08/lorp08-resolver.service';
import { Lorp09Resolver } from './lorp09/lorp09-resolver.service';
import { Lorp10Resolver } from './lorp10/lorp10-resolver.service';
import { Lorp11Resolver } from './lorp11/lorp11-resolver.service';
import { Lorp12Resolver } from './lorp12/lorp12-resolver.service';
import { Lorp13Resolver } from './lorp13/lorp13-resolver.service';
import { Lorp15Resolver } from './lorp15/lorp15-resolver.service';
import { Lorp16Resolver } from './lorp16/lorp16-resolver.service';
import { Lorp17Resolver } from './lorp17/lorp17-resolver.service';
import { Lorp18Resolver } from './lorp18/lorp18-resolver.service';
import { Lorp19Resolver } from './lorp19/lorp19-resolver.service';
import { Lorp20Resolver } from './lorp20/lorp20-resolver.service';
import { Lorp21Resolver } from './lorp21/lorp21-resolver.service';
import { Lorp22Resolver } from './lorp22/lorp22-resolver.service';
import { Lorp23Resolver } from './lorp23/lorp23-resolver.service';
import { Lorp25Resolver } from './lorp25/lorp25-resolver.service';
import { Lorp26Resolver } from './lorp26/lorp26-resolver.service';
import { Lorp27Resolver } from './lorp27/lorp27-resolver.service';
import { Lorp28Resolver } from './lorp28/lorp28-resolver.service';
import { Lorp29Resolver } from './lorp29/lorp29-resolver.service';
import { Lorp30Resolver } from './lorp30/lorp30-resolver.service';
import { Lorp31Resolver } from './lorp31/lorp31-resolver.service';
import { Lorp32Resolver } from './lorp32/lorp32-resolver.service';
import { Lorp33Resolver } from './lorp33/lorp33-resolver.service';
import { Lorp34Resolver } from './lorp34/lorp34-resolver.service';
import { Lorp35Resolver } from './lorp35/lorp35-resolver.service';
import { Lorp36Resolver } from './lorp36/lorp36-resolver.service';
import { Lorp37Resolver } from './lorp37/lorp37-resolver.service';
import { Lorp38Resolver } from './lorp38/lorp38-resolver.service';
import { Lorp39Resolver } from './lorp39/lorp39-resolver.service';
import { Lorp40Resolver } from './lorp40/lorp40-resolver.service';
import { Lorp41Resolver } from './lorp41/lorp41-resolver.service';
import { Lorp42Resolver } from './lorp42/lorp42-resolver.service';
import { Lorp43Resolver } from './lorp43/lorp43-resolver.service';
import { Lorp44Resolver } from './lorp44/lorp44-resolver.service';
import { Lorp45Resolver } from './lorp45/lorp45-resolver.service';
import { Lorp47Resolver } from './lorp47/lorp47-resolver.service';
import { Lorp48Resolver } from './lorp48/lorp48-resolver.service';
import { Lorp49Resolver } from './lorp49/lorp49-resolver.service';
import { Lorp50Resolver } from './lorp50/lorp50-resolver.service';

// ---RF
import { Lorf01Resolver } from './lorf01/lorf01-resolver.service';
import { Lorf02Resolver } from './lorf02/lorf02-resolver.service';
import { Lorf03Resolver } from './lorf03/lorf03-resolver.service';
import { Lorf06Resolver } from './lorf06/lorf06-resolver.service';
import { Lorf09Resolver } from './lorf09/lorf09-resolver.service';
import { Lorf11Resolver } from './lorf11/lorf11-resolver.service';

const routes: Routes = [
    {
        path: '',
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'Lots00', pathMatch: 'full',
            }, {
                path: 'lomt01',
                component: Lomt01Component,
                data: {
                    code: 'LOMT01'
                },
                resolve: {
                    secureCategory: Lomt01Resolver
                }
            }, {
                path: 'lomt01/detail',
                component: Lomt01DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT01'
                },
                resolve: {
                    secureCategory: Lomt01Resolver
                }
            }, {
                path: 'lomt02',
                component: Lomt02Component,
                data: {
                    code: 'LOMT02'
                }
            }, {
                path: 'lomt02/detail',
                component: Lomt02DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT02'
                },
                resolve: {
                    attribute: Lomt02Resolver
                }
            }, {
                path: 'lomt03',
                component: Lomt03Component,
                data: {
                    code: 'LOMT03'
                },
                resolve: {
                    attribute: Lomt03Resolver
                }
            }, {
                path: 'lomt04',
                component: Lomt04Component,
                data: {
                    code: 'LOMT04'
                }
            }, {
                path: 'lomt04/detail',
                component: Lomt04DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT04'
                },
                resolve: {
                    lomt04: Lomt04Resolver
                }
            }, {
                path: 'lomt05',
                component: Lomt05Component,
                data: {
                    code: 'LOMT05'
                },
                resolve: {
                    lomt05: Lomt05Resolver
                }
            }, {
                path: 'lomt05/detail',
                component: Lomt05DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT05'
                },
                resolve: {
                    lomt05: Lomt05Resolver
                }
            }, {
                path: 'lomt06',
                component: Lomt06Component,
                data: {
                    code: 'LOMT06'
                },
                resolve: {
                    lomt06: Lomt06Resolver
                }
            }, {
                path: 'lomt06/detail',
                component: Lomt06DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT06'
                },
                resolve: {
                    lomt06: Lomt06Resolver
                }
            }, {
                path: 'lomt07',
                component: Lomt07Component,
                data: {
                    code: 'LOMT07'
                }
            }, {
                path: 'lomt07/detail',
                component: Lomt07DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT07'
                },
                resolve: {
                    lomt07: Lomt07Resolver
                }
            }, {
                path: 'lomt08',
                component: Lomt08Component,
                data: {
                    code: 'LOMT08'
                },
                resolve: {
                    lomt08: Lomt08Resolver
                }
            }, {
                path: 'lomt08/detail',
                component: Lomt08DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT08'
                },
                resolve: {
                    lomt08: Lomt08Resolver
                }
            }, {
                path: 'lots00',
                component: Lots00Component,
                data: {
                    code: 'LOTS00'
                }
            }, {
                path: 'lots01',
                component: Lots01Component,
                data: {
                    code: 'LOTS01'
                }
            }, {
                path: 'lots01/detail',
                component: Lots01DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS01'
                },
                resolve: {
                    attribute: Lots01Resolver
                }
            }, {
                path: 'lots02',
                component: Lots02Component,
                data: {
                    code: 'LOTS02'
                },
                resolve: {
                    requestLoan: Lots02Resolver
                }
            }, {
                path: 'lots02/detail',
                component: Lots02DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS02'
                },
                resolve: {
                    requestLoan: Lots02Resolver
                }
            }, {
                path: 'lots03',
                component: Lots03Component,
                data: {
                    code: 'LOTS03'
                },
                resolve: {
                    lots03: Lots03Resolver
                }
            }, {
                path: 'lots03/detail',
                component: Lots03DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS03'
                },
                resolve: {
                    lots03: Lots03Resolver
                }
            }, {
                path: 'lots04',
                component: Lots04Component,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS04'
                },
                resolve: {
                    contract: Lots04Resolver
                }
            }, {
                path: 'lots05',
                component: Lots05Component,
                data: {
                    code: 'LOTS05'
                },
                resolve: {
                    lots05: Lots05Resolver
                }
            }, {
                path: 'lots06',
                component: Lots06Component,
                data: {
                    code: 'LOTS06'
                },
                resolve: {
                    lots06: Lots06Resolver
                }
            }
            , {
                path: 'lots07',
                component: Lots07Component,
                data: {
                    code: 'LOTS07'
                },
                resolve: {
                    route: Lots07Resolver
                }
            }, {
                path: 'lots07/detail',
                component: Lots07DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS07'
                },
                resolve: {
                    route: Lots07Resolver
                }
            }, {
                path: 'lots08',
                component: Lots08Component,
                data: {
                    code: 'LOTS08'
                },
                resolve: {
                    payment: Lots08Resolver
                }
            }, {
                path: 'lots08/detail',
                component: Lots08DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS08'
                },
                resolve: {
                    payment: Lots08Resolver
                }
            }, {
                path: 'lots09',
                component: Lots09Component,
                data: {
                    code: 'LOTS09'
                },
                resolve: {
                    receiptDetail: Lots09Resolver
                }
            }, {
                path: 'lots09/detail',
                component: Lots09DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS09'
                },
                resolve: {
                    receiptDetail: Lots09Resolver
                }
            }, {
                path: 'lots10',
                component: Lots10Component,
                data: {
                    code: 'LOTS10'
                },
                resolve: {
                    refinance: Lots10Resolver
                }
            }, {
                path: 'lots11',
                component: Lots11Component,
                data: {
                    code: 'LOTS11'
                },
                resolve: {
                    close: Lots11Resolver
                }
            }, {
                path: 'lots12',
                component: Lots12Component,
                data: {
                    code: 'LOTS12'
                }
            }, {
                path: 'lots13',
                component: Lots13Component,
                data: {
                    code: 'LOTS13'
                },
                resolve: {
                    requestSecure: Lots13Resolver
                }
            }, {
                path: 'lots13/detail',
                component: Lots13DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS13'
                },
                resolve: {
                    requestSecure: Lots13Resolver
                }
            }, {
                path: 'lots14',
                component: Lots14Component,
                data: {
                    code: 'LOTS14'
                },
                resolve: {
                    requestSecureVerify: Lots14Resolver
                }
            }, {
                path: 'lots14/detail',
                component: Lots14DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS14'
                },
                resolve: {
                    requestSecureVerify: Lots14Resolver
                }
            },
            {
                path: 'lots24',
                component: Lots24Component,
                data: {
                    code: 'LOTS24'
                },
                resolve: {
                    lots24: Lots24Resolver
                }
            },
            {
                path: 'lots24/detail',
                component: Lots24DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS24'
                },
                resolve: {
                    lots24: Lots24Resolver
                }
            }, {
                path: 'lots24A',
                component: Lots24AComponent,
                data: {
                    code: 'LOTS24A'
                },
                resolve: {
                    lots24A: Lots24AResolver
                }
            }, {
                path: 'lots24B',
                component: Lots24BComponent,
                data: {
                    code: 'LOTS24B'
                },
                resolve: {
                    lots24B: Lots24BResolver
                }
            }, {
                path: 'lots24C',
                component: Lots24CComponent,
                data: {
                    code: 'LOTS24C'
                },
                resolve: {
                    lots24C: Lots24CResolver
                }
            }, {
                path: 'lorp01',
                component: Lorp01Component,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LORP01'
                },
                resolve: {
                    loandetails: Lorp01Resolver
                }
            }, {
                path: 'lorp02',
                component: Lorp02Component,
                data: {
                    code: 'LORP02'
                },
                resolve: {
                    loanContract: Lorp02Resolver
                }
            }, {
                path: 'lorp03',
                component: Lorp03Component,
                data: {
                    code: 'LORP03'
                },
                resolve: {
                    loanContractStatement: Lorp03Resolver
                }
            }, {
                path: 'lorp04',
                component: Lorp04Component,
                data: {
                    code: 'LORP04'
                },
                resolve: {
                    loanCustomersAndGuarantors: Lorp04Resolver
                }
            }, {
                path: 'lorp05',
                component: Lorp05Component,
                data: {
                    code: 'LORP05'
                },
                resolve: {
                    lorp05: Lorp05Resolver
                }
            }, {
                path: 'lorp06',
                component: Lorp06Component,
                data: {
                    code: 'LORP06'
                },
                resolve: {
                    lorp06: Lorp06Resolver
                }
            },
            {
                path: 'lorp07',
                component: Lorp07Component,
                data: {
                    code: 'LORP07'
                },
                resolve: {
                    loanextension: Lorp07Resolver
                }
            }, {
                path: 'lorp08',
                component: Lorp08Component,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LORP08'
                },
                resolve: {
                    lorp08: Lorp08Resolver
                }
            }, {
                path: 'lorp09',
                component: Lorp09Component,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LORP09'
                },
                resolve: {
                    lorp09: Lorp09Resolver
                }
            }, {
                path: 'lorp10',
                component: Lorp10Component,
                data: {
                    code: 'LORP10'
                },
                resolve: {
                    lorp10: Lorp10Resolver
                }
            }, {
                path: 'lorp11',
                component: Lorp11Component,
                data: {
                    code: 'LORP11'
                },
                resolve: {
                    lorp11: Lorp11Resolver
                }
            }, {
                path: 'lorp12',
                component: Lorp12Component,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LORP12'
                },
                resolve: {
                    lorp12: Lorp12Resolver
                }
            }, {
                path: 'lorp13',
                component: Lorp13Component,
                data: {
                    code: 'LORP13'
                },
                resolve: {
                    lorp13: Lorp13Resolver
                }
            }, {
                path: 'lorp14',
                component: Lorp14Component,
                data: {
                    code: 'LORP14'
                }
            }, {
                path: 'lorp15',
                component: Lorp15Component,
                data: {
                    code: 'LORP15'
                },
                resolve: {
                    lorp15: Lorp15Resolver
                }
            }, {
                path: 'lorp16',
                component: Lorp16Component,
                data: {
                    code: 'LORP16'
                },
                resolve: {
                    lorp16: Lorp16Resolver
                }
            }, {
                path: 'lorp17',
                component: Lorp17Component,
                data: {
                    code: 'LORP17'
                },
                resolve: {
                    lorp17: Lorp17Resolver
                }
            }, {
                path: 'lorp18',
                component: Lorp18Component,
                data: {
                    code: 'LORP18'
                },
                resolve: {
                    lorp18: Lorp18Resolver
                }

            }, {
                path: 'lorp19',
                component: Lorp19Component,
                data: {
                    code: 'LORP19'
                },
                resolve: {
                    lorp19: Lorp19Resolver
                }
            }, {
                path: 'lorp20',
                component: Lorp20Component,
                data: {
                    code: 'LORP20'
                }, resolve: {
                    lorp20: Lorp20Resolver
                }
            }, {
                path: 'lorp21',
                component: Lorp21Component,
                data: {
                    code: 'LORP21'
                }, resolve: {
                    lorp21: Lorp21Resolver
                }
            }, {
                path: 'lorp22',
                component: Lorp22Component,
                data: {
                    code: 'LORP22'
                },
                resolve: {
                    lorp22: Lorp22Resolver
                }
            }, {
                path: 'lorp23',
                component: Lorp23Component,
                data: {
                    code: 'LORP23'
                },
                resolve: {
                    lorp23: Lorp23Resolver
                }
            }, {
                path: 'lorp25',
                component: Lorp25Component,
                data: {
                    code: 'LORP25'
                },
                resolve: {
                    lorp25: Lorp25Resolver
                }
            }, {
                path: 'lorp26',
                component: Lorp26Component,
                data: {
                    code: 'LORP26'
                },
                resolve: {
                    lorp26: Lorp26Resolver
                }
            }, {
                path: 'lorp27',
                component: Lorp27Component,
                data: {
                    code: 'LORP27'
                },
                resolve: {
                    lorp27: Lorp27Resolver
                }
            }, {
                path: 'lorf01',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf01Component,
                data: {
                    code: 'LORF01'
                },
                resolve: {
                    powerofattorney: Lorf01Resolver
                }
            },
            {
                path: 'lorf02',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf02Component,
                data: {
                    code: 'LORF02'
                },
                resolve: {
                    loanagreement: Lorf02Resolver
                }
            },
            {
                path: 'lorf03',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf03Component,
                data: {
                    code: 'LORF03'
                },
                resolve: {
                    carpurchaseagreement: Lorf03Resolver
                }
            }, {
                path: 'lorf06',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf06Component,
                data: {
                    code: 'LORF06'
                },
                resolve: {
                    loanorder: Lorf06Resolver
                }
            },
            {
                path: 'lorf09',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf09Component,
                data: {
                    code: 'LORF09'
                },
                resolve: {
                    garuntee: Lorf09Resolver
                }
            },
            {
                path: 'lorf11',
                canDeactivate: [CanDeactivateGuard],
                component: Lorf11Component,
                data: {
                    code: 'LORF11'
                },
                resolve: {
                    garuntee: Lorf11Resolver
                }
            },
            {
                path: 'lorp32',
                canDeactivate: [CanDeactivateGuard],
                component: Lorp32Component,
                data: {
                    code: 'LORP32'
                },
                resolve: {
                    garuntee: Lorp32Resolver
                }
            },
            {
                path: 'lomt09',
                component: Lomt09Component,
                data: {
                    code: 'LOMT09'
                },
                resolve: {
                    Lomt09: Lomt09Resolver
                }
            }, {
                path: 'lomt09/detail',
                component: Lomt09DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT09'
                },
                resolve: {
                    Lomt09: Lomt09Resolver
                }
            }, {
                path: 'lomt10',
                component: Lomt10Component,
                data: {
                    code: 'LOMT10'
                },
                resolve: {
                    Lomt10: Lomt10Resolver
                }
            }, {
                path: 'lomt10/detail',
                component: Lomt10DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT10'
                },
                resolve: {
                    Lomt10: Lomt10Resolver
                }
            }, {
                path: 'lomt10-2',
                component: Lomt10ViewComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT10'
                },
                resolve: {
                    Lomt10: Lomt10Resolver
                }
            }, {
                path: 'lomt10-2/detail',
                component: Lomt10ViewDetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT10'
                },
                resolve: {
                    Lomt10: Lomt10Resolver
                }
            }, {
                path: 'lomt11',
                component: Lomt11Component,
                data: {
                    code: 'LOMT11'
                },
                resolve: {
                    Lomt11: Lomt11Resolver
                }
            }, {
                path: 'lomt11/detail',
                component: Lomt11DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT11'
                },
                resolve: {
                    Lomt11: Lomt11Resolver
                }
            }, {
                path: 'lots15',
                component: Lots15Component,
                data: {
                    code: 'LOTS15'
                },
                resolve: {
                    Lots15: Lots15Resolver
                }
            }, {
                path: 'lots15/detail',
                component: Lots15DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS15'
                },
                resolve: {
                    Lots15: Lots15Resolver
                }
            }, {
                path: 'lots16',
                component: Lots16Component,
                data: {
                    code: 'LOTS16'
                },
                resolve: {
                    Lots16: Lots16Resolver
                }
            }, {
                path: 'lots16/detail',
                component: Lots16DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS16'
                },
                resolve: {
                    Lots16: Lots16Resolver
                }
            }, {
                path: 'lots17/detail',
                component: Lots17DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS17'
                },
                resolve: {
                    Lots17: Lots17Resolver
                }
            }, {
                path: 'lots18',
                component: Lots18Component,
                data: {
                    code: 'LOTS18'
                },
                resolve: {
                    lots18: Lots18Resolver
                }
            }, {
                path: 'lomt12',
                component: Lomt12Component,
                data: {
                    code: 'LOMT12'
                }
            }, {
                path: 'lomt12/detail',
                component: Lomt12DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT12'
                },
                resolve: {
                    attribute: Lomt12Resolver
                }
            }, {
                path: 'lomt13',
                component: Lomt13Component,
                data: {
                    code: 'LOMT13'
                },
                resolve: {
                    Lomt13: Lomt13Resolver
                }
            }, {
                path: 'lomt13/detail',
                component: Lomt13DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT13'
                },
                resolve: {
                    Lomt13: Lomt13Resolver
                }
            }, {
                path: 'lomt14',
                component: Lomt14Component,
                data: {
                    code: 'LOMT14'
                },
                resolve: {
                    Lomt14: Lomt14Resolver
                }
            }, {
                path: 'lomt14/detail',
                component: Lomt14DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT14'
                },
                resolve: {
                    Lomt14: Lomt14Resolver
                }
            }, {
                path: 'lomt15',
                component: Lomt15Component,
                data: {
                    code: 'LOMT15'
                },
                resolve: {
                    Lomt15: Lomt15Resolver
                }
            }, {
                path: 'lomt15/detail',
                component: Lomt15DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOMT15'
                },
                resolve: {
                    Lomt15: Lomt15Resolver
                }
            }, {
                path: 'lorp28',
                component: Lorp28Component,
                data: {
                    code: 'LORP28'
                },
                resolve: {
                    lorp28: Lorp28Resolver
                }
            }, {
                path: 'lorp29',
                component: Lorp29Component,
                data: {
                    code: 'LORP29'
                },
                resolve: {
                    lorp29: Lorp29Resolver
                }
            }, {
                path: 'lorp30',
                component: Lorp30Component,
                data: {
                    code: 'LORP30'
                },
                resolve: {
                    lorp30: Lorp30Resolver
                }
            }, {
                path: 'lorp31',
                component: Lorp31Component,
                data: {
                    code: 'LORP31'
                },
                resolve: {
                    lorp31: Lorp31Resolver
                }
            }, {
                path: 'lorp33',
                component: Lorp33Component,
                data: {
                    code: 'LORP33'
                },
                resolve: {
                    lorp33: Lorp33Resolver
                }
            }, {
                path: 'lorp34',
                component: Lorp34Component,
                data: {
                    code: 'LORP34'
                },
                resolve: {
                    lorp34: Lorp34Resolver
                }
            }, {
                path: 'lorp35',
                component: Lorp35Component,
                data: {
                    code: 'LORP35'
                },
                resolve: {
                    lorp35: Lorp35Resolver
                }
            }, {
                path: 'lorp36',
                component: Lorp36Component,
                data: {
                    code: 'LORP36'
                },
                resolve: {
                    lorp36: Lorp36Resolver
                }
            }, {
                path: 'lorp37',
                component: Lorp37Component,
                data: {
                    code: 'LORP37'
                },
                resolve: {
                    lorp37: Lorp37Resolver
                }
            }, {
                path: 'lorp38',
                component: Lorp38Component,
                data: {
                    code: 'LORP38'
                },
                resolve: {
                    lorp38: Lorp38Resolver
                }
            }, {
                path: 'lorp39',
                component: Lorp39Component,
                data: {
                    code: 'LORP39'
                },
                resolve: {
                    lorp39: Lorp39Resolver
                }
            }, {
                path: 'lorp40',
                component: Lorp40Component,
                data: {
                    code: 'LORP40'
                },
                resolve: {
                    lorp40: Lorp40Resolver
                }
            }, {
                path: 'lorp41',
                component: Lorp41Component,
                data: {
                    code: 'LORP41'
                },
                resolve: {
                    lorp41: Lorp41Resolver
                }
            }, {
                path: 'lorp42',
                component: Lorp42Component,
                data: {
                    code: 'LORP42'
                },
                resolve: {
                    lorp42: Lorp42Resolver
                }
            }, {
                path: 'lorp43',
                component: Lorp43Component,
                data: {
                    code: 'LORP43'
                },
                resolve: {
                    lorp43: Lorp43Resolver
                }
            }, {
                path: 'lorp44',
                component: Lorp44Component,
                data: {
                    code: 'LORP44'
                },
                resolve: {
                    lorp44: Lorp44Resolver
                }
            }, {
                path: 'lorp45',
                component: Lorp45Component,
                data: {
                    code: 'LORP45'
                },
                resolve: {
                    lorp45: Lorp45Resolver
                }
            }, {
                path: 'lomt16',
                component: Lomt16Component,
                data: {
                    code: 'LOMT16'
                },
                resolve: {
                    tracking: Lomt16Resolver
                }
            }, {
                path: 'lots19',
                component: Lots19Component,
                data: {
                    code: 'LOTS19'
                },
                resolve: {
                    Lots19: Lots19Resolver
                }
            }, {
                path: 'lots19/detail',
                component: Lots19DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS19'
                },
                resolve: {
                    Lots19: Lots19Resolver
                }
            }, {
                path: 'lots20',
                component: Lots20Component,
                data: {
                    code: 'LOTS20'
                },
                resolve: {
                    Lots20: Lots20Resolver
                }
            }, {
                path: 'lots20/detail',
                component: Lots20DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS20'
                },
                resolve: {
                    Lots20: Lots20Resolver
                }
            }, {
                path: 'lots20/detail/package',
                component: Lots20DetailPackageComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS20'
                },
                resolve: {
                    Lots20: Lots20Resolver
                }
            }, {
                path: 'lots21',
                component: Lots21Component,
                data: {
                    code: 'LOTS21'
                },
                resolve: {
                    Lots21: Lots21Resolver
                }
            }, {
                path: 'lots21/detail/document',
                component: Lots21DetailDocumentComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS21'
                },
                resolve: {
                    Lots21: Lots21Resolver
                }
            }, {
                path: 'lots21/detail/package',
                component: Lots21DetailPackageComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS21'
                },
                resolve: {
                    Lots21: Lots21Resolver
                }
            }, {
                path: 'lots22',
                component: Lots22Component,
                data: {
                    code: 'LOTS22'
                },
                resolve: {
                    Lots22: Lots22Resolver
                }
            }, {
                path: 'lots22/detail',
                component: Lots22DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS22'
                },
                resolve: {
                    Lots22: Lots22Resolver
                }
            }, {
                path: 'lots25',
                component: Lots25Component,
                data: {
                    code: 'LOTS25'
                },
                resolve: {
                    lots25: Lots25Resolver
                }
            }, {
                path: 'lots25/detail',
                component: Lots25DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS25'
                },
                resolve: {
                    lots25: Lots25Resolver
                }
            }, {
                path: 'lots25A',
                component: Lots25AComponent,
                data: {
                    code: 'LOTS25A'
                },
                resolve: {
                    lots25A: Lots25AResolver
                }
            }, {
                path: 'lots25B',
                component: Lots25BComponent,
                data: {
                    code: 'LOTS25B'
                },
                resolve: {
                    lots25B: Lots25BResolver
                }
            }, {
                path: 'lots25C',
                component: Lots25CComponent,
                data: {
                    code: 'LOTS25C'
                },
                resolve: {
                    lots25C: Lots25CResolver
                }
            }, {
                path: 'lots23',
                component: Lots23Component,
                data: {
                    code: 'LOTS23'
                },
                resolve: {
                    Lots23: Lots23Resolver
                }
            }, {
                path: 'lots23/detail',
                component: Lots23DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS23'
                },
                resolve: {
                    Lots23: Lots23Resolver
                }
            }, {
                path: 'lots26',
                component: Lots26Component,
                data: {
                    code: 'LOTS26'
                },
                resolve: {
                    lots26: Lots26Resolver
                }
            }, {
                path: 'lots26/detail',
                component: Lots26DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS26'
                },
                resolve: {
                    lots26: Lots26Resolver
                }
            }, {
                path: 'lots27',
                component: Lots27Component,
                data: {
                    code: 'LOTS27'
                },
                resolve: {
                    lots27: Lots27Resolver
                }
            }, {
                path: 'lots27/detail',
                component: Lots27DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS27'
                },
                resolve: {
                    lots27: Lots27Resolver
                }
            }, {
                path: 'lots28',
                component: Lots28Component,
                data: {
                    code: 'LOTS28'
                },
                resolve: {
                    lots28: Lots28Resolver
                }
            }, {
                path: 'lots29',
                component: Lots29Component,
                data: {
                    code: 'LOTS29'
                },
                resolve: {
                    lots29: Lots29Resolver
                }
            }, {
                path: 'lots29/detail',
                component: Lots29DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS29'
                },
                resolve: {
                    lots29: Lots29Resolver
                }
            }, {
                path: 'lots30',
                component: Lots30Component,
                data: {
                    code: 'LOTS30'
                },
                resolve: {
                    lots30: Lots30Resolver
                }
            }, {
                path: 'lots30/detail',
                component: Lots30DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'LOTS30'
                },
                resolve: {
                    lots30: Lots30Resolver
                }
            }, {
                path: 'lorp47',
                component: Lorp47Component,
                data: {
                    code: 'LORP47'
                },
                resolve: {
                    lorp47: Lorp47Resolver
                }
            }, {
                path: 'lorp48',
                component: Lorp48Component,
                data: {
                    code: 'LORP48'
                },
                resolve: {
                    lorp48: Lorp48Resolver
                }
              },{
                path: 'lorp49',
                component: Lorp49Component,
                data: {
                    code: 'LORP49'
                },
                resolve: {
                    lorp49: Lorp49Resolver
                }
              },{
                path: 'lorp50',
                component: Lorp50Component,
                data: {
                    code: 'LORP50'
                },
                resolve: {
                    lorp50: Lorp50Resolver
                }
              }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        //TS
        Lots01Resolver,
        Lots02Resolver,
        Lots05Resolver,
        Lots06Resolver,
        Lots07Resolver,
        Lots08Resolver,
        Lots09Resolver,
        Lots10Resolver,
        Lots11Resolver,
        Lots13Resolver,
        Lots14Resolver,
        Lots15Resolver,
        Lots16Resolver,
        Lots17Resolver,
        Lots18Resolver,
        Lots19Resolver,
        Lots20Resolver,
        Lots21Resolver,
        Lots22Resolver,
        Lots23Resolver,
        Lots24Resolver,
        Lots24AResolver,
        Lots24BResolver,
        Lots24CResolver,
        Lots25Resolver,
        Lots25AResolver,
        Lots25BResolver,
        Lots25CResolver,
        Lots26Resolver,
        Lots27Resolver,
        Lots28Resolver,
        Lots29Resolver,
        Lots30Resolver,

        //MT
        Lomt01Resolver,
        Lomt02Resolver,
        Lomt03Resolver,
        Lomt04Resolver,
        Lomt05Resolver,
        Lomt06Resolver,
        Lomt07Resolver,
        Lomt08Resolver,
        Lots04Resolver,
        Lots03Resolver,
        Lomt09Resolver,
        Lomt10Resolver,
        Lomt11Resolver,
        Lomt12Resolver,
        Lomt13Resolver,
        Lomt14Resolver,
        Lomt15Resolver,
        Lomt16Resolver,

        //RP
        Lorp01Resolver,
        Lorp02Resolver,
        Lorp03Resolver,
        Lorp04Resolver,
        Lorp05Resolver,
        Lorp06Resolver,
        Lorp07Resolver,
        Lorp08Resolver,
        Lorp09Resolver,
        Lorp10Resolver,
        Lorp11Resolver,
        Lorp12Resolver,
        Lorp13Resolver,
        Lorp15Resolver,
        Lorf11Resolver,
        Lorp16Resolver,
        Lorp17Resolver,
        Lorp19Resolver,
        Lorp18Resolver,
        Lorp20Resolver,
        Lorp21Resolver,
        Lorp22Resolver,
        Lorp23Resolver,
        Lorp25Resolver,
        Lorp26Resolver,
        Lorp27Resolver,
        Lorp28Resolver,
        Lorp29Resolver,
        Lorp30Resolver,
        Lorp31Resolver,
        Lorp32Resolver,
        Lorp33Resolver,
        Lorp34Resolver,
        Lorp35Resolver,
        Lorp36Resolver,
        Lorp37Resolver,
        Lorp38Resolver,
        Lorp39Resolver,
        Lorp40Resolver,
        Lorp41Resolver,
        Lorp42Resolver,
        Lorp43Resolver,
        Lorp44Resolver,
        Lorp45Resolver,
        Lorp47Resolver,
        Lorp48Resolver,
        Lorp49Resolver,
        Lorp50Resolver,
        
        //RF
        Lorf01Resolver,
        Lorf02Resolver,
        Lorf03Resolver,
        Lorf06Resolver,
        Lorf09Resolver,
        Lorf11Resolver,
    ]
})
export class LoRoutingModule {

}

