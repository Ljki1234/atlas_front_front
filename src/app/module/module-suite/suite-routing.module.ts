// src/app/suites/suite-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuiteListComponent } from './components/suite-list/suite-list.component'

const routes: Routes = [
  {
    path: 'suites',
    component: SuiteListComponent
  },
  {
    path: 'suite/:id',
    component: SuiteListComponent
  },
  {
    path: '',
    redirectTo: '/suites',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuiteRoutingModule { }
