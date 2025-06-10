import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalService } from '../../models/booking.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-services',
  templateUrl: './additional-services.component.html',
  styleUrls: ['./additional-services.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdditionalServicesComponent {
  @Input() services: AdditionalService[] = [];
  
  toggleService(service: AdditionalService): void {
    service.selected = !service.selected;
  }
}