import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface EmailData {
  to: string;
  subject: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/email';
  private adminEmail = 'admin@hotel.com'; // Replace with actual admin email

  constructor(private http: HttpClient) { }

  sendReservationConfirmation(
    email: string,
    pdfBase64: string,
    reservationDetails: any
  ): Observable<any> {
    // Format dates
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Format client name
    const clientFullName = reservationDetails.client ? 
      `${reservationDetails.client.firstName} ${reservationDetails.client.lastName}`.trim() : 
      'N/A';

    // Create email body with all details in French
    const emailBody = `Détails de la réservation :
Client : ${clientFullName}
Email : ${reservationDetails.client?.email || 'N/A'}
Téléphone : ${reservationDetails.client?.tel || 'N/A'}
Suite : ${reservationDetails.suite?.description || 'N/A'}

Dates : du ${formatDate(reservationDetails.startDate)} au ${formatDate(reservationDetails.endDate)}
Nombre de personnes : ${reservationDetails.numberOfGuests}
Montant payé : ${reservationDetails.payment?.amount?.toFixed(2) || '0.00'} EUR
Transaction ID : ${reservationDetails.payment?.transactionId || 'N/A'}
Heure d'arrivée prévue : ${reservationDetails.arrivalTime || 'Non spécifiée'}

Adresse : ${reservationDetails.client?.address || 'N/A'}
Ville : ${reservationDetails.client?.city || 'N/A'}
Code postal : ${reservationDetails.client?.postalCode || 'N/A'}
Pays : ${reservationDetails.client?.country || 'N/A'}`;

    // Create email data with PDF attachment
    const emailData = {
      to: [email, this.adminEmail],
      subject: 'Confirmation de réservation',
      body: emailBody,
      attachments: [{
        filename: 'reservation-confirmation.pdf',
        content: pdfBase64,
        contentType: 'application/pdf'
      }]
    };

    console.log('Sending email with data:', {
      to: emailData.to,
      subject: emailData.subject,
      hasPdf: !!emailData.attachments[0]?.content,
      pdfSize: emailData.attachments[0]?.content?.length
    });

    return this.http.post(`${this.apiUrl}/send-reservation-confirmation`, emailData);
  }

  sendConfirmationEmail(emailData: EmailData): Observable<any> {
    return this.http.post('http://localhost:8080/api/email/send-confirmation', emailData);
  }
} 