import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core';

// ---Component---
import { Trts01Component } from './trts01/trts01.component';
import { Trts02Component } from './trts02/trts02.component';
import { Trts03Component } from './trts03/trts03.component';
import { Trts04Component } from './trts04/trts04.component';
import { Trts05Component } from './trts05/trts05.component';
import { Trts06Component } from './trts06/trts06.component';
import { Trts07Component } from './trts07/trts07.component';

import { Trts0102Component } from './trts01-2/trts01-2.component';

import { Trmt01Component } from './trmt01/trmt01.component';

import { Trrp01Component } from './trrp01/trrp01.component';
import { Trrp02Component } from './trrp02/trrp02.component';
import { Trrp03Component } from './trrp03/trrp03.component';
import { Trrp04Component } from './trrp04/trrp04.component';
import { Trrp05Component } from './trrp05/trrp05.component';

// ---DetailComponent---
import { Trts01DetailComponent } from './trts01/trts01-detail.component';
import { Trts0102DetailComponent } from './trts01-2/trts01-2-detail.component';
import { Trts02DetailComponent } from './trts02/trts02-detail.component';
import { Trts03DetailComponent } from './trts03/trts03-detail.component';
import { Trts04DetailComponent } from './trts04/trts04-detail.component';
import { Trts05DetailComponent } from './trts05/trts05-detail.component';
import { Trts06DetailComponent } from './trts06/trts06-detail.component';

import { Trmt01DetailComponent } from './trmt01/trmt01-detail.component';

// ---Resolve---
import { Trts01Resolver } from './trts01/trts01-resolver.service';
import { Trts02Resolver } from './trts02/trts02-resolver.service';
import { Trts03Resolver } from './trts03/trts03-resolver.service';
import { Trts04Resolver } from './trts04/trts04-resolver.service';
import { Trts05Resolver } from './trts05/trts05-resolver.service';
import { Trts06Resolver } from './trts06/trts06-resolver.service';
import { Trts07Resolver } from './trts07/trts07-resolver.service';

import { Trmt01Resolver } from './trmt01/trmt01.resolver.service';

import { Trrp01Resolver } from './trrp01/trrp01-resolver.service';
import { Trrp02Resolver } from './trrp02/trrp02-resolver.service';
import { Trrp03Resolver } from './trrp03/trrp03-resolver.service';
import { Trrp04Resolver } from './trrp04/trrp04-resolver.service';
import { Trrp05Resolver } from './trrp05/trrp05-resolver.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'trts01',
        component: Trts01Component,
        data: {
          code: 'TRTS01'
        },
        resolve: {
          trts01: Trts01Resolver
        }
      }, {
        path: 'trts01/detail',
        component: Trts01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS01'
        },
        resolve: {
          trts01: Trts01Resolver
        }
      }, {
        path: 'trts01-2',
        component: Trts0102Component,
        data: {
          code: 'TRTS01-2'
        },
        resolve: {
          trts01: Trts01Resolver
        }
      }, {
        path: 'trts01-2/detail',
        component: Trts0102DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS01-2'
        },
        resolve: {
          trts01: Trts01Resolver
        }
      },
      {
        path: 'trts02',
        component: Trts02Component,
        data: {
          code: 'TRTS02'
        },
        resolve: {
          trts02: Trts02Resolver
        }
      }, {
        path: 'trts02/detail',
        component: Trts02DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS02'
        },
        resolve: {
          trts02: Trts02Resolver
        }
      },
      {
        path: 'trts03',
        component: Trts03Component,
        data: {
          code: 'TRTS03'
        },
        resolve: {
          trts03: Trts03Resolver
        }
      }, {
        path: 'trts03/detail',
        component: Trts03DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS03'
        },
        resolve: {
          trts03: Trts03Resolver
        }
      },
      {
        path: 'trmt01',
        component: Trmt01Component,
        data: {
          code: 'TRMT01'
        },
        resolve: {
          tracking: Trmt01Resolver
        }
      }, {
        path: 'trmt01/detail',
        component: Trmt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRMT01'
        },
        resolve: {
          tracking: Trmt01Resolver
        }
      },
      {
        path: 'trts04',
        component: Trts04Component,
        data: {
          code: 'TRTS04'
        },
        resolve: {
          trts04: Trts04Resolver
        }
      }, {
        path: 'trts04/detail',
        component: Trts04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS04'
        },
        resolve: {
          trts04: Trts04Resolver
        }
      },
      {
        path: 'trts05',
        component: Trts05Component,
        data: {
          code: 'TRTS05'
        },
        resolve: {
          trts05: Trts05Resolver
        }
      }, {
        path: 'trts05/detail',
        component: Trts05DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS05'
        },
        resolve: {
          trts05: Trts05Resolver
        }
      },
      {
        path: 'trrp01',
        component: Trrp01Component,
        data: {
          code: 'TRRP01'
        },
        resolve: {
          trrp01: Trrp01Resolver
        }
      },
      {
        path: 'trrp02',
        component: Trrp02Component,
        data: {
          code: 'TRRP02'
        },
        resolve: {
          trrp02: Trrp02Resolver
        }
      },
      {
        path: 'trrp03',
        component: Trrp03Component,
        data: {
          code: 'TRRP03'
        },
        resolve: {
          trrp03: Trrp03Resolver
        }
      },
      {
        path: 'trrp04',
        component: Trrp04Component,
        data: {
          code: 'TRRP04'
        },
        resolve: {
          trrp04: Trrp04Resolver
        }
      },
      {
        path: 'trrp05',
        component: Trrp05Component,
        data: {
          code: 'TRRP05'
        },
        resolve: {
          trrp05: Trrp05Resolver
        }
      },
      {
        path: 'trts06',
        component: Trts06Component,
        data: {
          code: 'TRTS06'
        },
        resolve: {
          trts06: Trts06Resolver
        }
      }, {
        path: 'trts06/detail',
        component: Trts06DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'TRTS06'
        },
        resolve: {
          trts06: Trts06Resolver
        }
      },{
        path: 'trts07',
        component: Trts07Component,
        data: {
          code: 'TRTS07'
        },
        resolve: {
          trts06: Trts07Resolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Trts01Resolver,
    Trts02Resolver,
    Trts03Resolver,
    Trts04Resolver,
    Trts05Resolver,
    Trts06Resolver,
    Trts07Resolver,
    Trmt01Resolver,
    Trrp01Resolver,
    Trrp02Resolver,
    Trrp03Resolver,
    Trrp04Resolver,
    Trrp05Resolver,
  ]

})
export class TrRoutingModule { }
