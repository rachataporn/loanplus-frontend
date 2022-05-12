import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core';


import { Sumt01Component } from './sumt01/sumt01.component';
import { Sumt06Component } from './sumt06/sumt06.component';
import { Sumt03Component } from './sumt03/sumt03.component';
import { Sumt04Component } from './sumt04/sumt04.component';
import { Sumt05Component } from './sumt05/sumt05.component';
import { Sumt07Component } from './sumt07/sumt07.component';
import { Sumt08Component } from './sumt08/sumt08.component';


import { Sumt03DetailComponent } from './sumt03/sumt03-detail.component';
import { Sumt04DetailComponent } from './sumt04/sumt04-detail.component';
import { Sumt05DetailComponent } from './sumt05/sumt05-detail.component';
import { Sumt06DetailComponent } from './sumt06/sumt06-detail.component';
import { Sumt07DetailComponent } from './sumt07/sumt07-detail.component';
import { Sumt08DetailComponent } from './sumt08/sumt08-detail.component';



import { Sumt03Resolver } from './sumt03/sumt03-resolver.service';
import { Sumt04Resolver } from './sumt04/sumt04-resolver.service';
import { Sumt05Resolver } from './sumt05/sumt05-resolver.service';
import { Sumt06Resolver } from './sumt06/sumt06-resolver.service';
import { Sumt07Resolver } from './sumt07/sumt07-resolver.service';
import { Sumt08Resolver } from './sumt08/sumt08-resolver.service';
import { Sumt01Resolver } from './sumt01/sumt01-resolver.service';
import { Sumt01DetailComponent } from './sumt01/sumt01-detail.component';





const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sumt01',
        component: Sumt01Component,
        data: {
          code: 'SUMT01'
        }
        ,
        resolve: {
          sumt01: Sumt01Resolver
        }
      },
      {
        path: 'sumt01/detail',
        component: Sumt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT01'
        }
        ,
        resolve: {
          sumt01: Sumt01Resolver
        }
      },
      {
        path: 'sumt03',
        component: Sumt03Component,
        data: {
          code: 'SUMT03'
        } 
      },
      {
        path: 'sumt03/detail',
        component: Sumt03DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT03'
        },
        resolve: {
          sumt03: Sumt03Resolver
        }
      },
      {
        path: 'sumt04',
        component: Sumt04Component,
        data: {
          code: 'SUMT04'
        } 
      },
      {
        path: 'sumt04/detail',
        component: Sumt04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT04'
        },
        resolve: {
          sumt04: Sumt04Resolver
        }
      },{
        path: 'sumt05',
        component: Sumt05Component,
        data: {
          code: 'SUMT05'
        } 
      },
      {
        path: 'sumt05/detail',
        component: Sumt05DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT05'
        },
        resolve: {
          sumt05: Sumt05Resolver
        }
      },
      {
        path: 'sumt06',
        component: Sumt06Component,
        data: {
          code: 'SUMT06'
        } 
      },
      {
        path: 'sumt06/detail',
        component: Sumt06DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT06'
        },
        resolve: {
          sumt06: Sumt06Resolver
        }
      },
      {
      path: 'sumt07',
      component: Sumt07Component,
      data: {
        code: 'SUMT07'
      },
      resolve: {
        sumt07: Sumt07Resolver
      }
    },
    {
      path: 'sumt07/detail',
      component: Sumt07DetailComponent,
      canDeactivate: [CanDeactivateGuard],
      data: {
        code: 'SUMT07'
      },
      resolve: {
        sumt07: Sumt07Resolver
      }
    },
      {
        path: 'sumt08',
        component: Sumt08Component,
        data: {
          code: 'SUMT08'
        }
        ,
        resolve: {
          sumt08: Sumt08Resolver
        }
      },
      {
        path: 'sumt08/detail',
        component: Sumt08DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'SUMT08'
        }
        ,
        resolve: {
          sumt08: Sumt08Resolver
        }
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Sumt01Resolver,
    Sumt03Resolver,
    Sumt04Resolver,
    Sumt05Resolver,
    Sumt06Resolver, 
    Sumt07Resolver, 
    Sumt08Resolver,
  ]
 
})
export class SuRoutingModule { }
