import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HotelDetailsComponent {
  @Input() hotelName: string = '';
  @Input() hotelRating: number = 0;
  @Input() hotelAddress: string = '';
  @Input() hotelImage: string = '';
  @Input() suiteName: string = '';
  @Input() suiteImage: string = '';
  @Input() suitePrice: number = 0;
  @Input() suiteCapacity: number = 2;
  @Input() suiteFeatures: string[] = [];
  
  get stars(): string {
    return '★'.repeat(this.hotelRating);
  }
}