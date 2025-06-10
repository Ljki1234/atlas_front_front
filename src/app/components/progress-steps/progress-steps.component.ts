import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-progress-steps',
  imports: [],
  templateUrl: './progress-steps.component.html',
  styleUrl: './progress-steps.component.css'
})
export class ProgressStepsComponent {
  @Input() steps: string[] = [];

}
