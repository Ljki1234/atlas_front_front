import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetails } from '../../models/booking.model';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css'],
  standalone: true,
  imports: [CommonModule],
  schemas: []
})
export class BookingSummaryComponent {
  @Input() bookingDetails!: BookingDetails;
}