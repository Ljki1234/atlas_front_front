// src/app/suites/suite.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiteListComponent } from './components/suite-list/suite-list.component'
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    SuiteListComponent
  ]
})
export class SuiteModule { }
