import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ReservationFailureDialogData {
  message: string;
}

@Component({
  selector: 'app-reservation-failure-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogClose, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title>Erreur de Réservation</h2>
    <mat-dialog-content>
      <p>Une erreur est survenue lors de votre réservation.</p>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styleUrl: './reservation-failure-dialog.component.css'
})
export class ReservationFailureDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReservationFailureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReservationFailureDialogData
  ) {}
}
