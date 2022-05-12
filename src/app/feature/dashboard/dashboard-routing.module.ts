import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '@app/core';
import { DashboardResolver } from './dashboard-resolver.service';

const routes: Routes = [
  {
    path: '',
    data: {
      code: 'Dashboard'
    },
    resolve:{
      dashboard:DashboardResolver
    },
    component:DashboardComponent,
    canActivateChild:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[DashboardResolver]
})
export class DashboardRoutingModule { }
