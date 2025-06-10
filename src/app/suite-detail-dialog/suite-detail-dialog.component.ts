import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface SuiteDialogData {
  image: string;
  name: string;
  equipments: string[];
}

@Component({
  selector: 'app-suite-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogClose, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title>{{ data.name }}</h2>
    <mat-dialog-content>
      <img [src]="data.image" [alt]="data.name" style="max-width: 100%; height: auto; margin-bottom: 16px;">
      <h3 *ngIf="data.equipments && data.equipments.length > 0">Équipements :</h3>
      <ul *ngIf="data.equipments && data.equipments.length > 0">
        <li *ngFor="let item of data.equipments">{{ item }}</li>
      </ul>
      <p *ngIf="!data.equipments || data.equipments.length === 0">Aucun équipement listé pour cette suite.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styleUrl: './suite-detail-dialog.component.css'
})
export class SuiteDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuiteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuiteDialogData
  ) {}
}
