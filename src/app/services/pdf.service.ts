import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateReservationPDF(reservation: any): string {
    const doc = new jsPDF();
    let y = 15;
    const lineHeight = 8;
    const margin = 15;
    const bulletMargin = 25;
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const atlasFrontText = 'ATLAS FRONT';
    const atlasFrontWidth = doc.getTextWidth(atlasFrontText);
    const atlasFrontX = pageWidth / 2;
    doc.text(atlasFrontText, atlasFrontX, y, { align: 'center' });
    doc.line(atlasFrontX - atlasFrontWidth / 2, y + 1, atlasFrontX + atlasFrontWidth / 2, y + 1);

    y += lineHeight * 1.5;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const confirmationText = 'Confirmation de Réservation';
    const confirmationWidth = doc.getTextWidth(confirmationText);
    const confirmationX = pageWidth / 2;
    doc.text(confirmationText, confirmationX, y, { align: 'center' });
    doc.line(confirmationX - confirmationWidth / 2, y + 1, confirmationX + confirmationWidth / 2, y + 1);

    y += lineHeight * 2;

    // Section styling
    const drawSection = (title: string, content: () => void) => {
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      content();
      y += lineHeight;
    };

    // Reservation Details
    drawSection('Détails de la Réservation', () => {
      doc.text(`• Suite: ${reservation.suite?.description || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Réservé pour : ${reservation.bookingType === 'mainGuest' ? 'Moi-même (Hôte Principal)' : 'Quelqu\'un d\'autre (Réservation Tierce)'}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Heure d'arrivée prévue: ${reservation.arrivalTime || ''}`, bulletMargin, y);
    });

    // Pricing
    drawSection('Tarifs', () => {
      const servicesTotal = reservation.additionalServices?.reduce((sum: number, service: any) => sum + service.price, 0) || 0;
      const total = (reservation.basePrice || 0) + servicesTotal;
      
      doc.text(`• Prix de Base: ${reservation.basePrice?.toFixed(2) || '0.00'}€`, bulletMargin, y);
      y += lineHeight;
      if (servicesTotal > 0) {
        doc.text(`• Services Supplémentaires: ${servicesTotal.toFixed(2)}€`, bulletMargin, y);
        y += lineHeight;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• Total: ${total.toFixed(2)}€`, bulletMargin, y);
    });

    // Additional Services
    if (reservation.additionalServices?.length > 0) {
      drawSection('Services Supplémentaires', () => {
        reservation.additionalServices.forEach((service: any) => {
          doc.text(`• ${service.name}: ${service.price}€`, bulletMargin, y);
          y += lineHeight;
        });
      });
    }

    // Personal Information
    drawSection('Informations Personnelles', () => {
      doc.text(`• Prénom: ${reservation.client?.firstName || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Nom de famille: ${reservation.client?.lastName || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Email: ${reservation.client?.email || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Téléphone: ${reservation.client?.tel || ''}`, bulletMargin, y);
    });

    // Address
    drawSection('Adresse', () => {
      doc.text(`• Rue: ${reservation.client?.address || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Ville: ${reservation.client?.city || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Code Postal: ${reservation.client?.postalCode || ''}`, bulletMargin, y);
      y += lineHeight;
      doc.text(`• Pays: ${this.getCountryFullName(reservation.client?.country)}`, bulletMargin, y);
    });

    // Add contact information
    y += lineHeight * 2; // Add some space before contact info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Pour toute question, veuillez nous contacter :', pageWidth / 2, y, { align: 'center' }); // Add translated contact intro
    y += lineHeight;
    doc.text('Email: contact@atlas.com', pageWidth / 2, y, { align: 'center' }); // Add email
    
    // Return the PDF as base64 string
    return doc.output('datauristring').split(',')[1];
  }

  // Simple function to convert country code to full name for common countries
  private getCountryFullName(countryCode?: string): string {
    if (!countryCode) {
      return '';
    }
    const countryMap: { [key: string]: string } = {
      'MA': 'Maroc',
      'FR': 'France',
      'BE': 'Belgique',
      'ES': 'Espagne',
      'UK': 'Royaume-Uni', // Added UK
      'US': 'États-Unis', // Added US
      'DE': 'Allemagne', // Added DE
      'CA': 'Canada', // Added CA
      // Add more country codes and names as needed
    };
    const upperCaseCode = countryCode.toUpperCase();
    return countryMap[upperCaseCode] || countryCode; // Return code if not in map
  }
} 