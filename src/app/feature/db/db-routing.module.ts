import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, AuthGuard } from '@app/core';

// ---Component---
import { Dbmt04Component } from './dbmt04/dbmt04.component';
import { Dbmt05Component } from './dbmt05/dbmt05.component';
import { Dbmt06Component } from './dbmt06/dbmt06.component';
import { Dbmt16Component } from './dbmt16/dbmt16.component';
import { Dbmt08Component } from './dbmt08/dbmt08.component';
import { Dbmt09Component } from './dbmt09/dbmt09.component';
import { Dbmt10Component } from './dbmt10/dbmt10.component';
import { Dbmt111Component } from './dbmt11/dbmt11-1.component';
import { Dbmt112Component } from './dbmt11/dbmt11-2.component';
import { Dbmt12Component } from './dbmt12/dbmt12.component';
import { Dbmt07Component } from './dbmt07/dbmt07.component';
import { Dbmt17Component } from './dbmt17/dbmt17.component';
import { Dbmt18Component } from './dbmt18/dbmt18.component';
import { Dbmt19Component } from './dbmt19/dbmt19.component';
import { Dbmt20Component } from './dbmt20/dbmt20.component';
import { Dbmt21Component } from './dbmt21/dbmt21.component';

// ---DetailComponent---
import { Dbmt04DetailComponent } from './dbmt04/dbmt04-detail.component';
import { Dbmt05DetailComponent } from './dbmt05/dbmt05-detail.component';
import { Dbmt06DetailComponent } from './dbmt06/dbmt06-detail.component';
import { Dbmt16DetailComponent } from './dbmt16/dbmt16-detail.component';
import { Dbmt08DetailComponent } from './dbmt08/dbmt08-detail.component';
import { Dbmt09DetailComponent } from './dbmt09/dbmt09-detail.component';
import { Dbmt10DetailComponent } from './dbmt10/dbmt10-detail.component';
import { Dbmt111DetailComponent } from './dbmt11/dbmt11-1-detail.component';
import { Dbmt112DetailComponent } from './dbmt11/dbmt11-2-detail.component';
import { Dbmt12DetailComponent } from './dbmt12/dbmt12-detail.component';
import { Dbmt07DetailComponent } from './dbmt07/dbmt07-detail.component';
import { Dbmt17DetailComponent } from './dbmt17/dbmt17-detail.component';
import { Dbmt18DetailComponent } from './dbmt18/dbmt18-detail.component';
import { Dbmt19DetailComponent } from './dbmt19/dbmt19-detail.component';
import { Dbmt21DetailComponent } from './dbmt21/dbmt21-detail.component';

// ---Resolve---
import { Dbmt04Resolver } from './dbmt04/dbmt04-resolver.service';
import { Dbmt05Resolver } from './dbmt05/dbmt05-resolver.service';
import { Dbmt06Resolver } from './dbmt06/dbmt06-resolver.service';
import { Dbmt08Resolver } from './dbmt08/dbmt08-resolver.service';
import { Dbmt16Resolver } from './dbmt16/dbmt16-resolver.service';
import { Dbmt09Resolver } from './dbmt09/dbmt09-resolver.service';
import { Dbmt10Resolver } from './dbmt10/dbmt10-resolver.service';
import { Dbmt111Resolver } from './dbmt11/dbmt11-1-resolver.service';
import { Dbmt112Resolver } from './dbmt11/dbmt11-2-resolver.service';
import { Dbmt12Resolver } from './dbmt12/dbmt12-resolver.service';
import { Dbmt07Resolver } from './dbmt07/dbmt07-resolver.service';
import { Dbmt17Resolver } from './dbmt17/dbmt17-resolver.service';
import { Dbmt18Resolver } from './dbmt18/dbmt18-resolver.service';
import { Dbmt19Resolver } from './dbmt19/dbmt19-resolver.service';
import { Dbmt20Resolver } from './dbmt20/dbmt20-resolver.service';
import { Dbmt21Resolver } from './dbmt21/dbmt21-resolver.service';


