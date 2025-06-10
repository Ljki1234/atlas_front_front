import { Component, OnInit } from '@angular/core';
import { SuiteService } from '../../suite.service';
import { Suite } from '../../models/suite';


@Component({
  selector: 'app-suite-list',
  templateUrl: './suite-list.component.html',
  styleUrls: ['./suite-list.component.css']
})
export class SuiteListComponent implements OnInit {
  suites: Suite[] = [];

  constructor(private suiteService: SuiteService) { }

  ngOnInit(): void {
    this.getSuites();
  }


  getSuites(): void {
    this.suiteService.getSuites().subscribe((data: Suite[]) => {
      this.suites = data;
    });
  }
}
