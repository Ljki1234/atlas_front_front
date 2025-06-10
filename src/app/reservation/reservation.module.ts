import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation.component';
import { ProgressStepsComponent } from './components/progress-steps/progress-steps.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { GuestFormComponent } from './components/guest-form/guest-form.component';
import { AdditionalServicesComponent } from './components/additional-services/additional-services.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReservationComponent,
    ProgressStepsComponent,
    HotelDetailsComponent,
    GuestFormComponent,
    AdditionalServicesComponent,
    BookingSummaryComponent
  ],
  exports: [
    ReservationComponent
  ]
})
export class ReservationModule { }