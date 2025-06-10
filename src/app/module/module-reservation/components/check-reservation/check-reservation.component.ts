import { ReservationService } from '../../module-reservation.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservatioryvn.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  @Input() suiteDescription: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() numberOfGuests: number = 1;
  @Output() availabilityMessage: EventEmitter<string> = new EventEmitter();

  constructor(private reservationService: ReservationService) {}

  checkAvailability(): void {
    if (!this.suiteDescription || !this.startDate || !this.endDate) {
      this.availabilityMessage.emit('❗ Veuillez remplir tous les champs.');
      return;
    }

    this.reservationService.checkAvailability(this.suiteDescription, this.startDate, this.endDate, this.numberOfGuests)
      .subscribe({
        next: (isAvailable) => {
          this.availabilityMessage.emit(isAvailable
            ? '✅ La suite est disponible.'
            : '❌ La suite est indisponible.');
        },
        error: (err) => {
          console.error(err);
          this.availabilityMessage.emit('❌ Erreur lors de la vérification.');
        }
      });
  }
}
