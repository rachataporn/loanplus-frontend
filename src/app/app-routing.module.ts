import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectivePreloadingStrategy } from '@app/selective-preloading-strategy';
import { Route, CanDeactivateGuard } from '@app/core';
export const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: 'app/feature/dashboard/dashboard.module#DashboardModule' },
    { path: 'demo', loadChildren: 'app/feature/demo/demo.module#DemoModule' },
    { path: 'db', loadChildren: 'app/feature/db/db.module#DbModule' },
    { path: 'lo', loadChildren: 'app/feature/lo/lo.module#LoModule' },
    { path: 'iv', loadChildren: 'app/feature/iv/iv.module#IvModule' },
    { path: 'su', loadChildren: 'app/feature/su/su.module#SuModule' },
    { path: 'tr', loadChildren: 'app/feature/tr/tr.module#TrModule' },
    // { path: 'home', loadChildren: 'app/feature/home/home.module#HomeModule' }
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: SelectivePreloadingStrategy
  })],
  exports: [RouterModule],
  providers: [CanDeactivateGuard, SelectivePreloadingStrategy]
})
export class AppRoutingModule { }