const routes: Routes = [
  {
    path: '',
    canActivateChild:[AuthGuard],
    children: [
      {
        path: 'dbmt04',
        component: Dbmt04Component,
        data: {
          code: 'DBMT04'
        },
        resolve: {
          listItem: Dbmt04Resolver
        }
      }, {
        path: 'dbmt04/detail',
        component: Dbmt04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT04'
        },
        resolve: {
          listItem: Dbmt04Resolver
        }
      }, {
        path: 'dbmt05',
        component: Dbmt05Component,
        data: {
          code: 'DBMT05'
        },
        resolve: {
          bank: Dbmt05Resolver
        }
      }, {
        path: 'dbmt05/detail',
        component: Dbmt05DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT05'
        },
        resolve: {
          bank: Dbmt05Resolver
        }
      }, {
        path: 'dbmt06',
        component: Dbmt06Component,
        data: {
          code: 'DBMT06'
        },
        resolve: {
          bankAccountType: Dbmt06Resolver
        }
      }, {
        path: 'dbmt06/detail',
        component: Dbmt06DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT06'
        },
        resolve: {
          bankAccountType: Dbmt06Resolver
        }
      }, {
        path: 'dbmt16',
        component: Dbmt16Component,
        data: {
          code: 'DBMT16'
        },
        resolve: {
          dbmt16: Dbmt16Resolver
        }
      }, {
        path: 'dbmt16/detail',
        component: Dbmt16DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT16'
        },
        resolve: {
          dbmt16: Dbmt16Resolver
        }
      }, {
        path: 'dbmt09',
        component: Dbmt09Component,
        data: {
          code: 'DBMT09'
        },
        resolve: {
          dbmt09: Dbmt09Resolver
        }
      }, {
        path: 'dbmt09/detail',
        component: Dbmt09DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT09'
        },
        resolve: {
          dbmt09: Dbmt09Resolver
        }
      }, {
        path: 'dbmt10',
        component: Dbmt10Component,
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt10: Dbmt10Resolver
        }
      }, {
        path: 'dbmt10/detail',
        component: Dbmt10DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt10: Dbmt10Resolver
        }
      }, {
        path: 'dbmt11-1',
        component: Dbmt111Component,
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt111: Dbmt111Resolver
        }
      }, {
        path: 'dbmt11-1/detail',
        component: Dbmt111DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt111: Dbmt111Resolver
        }
      }, {
        path: 'dbmt11-2',
        component: Dbmt112Component,
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt112: Dbmt112Resolver
        }
      }, {
        path: 'dbmt11-2/detail',
        component: Dbmt112DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT10'
        },
        resolve: {
          dbmt112: Dbmt112Resolver
        }
      },
      {
        path: 'dbmt08',
        component: Dbmt08Component,
        data: {
          code: 'DBMT08'
        },
        resolve: {
          prefix: Dbmt08Resolver
        }
      }, {
        path: 'dbmt08/detail',
        component: Dbmt08DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT08'
        }
        ,
        resolve: {
          prefix: Dbmt08Resolver
        }
      }, {
        path: 'dbmt12',
        component: Dbmt12Component,
        data: {
          code: 'DBMT12'
        },
        resolve: {
          dbmt12: Dbmt12Resolver
        }
      }, {
        path: 'dbmt12/detail',
        component: Dbmt12DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT12'
        },
        resolve: {
          dbmt12: Dbmt12Resolver
        }
      },{
      path: 'dbmt07',
      component: Dbmt07Component,
      data: {
      code: 'DBMT07'
      },
      resolve: {
        employee: Dbmt07Resolver
        }
      },{
      path: 'dbmt07/detail',
      component: Dbmt07DetailComponent,
      canDeactivate: [CanDeactivateGuard],
      data: {
      code: 'DBMT07'
      },
      resolve: {
        employee: Dbmt07Resolver
        }
      }
      , {
        path: 'dbmt17',
        component: Dbmt17Component,
        data: {
          code: 'DBMT17'
        },
        resolve: {
          dbmt17: Dbmt17Resolver
        }
      }, {
        path: 'dbmt17/detail',
        component: Dbmt17DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT17'
        },
        resolve: {
          dbmt17: Dbmt17Resolver
        }
      }
      , {
        path: 'dbmt18',
        component: Dbmt18Component,
        data: {
          code: 'DBMT18'
        },
        resolve: {
          dbmt18: Dbmt18Resolver
        }
      }, {
        path: 'dbmt18/detail',
        component: Dbmt18DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT18'
        },
        resolve: {
          dbmt18: Dbmt18Resolver
        }
      }
      ,{
        path: 'dbmt19',
        component: Dbmt19Component,
        data: {
          code: 'DBMT19'
        },
        resolve: {
          dbmt19: Dbmt19Resolver
        }
      }, {
        path: 'dbmt19/detail',
        component: Dbmt19DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT19'
        },
        resolve: {
          dbmt19: Dbmt19Resolver
        }
      },{
        path: 'dbmt20',
        component: Dbmt20Component,
        data: {
          code: 'DBMT20'
        },
        resolve: {
          dbmt20: Dbmt20Resolver
        }
      },
      {
        path: 'dbmt21',
        component: Dbmt21Component,
        data: {
          code: 'DBMT21'
        },
        resolve: {
          dbmt21: Dbmt21Resolver
        }
      },
      {
        path: 'dbmt21/detail',
        component: Dbmt21DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          code: 'DBMT21'
        },
        resolve: {
          dbmt21: Dbmt21Resolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Dbmt04Resolver,
    Dbmt05Resolver,
    Dbmt06Resolver,
    Dbmt08Resolver,
    Dbmt09Resolver,
    Dbmt10Resolver,
    Dbmt111Resolver,
    Dbmt112Resolver,
    Dbmt16Resolver,
    Dbmt12Resolver,
    Dbmt07Resolver,
    Dbmt17Resolver,
    Dbmt18Resolver,
    Dbmt19Resolver,
    Dbmt20Resolver,
    Dbmt21Resolver,
  ]

})
export class DbRoutingModule { }
