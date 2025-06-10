import { Component } from '@angular/core';
import { ReservationService } from './module-reservation.service';  // IMPORTANT: importer ici

@Component({
  selector: 'app-check-availability',
  templateUrl: './check-availability.component.html'
})
export class CheckAvailabilityComponent {
  availabilityResult: boolean | string | undefined;

  constructor(private reservationService: ReservationService) { }

  check() {
    this.reservationService.checkAvailability('Nom suite', '2025-05-20', '2025-05-22', 2)
      .subscribe(result => {
        this.availabilityResult = result;
        console.log('Disponibilité:', result);
      });
  }
}
