import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './program/program.component';
import { Program } from '@env/program-code';
import { ProgramResolver } from './program/program-resolver.service';

const routes: Routes = [
  {
    path: 'program',
    component : ProgramComponent,
    data : {
      code: Program.Demo
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ ProgramResolver ]
})
export class DemoRoutingModule { }
