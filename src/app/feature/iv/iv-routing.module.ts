import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core';

// ---Component---
import { Ivts01Component } from './ivts01/ivts01.component';
import { Ivts02Component } from './ivts02/ivts02.component';
import { Ivts03Component } from './ivts03/ivts03.component';
import { Ivts04Component } from './ivts04/ivts04.component';
import { Ivts05Component } from './ivts05/ivts05.component';
import { Ivts06Component } from './ivts06/ivts06.component';
import { Ivts07Component } from './ivts07/ivts07.component';
import { Ivts08Component } from './ivts08/ivts08.component';

// ---DetailComponent---
import { Ivts03DetailComponent } from './ivts03/ivts03-detail.component';
import { Ivts02DetailComponent } from './ivts02/ivts02-detail.component';
import { Ivts08DetailComponent } from './ivts08/ivts08.detail.component';


// ---Resolve---
import { Ivts02Resolver } from './ivts02/ivts02-resolver.service';


const routes: Routes = [
    {
        path: '',
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'IVTS01', pathMatch: 'full',
            },
            {
                path: 'ivts01',
                component: Ivts01Component,
                data: {
                    code: 'IVTS01'
                }
            },
            {
                path: 'ivts02',
                component: Ivts02Component,
                data: {
                    code: 'IVTS02'
                }
            },
            {
                path: 'ivts02/detail',
                component: Ivts02DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'IVTS02'
                }
            },
            {
                path: 'ivts03',
                component: Ivts03Component,
                data: {
                    code: 'IVTS03'
                }
            },
            {
                path: 'ivts03/detail',
                component: Ivts03DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'IVTS03'
                }
            },
            {
                path: 'ivts04',
                component: Ivts04Component,
                data: {
                    code: 'IVTS04'
                }
            },
            {
                path: 'ivts05',
                component: Ivts05Component,
                data: {
                    code: 'IVTS05'
                }
            },
            {
                path: 'ivts06',
                component: Ivts06Component,
                data: {
                    code: 'IVTS06'
                }
            },
            {
                path: 'ivts07',
                component: Ivts07Component,
                data: {
                    code: 'IVTS07'
                }
            },
            {
                path: 'ivts08',
                component: Ivts08Component,
                data: {
                    code: 'IVTS08'
                }
            },
            {
                path: 'ivts08/detail',
                component: Ivts08DetailComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    code: 'IVTS08'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        Ivts02Resolver
    ]
})
export class IvRoutingModule {

}
