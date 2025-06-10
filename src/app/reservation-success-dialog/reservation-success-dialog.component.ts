import { Component } from '@angular/core';
import { MatDialogRef, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reservation-success-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogClose, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title>Réservation Confirmée !</h2>
    <mat-dialog-content>
      <p>Votre réservation a été effectuée avec succès.</p>
      <p>Un email de confirmation a été envoyé à votre adresse.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styleUrl: './reservation-success-dialog.component.css'
})
export class ReservationSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<ReservationSuccessDialogComponent>) {}
}
