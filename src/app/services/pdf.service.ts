import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateReservationPDF(reservation: any): string {
    const doc = new jsPDF();
    let y = 15;
    const lineHeight = 7; // Adjusted for denser layout
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const lightGrey = 245; // For light grey backgrounds
    const blueColor = [0, 71, 171]; // Booking.com blue
    const darkGreyText = [51, 51, 51];
    const mediumGreyText = [117, 117, 117];

    // Top Header Area
    doc.setFontSize(9);
    doc.setTextColor(mediumGreyText[0], mediumGreyText[1], mediumGreyText[2]);
    doc.text(new Date().toLocaleDateString('fr-FR'), margin, y);
    doc.text('ATLAS FRONT: Confirmation de Réservation', pageWidth - margin, y, { align: 'right' });
    y += 10;

    // ATLAS FRONT Logo Area
    doc.setFillColor(blueColor[0], blueColor[1], blueColor[2]);
    doc.rect(0, y - 5, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ATLAS FRONT', margin, y + 7);
    doc.setFontSize(8);
    doc.text('réservations en ligne', margin, y + 14); // Mimic "online hotel reservations"
    y += 20;

    // Breadcrumbs (Simplified)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
    doc.text('Accueil > Maroc > Marrakech > ATLAS FRONT > Confirmation de réservation', margin, y);
    y += 15;

    // Progress Steps
    const stepWidth = (pageWidth - margin * 2) / 4;
    const stepY = y;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mediumGreyText[0], mediumGreyText[1], mediumGreyText[2]);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);

    const steps = [
      { label: '1. Sélection de la Suite', active: false },
      { label: '2. Vos Détails', active: false },
      { label: '3. Contact', active: false },
      { label: '4. Confirmation', active: true } // Assuming this is the current step
    ];

    steps.forEach((step, index) => {
      const x = margin + index * stepWidth;
      doc.rect(x, stepY, stepWidth, 10);
      if (step.active) {
        doc.setFillColor(255, 255, 153); // Light yellow for active step
        doc.rect(x, stepY, stepWidth, 10, 'F');
        doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);
      } else {
        doc.setTextColor(mediumGreyText[0], mediumGreyText[1], mediumGreyText[2]);
      }
      doc.text(step.label, x + stepWidth / 2, stepY + 6, { align: 'center' });
    });
    y += 20; // Space after steps

    // Booking Confirmation Section
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 100); // Main section box
    doc.setFillColor(lightGrey, lightGrey, lightGrey); // Light grey for header
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);
    doc.text('Confirmation de réservation', margin + 3, y + 1);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci pour votre réservation', margin + 3, y);

    const bookingConfDetails = [
      ['Numéro de réservation: ', Math.floor(100000 + Math.random() * 900000)],
      // ['Code confidentiel', '2954'], // If a pincode is available
      ['Confirmation le:', new Date().toLocaleDateString('fr-FR')],
      ['Nom:', `${reservation.client?.firstName || ''} ${reservation.client?.lastName || ''}`.trim()],
      ['Email:', reservation.client?.email || 'N/A'],
      ['Rue:', reservation.client?.address || 'N/A'],
      ['Ville:', reservation.client?.city || 'N/A'],
      ['Pays:', this.getCountryFullName(reservation.client?.country)]
    ];

    bookingConfDetails.forEach(([label, value]) => {
      y += lineHeight; // Increment y for each detail line
      doc.text(label, margin + 5, y);
      doc.text(value.toString(), pageWidth / 2, y, { align: 'left' }); // Aligned to the left
    });
    y += 10; // Reduced space after details

    // Removed Hotel Information Section (Simplified "Your booking" section)
    // y += 5;
    // doc.setDrawColor(200, 200, 200);
    // doc.rect(margin, y - 5, pageWidth - margin * 2, 70); // Main section box
    // doc.setFillColor(lightGrey, lightGrey, lightGrey); // Light grey for header
    // doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');

    // doc.setFontSize(10);
    // doc.setFont('helvetica', 'bold');
    // doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);

    // const hotelInfo = [
    //   ['Hôtel', 'ATLAS FRONT'],
    //   ['Adresse', 'Marrakech, Maroc'],
    //   ['Téléphone', reservation.client?.tel || 'N/A'], // Using client tel as proxy
    //   ['E-mail', 'contact@atlas.com']
    // ];

    // hotelInfo.forEach(([label, value]) => {
    //   doc.text(label, margin + 5, y);
    //   doc.text(value.toString(), margin + 40, y);
    //   y += lineHeight;
    // });
    // y += 10;

    // Your Reservation Details Section
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 60); // Increased height for better spacing
    doc.setFillColor(lightGrey, lightGrey, lightGrey); // Light grey for header
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);
    doc.text('Détails de votre réservation', margin + 3, y + 1);
    y += 8; // Slightly increased space after header

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(33, 33, 33);

    // Suite
    doc.text(`Suite:`, margin + 5, y);
    doc.text(reservation.suite?.description || 'N/A', margin + 65, y);
    y += lineHeight; // Reduced space after Suite

    // Réservé pour
    doc.text(`Réservé pour:`, margin + 5, y);
    doc.text(reservation.bookingType === 'mainGuest' ? 'Moi-même (Hôte Principal)' : 'Quelqu\'un d\'autre (Réservation Tierce)', margin + 65, y);
    y += lineHeight * 2; // Increased space after Réservé pour

    // Heure d'arrivée prévue
    doc.text(`Heure d'arrivée prévue:`, margin + 5, y);
    doc.text(reservation.arrivalTime || 'Non spécifiée', margin + 65, y);
    y += lineHeight; // Consistent line spacing

    // Arrivée
    doc.text(`Arrivée:`, margin + 5, y);
    doc.text(this.formatDate(reservation.startDate), margin + 65, y);
    y += lineHeight; // Consistent line spacing

    // Départ
    doc.text(`Départ:`, margin + 5, y);
    doc.text(this.formatDate(reservation.endDate), margin + 65, y);
    // Moved Total Costs Section content here
    y += 15;

    // Total Costs Section
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 35); // Main section box
    doc.setFillColor(lightGrey, lightGrey, lightGrey); // Light grey for header
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);
    doc.text('Total', margin + 3, y + 1);
    const nightsAmount = this.calculateNights(reservation.startDate, reservation.endDate) * (reservation.basePrice || 0);
    const servicesTotal = reservation.additionalServices?.reduce((sum: number, service: any) => sum + service.price, 0) || 0;
    const total = nightsAmount + servicesTotal;
    doc.text(`${total.toFixed(2)}€`, pageWidth - margin - 5, y + 1, { align: 'right' });
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prix de base`, margin + 5, y);
    doc.text(`${nightsAmount.toFixed(2)}€`, pageWidth - margin - 5, y, { align: 'right' });
    y += lineHeight;

    if (reservation.additionalServices?.length > 0) {
      reservation.additionalServices.forEach((service: any) => {
        doc.text(`${service.name}`, margin + 5, y);
        doc.text(`${service.price?.toFixed(2)}€`, pageWidth - margin - 5, y, { align: 'right' });
        y += lineHeight;
      });
    }
    y += 5;

    // Room/Guest Details Section
    /*y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 35); // Main section box
    doc.setFillColor(lightGrey, lightGrey, lightGrey); // Light grey for header
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGreyText[0], darkGreyText[1], darkGreyText[2]);
    doc.text(`Suite: ${reservation.suite?.description || 'N/A'}`, margin + 3, y + 1);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom du client: ${reservation.client?.firstName || ''} ${reservation.client?.lastName || ''}`.trim(), margin + 5, y);
    y += lineHeight;
    doc.text(`Petit-déjeuner: ${reservation.additionalServices?.some((s:any) => s.name.toLowerCase().includes('petit-déjeuner')) ? 'Inclus dans le prix de la chambre' : 'Non inclus'}`, margin + 5, y); // Check for breakfast service
    y += 10;*/

    // Footer
    y = doc.internal.pageSize.height - 20;
    doc.setFontSize(9);
    doc.setTextColor(mediumGreyText[0], mediumGreyText[1], mediumGreyText[2]);

    // Email
    doc.text('Email: contact@atlas.com', pageWidth / 2, y, { align: 'center' });
    y += lineHeight;

    // Address
    doc.text('Adresse: Km 26 Douar Ait Zatte, Commune de Ghmat Marrakech, Maroc', pageWidth / 2, y, { align: 'center' });
    y += lineHeight; // Space for additional footer information


    doc.text('© 2025 ATLAS FRONT. Tous droits réservés.', pageWidth / 2, y, { align: 'center' });

    return doc.output('datauristring').split(',')[1];
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getCountryFullName(countryCode: string): string {
    const countries: { [key: string]: string } = {
      'Maroc': 'Maroc',
      'France': 'France',
      'États-Unis': 'États-Unis',
      'Royaume-Uni': 'Royaume-Uni',
      'Espagne': 'Espagne',
      'Allemagne': 'Allemagne',
      'Italie': 'Italie',
      'Belgique': 'Belgique',
      'Suisse': 'Suisse',
      'Canada': 'Canada'
    };
    return countries[countryCode] || countryCode;
  }
}
