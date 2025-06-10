import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressStep } from '../../models/booking.model';

@Component({
  selector: 'app-progress-steps',
  templateUrl: './progress-steps.component.html',
  styleUrls: ['./progress-steps.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProgressStepsComponent {
  @Input() steps: ProgressStep[] = [];
}