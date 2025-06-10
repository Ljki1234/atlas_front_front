import {Component, Inject, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import {Reservation} from '../models/Reservation.model';
import {ReservationService} from '../module/module-reservation/module-reservation.service';
import {ReservationWithClientDto} from '../module/module-reservation/models/ReservationWithClientDto.model';
import {BookingCheckService} from '../module/module-suite/models/booking-check.service';
import { ReservationSuccessDialogComponent } from '../reservation-success-dialog/reservation-success-dialog.component';
import { ReservationFailureDialogComponent } from '../reservation-failure-dialog/reservation-failure-dialog.component';


declare var paypal: any;
@Component({
  selector: 'app-user-dialog',
  standalone: true,
  templateUrl: './user-dialog.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,  // ✅ Import nécessaire
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
})
export class UserDialogComponent implements OnInit {
  suiteDescription: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  suitePrice: number;
  totalPrice: number = 0;
  formValid: boolean = false;
  paypalRendered: boolean = false;
  guests!: number;
  userId! : number;
  selectedSuite!: any;

  user = {
    fullName: '',
    email: '',
    tel: ''
  };

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private bookingCheck: BookingCheckService
  ) {
    this.suiteDescription = data.suiteDescription;
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.numberOfGuests = data.numberOfGuests;
    this.suitePrice = data.suitePrice;
  }
  @ViewChild('paypalContainer') paypalContainer!: ElementRef;
  ngOnInit(): void {
    this.calculateTotalPrice();
  }
  openUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, { // utiliser this.dialog et non this.dialogRef
      data: {
        suiteDescription:this.suiteDescription,
        startDate: this.startDate,
        endDate: this.endDate,
        numberOfGuests: this.guests,
        suitePrice: this.suitePrice
      }
    });

    dialogRef.afterClosed().subscribe((result: Reservation) => {
      if (result) {
        console.log('Réservation reçue dans parent :', result);
        console.log('Montant payé:', result.payment?.amount);
      }
    });
  }
  calculateTotalPrice(): void {
    const oneDay = 24 * 60 * 60 * 1000;
    const diff = (this.endDate.getTime() - this.startDate.getTime()) / oneDay;
    const nights = Math.max(1, Math.round(diff));
    this.totalPrice = nights * this.suitePrice;
  }

  onSubmit(): void {
    if (this.user.fullName && this.user.email && this.user.tel) {
      this.formValid = true;

      setTimeout(() => {
        this.loadPayPalButton();

        if (this.paypalContainer) {
          this.paypalContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  loadPayPalButton(): void {
    if (this.paypalRendered) return;
    this.paypalRendered = true;

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalPrice.toFixed(2),
              currency_code: 'EUR'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.handlePaymentSuccess(details);
        });
      }
    }).render(this.paypalContainer.nativeElement);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
  handlePaymentSuccess(details: any): void {
    const reservationDto = {
      startDate: this.startDate.toISOString().split('T')[0],
      endDate: this.endDate.toISOString().split('T')[0],
      numberOfGuests: this.numberOfGuests,
      reservationSource: 'SITE_WEB',
      //dateCreated: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      client: {
        fullName: this.user.fullName,
        email: this.user.email,
        tel: this.user.tel
      },
      suite: {
        description: this.suiteDescription
      },
      payment: {
        amount: this.totalPrice,
        transactionId: details.id,
        paymentDate: new Date().toISOString().split('T')[0],
        statuts: 'PAYE',
        currency: 'EUR'
      }
    };

    this.http.post<Reservation>('http://localhost:8080/api/reservations/save', reservationDto).subscribe({
      next: (data) => {
        console.log('Réservation enregistrée avec succès', data);
        this.dialogRef.close({ success: true, reservation: data });
        this.dialog.open(ReservationSuccessDialogComponent);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la réservation :', err);
        this.dialogRef.close({ success: false, message: err.error?.message || err.message || 'Une erreur inconnue est survenue.' });
        this.dialog.open(ReservationFailureDialogComponent, {
          data: { message: err.error?.message || err.message || 'Une erreur inconnue est survenue.' }
        });
      }
    });
  }

  payWithPaypalViaBackend(): void {
    const paymentRequest = {
      amount: this.totalPrice,
      currency: 'EUR'
    };

    this.http.post<{ approvalUrl: string }>(
      'http://localhost:8080/api/payment/create',
      paymentRequest
    ).subscribe({
      next: (response) => {
        if (response && response.approvalUrl) {
          window.location.href = response.approvalUrl; // 🚀 Redirection directe vers PayPal
        } else {
          alert("Erreur : aucune URL de redirection reçue.");
        }
      },
      error: (error) => {
        console.error("Erreur lors de la création du paiement :", error);
        alert("Erreur de paiement.");
      }
    });
  }
  createReservation(): void {
    if (!this.selectedSuite?.id) {
      alert("Vous devez sélectionner une suite.");
      return;
    }
  }

}
