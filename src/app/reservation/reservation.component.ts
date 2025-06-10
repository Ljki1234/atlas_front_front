import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProgressStepsComponent } from './components/progress-steps/progress-steps.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { GuestFormComponent } from './components/guest-form/guest-form.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
import { LoadingDialogComponent } from './components/loading-dialog/loading-dialog.component';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { BookingDetails, ProgressStep } from './models/booking.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProgressStepsComponent,
    HotelDetailsComponent,
    GuestFormComponent,
    BookingSummaryComponent,
    LoadingDialogComponent,
    SuccessDialogComponent
  ]
})
export class ReservationComponent implements OnInit {
  showLoadingDialog = false;
  showSuccessDialog = false;
  progressSteps: ProgressStep[] = [
    { number: 1, label: 'Votre sélection', completed: true, active: false },
    { number: 2, label: 'Vos informations', completed: false, active: true },
    { number: 3, label: 'Finaliser la réservation', completed: false, active: false }
  ];

  bookingDetails: BookingDetails = {
    hotelName: 'Hôtel Atlas',
    hotelRating: 4.5,
    hotelAddress: '123 Avenue Mohammed V, Marrakech, Maroc',
    hotelImage: 'assets/images/hotel.jpg',
    checkInDate: '',
    checkOutDate: '',
    checkInDay: '',
    checkOutDay: '',
    nightCount: 0,
    guestCount: 0,
    roomName: '',
    roomFeatures: [],
    roomPrice: 0,
    vatPercentage: 0,
    vatAmount: 0,
    cityTax: 0,
    totalPrice: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['suiteDescription']) {
        this.bookingDetails.roomName = params['suiteDescription'].trim();
      }
      if (params['startDate']) {
        const startDate = new Date(params['startDate']);
        this.bookingDetails.checkInDate = startDate.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        this.bookingDetails.checkInDay = startDate.toLocaleDateString('fr-FR', { weekday: 'long' });
      }
      if (params['endDate']) {
        const endDate = new Date(params['endDate']);
        this.bookingDetails.checkOutDate = endDate.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        this.bookingDetails.checkOutDay = endDate.toLocaleDateString('fr-FR', { weekday: 'long' });
      }
      if (params['numberOfGuests']) {
        this.bookingDetails.guestCount = parseInt(params['numberOfGuests']);
      }
      if (params['suitePrice']) {
        this.bookingDetails.roomPrice = parseFloat(params['suitePrice']);
      }
      if (params['vatPercentage']) {
        this.bookingDetails.vatPercentage = parseFloat(params['vatPercentage']);
        this.bookingDetails.vatAmount = (this.bookingDetails.roomPrice * this.bookingDetails.vatPercentage) / 100;
      }
      this.bookingDetails.cityTax = 0;

      // Calculate night count
      if (params['startDate'] && params['endDate']) {
        const start = new Date(params['startDate']);
        const end = new Date(params['endDate']);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        this.bookingDetails.nightCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // Calcul du prix total = (Nombre de nuits * prix de la suite) + TVA
      this.bookingDetails.totalPrice = (this.bookingDetails.nightCount * this.bookingDetails.roomPrice) + this.bookingDetails.vatAmount;

      // Set room features based on the selected suite
      this.setRoomFeatures(this.bookingDetails.roomName);
    });
  }

  private setRoomFeatures(suiteName: string) {
    switch (suiteName) {
      case 'Suite Deluxe Ourika':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Terrasse, Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Supérieure Wirgan':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Terrasse, Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Supérieure Imlil':
        this.bookingDetails.roomFeatures = [
          '2 Lits',
          'Terrasse',
          'Télévision, Wi-Fi',
          'Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Supérieure Asni':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Terrasse, Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Supérieure Ijoukak':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Terrasse, Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Supérieure Tafza':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Terrasse, Salle de bains, douche',
          'Climatisation, Coffre-Fort'
        ];
        break;
      case 'Suite Oukaimden':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Salle de bains, douche',
          'Climatisation, Minibar'
        ];
        break;
      case 'Suite Toubkal':
        this.bookingDetails.roomFeatures = [
          'Lit king-size',
          'Télévision, Wi-Fi',
          'Salle de bains, douche',
          'Climatisation, Minibar'
        ];
        break;
      default:
        this.bookingDetails.roomFeatures = [];
    }
  }

  async processReservation() {
    this.showLoadingDialog = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.showLoadingDialog = false;
      this.showSuccessDialog = true;
    } catch (error) {
      this.showLoadingDialog = false;
      // Handle error appropriately
      console.error('Reservation failed:', error);
    }
  }
}
