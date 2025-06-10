import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pdf-container">
      <div class="pdf-header">
        <div class="logo">
          <img src="assets/images/logo.png" alt="Hotel Logo">
        </div>
        <h1>Confirmation de Réservation</h1>
      </div>

      <div class="pdf-content">
        <div class="section">
          <h2>Détails de la Réservation</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Suite:</span>
              <span class="value">{{ reservation?.suite }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date d'arrivée:</span>
              <span class="value">{{ reservation?.checkInDate | date:'longDate' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date de départ:</span>
              <span class="value">{{ reservation?.checkOutDate | date:'longDate' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Nombre de personnes:</span>
              <span class="value">{{ reservation?.numberOfGuests }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Heure d'arrivée prévue:</span>
              <span class="value">{{ reservation?.arrivalTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Mode de paiement:</span>
              <span class="value">{{ reservation?.paymentMethod }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Type de Réservation:</span>
              <span class="value">{{ reservation?.reservationType }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Voyage d'affaires:</span>
              <span class="value">{{ reservation?.businessTrip ? 'Oui' : 'Non' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Demandes Spéciales:</span>
              <span class="value">{{ reservation?.specialRequests }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Tarifs</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Prix de Base:</span>
              <span class="value">{{ reservation?.basePrice | currency:'EUR' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Services Supplémentaires:</span>
              <span class="value">{{ reservation?.additionalServicesTotal | currency:'EUR' }}</span>
            </div>
            <div class="detail-item total-amount">
              <span class="label">Total:</span>
              <span class="value">{{ reservation?.totalAmount | currency:'EUR' }}</span>
            </div>
          </div>
        </div>

        <div class="section" *ngIf="reservation?.additionalServices && reservation.additionalServices.length > 0">
          <h2>Services Supplémentaires Détails</h2>
          <div class="details-grid">
            <div class="detail-item" *ngFor="let service of reservation.additionalServices">
              <span class="label">{{ service.name }}:</span>
              <span class="value">{{ service.price | currency:'EUR' }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Informations Personnelles</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Prénom:</span>
              <span class="value">{{ reservation?.clientFirstName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Nom de famille:</span>
              <span class="value">{{ reservation?.clientLastName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{{ reservation?.clientEmail }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Téléphone:</span>
              <span class="value">{{ reservation?.clientPhone }}</span>
            </div>
          </div>
        </div>

        <div class="section" *ngIf="reservation?.clientAddress || reservation?.clientCity || reservation?.clientPostalCode || reservation?.clientCountry">
          <h2>Adresse</h2>
          <div class="details-grid">
            <div class="detail-item" *ngIf="reservation?.clientAddress">
              <span class="label">Rue:</span>
              <span class="value">{{ reservation?.clientAddress }}</span>
            </div>
            <div class="detail-item" *ngIf="reservation?.clientCity">
              <span class="label">Ville:</span>
              <span class="value">{{ reservation?.clientCity }}</span>
            </div>
            <div class="detail-item" *ngIf="reservation?.clientPostalCode">
              <span class="label">Code Postal:</span>
              <span class="value">{{ reservation?.clientPostalCode }}</span>
            </div>
            <div class="detail-item" *ngIf="reservation?.clientCountry">
              <span class="label">Pays:</span>
              <span class="value">{{ reservation?.clientCountry }}</span>
            </div>
          </div>
        </div>

        <div class="section footer">
          <div class="contact-info">
            <p>Pour toute question, veuillez nous contacter :</p>
            <p>Email: contact@Atlas.com</p>
            <p>Téléphone: +212 123-456-789</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pdf-container {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #2d3748;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
    }

    .pdf-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .logo {
      margin-bottom: 1.5rem;
    }

    .logo img {
      max-width: 200px;
      height: auto;
    }

    h1 {
      font-size: 2.5rem;
      color: #2d3748;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .section {
      margin-bottom: 2.5rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #4a5568;
      font-weight: 600;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #edf2f7;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label {
      font-size: 0.9rem;
      color: #718096;
      font-weight: 500;
    }

    .value {
      font-size: 1.1rem;
      color: #2d3748;
      font-weight: 600;
    }

    .total-section {
      background: #f8fafc;
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
    }

    .total-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-amount .label {
      font-size: 1.2rem;
    }

    .total-amount .value {
      font-size: 1.5rem;
      color: #2d3748;
    }

    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #e2e8f0;
    }

    .contact-info {
      color: #718096;
      font-size: 1rem;
      line-height: 1.6;
    }

    .contact-info p {
      margin: 0.5rem 0;
    }

    @media print {
      .pdf-container {
        padding: 0;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  `]
})
export class PdfTemplateComponent {
  @Input() reservation?: {
    suite: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    arrivalTime: string;
    paymentMethod: string;
    reservationType?: string;
    businessTrip?: boolean;
    specialRequests?: string;
    transactionId?: string;
    basePrice?: number;
    additionalServicesTotal?: number;
    additionalServices?: { name: string, price: number }[];
    clientFirstName?: string;
    clientLastName?: string;
    clientAddress?: string;
    clientCity?: string;
    clientPostalCode?: string;
    clientCountry?: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    totalAmount: number;
  };
}
