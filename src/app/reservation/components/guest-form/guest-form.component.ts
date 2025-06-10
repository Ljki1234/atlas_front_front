import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { EmailService } from '../../../services/email.service';
import { PdfService } from '../../../services/pdf.service';

declare var paypal: any;

interface AdditionalService {
  id: number;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class GuestFormComponent implements OnInit {
  @Input() suitePrice: number = 0;
  @Input() nightCount: number = 0;
  @Input() vatPercentage: number = 0;
  
  guestForm: FormGroup;
  formValid: boolean = false;
  paypalRendered: boolean = false;
  totalPrice: number = 0;
  basePrice: number = 0;
  suiteDescription: string = '';
  additionalServices: AdditionalService[] = [
    {
      id: 1,
      name: 'Petit-déjeuner',
      description: 'Petit-déjeuner buffet continental',
      price: 25,
      selected: false
    },
    {
      id: 2,
      name: 'Transfert aéroport',
      description: 'Service de transfert aller-retour depuis l\'aéroport',
      price: 50,
      selected: false
    },
    {
      id: 3,
      name: 'Massage',
      description: 'Massage relaxant de 60 minutes',
      price: 80,
      selected: false
    }
  ];
  selectedServices: AdditionalService[] = [];
  startDate: string = '';
  endDate: string = '';
  isProcessing: boolean = false;
  errorMessage: string = '';

  @ViewChild('paypalContainer') paypalContainer!: ElementRef;

  @Output() paymentSuccess = new EventEmitter<void>();

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' }
  ];

  arrivalTimes = [
    { value: '14:00-15:00', label: '2:00 PM - 3:00 PM' },
    { value: '15:00-16:00', label: '3:00 PM - 4:00 PM' },
    { value: '16:00-17:00', label: '4:00 PM - 5:00 PM' },
    { value: '17:00-18:00', label: '5:00 PM - 6:00 PM' },
    { value: '18:00-19:00', label: '6:00 PM - 7:00 PM' },
    { value: '19:00-20:00', label: '7:00 PM - 8:00 PM' },
    { value: '20:00-21:00', label: '8:00 PM - 9:00 PM' },
    { value: '21:00-22:00', label: '9:00 PM - 10:00 PM' },
    { value: '22:00-23:00', label: '10:00 PM - 11:00 PM' },
    { value: '23:00-00:00', label: '11:00 PM - 12:00 AM' }
  ];

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private http: HttpClient,
    private emailService: EmailService,
    private router: Router,
    private pdfService: PdfService
  ) {
    this.guestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      specialRequests: [''],
      arrivalTime: ['', Validators.required],
      isBusinessTrip: [false],
      bookingType: ['mainGuest'],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['suiteDescription']) {
        this.suiteDescription = params['suiteDescription'];
      }
      // Calcul du prix de base = (nombre de nuits * prix de suite) + TVA
      const baseAmount = this.suitePrice * this.nightCount;
      const vatAmount = (baseAmount * this.vatPercentage) / 100;
      this.basePrice = baseAmount + vatAmount;
      // Initialiser le prix total avec le prix de base
      this.totalPrice = this.basePrice;

      if (params['startDate']) {
        this.startDate = params['startDate'];
      }
      if (params['endDate']) {
        this.endDate = params['endDate'];
      }
    });

    this.guestForm.valueChanges.subscribe(() => {
      this.formValid = this.guestForm.valid;
    });
  }

  onServiceSelectionChange(service: AdditionalService): void {
    service.selected = !service.selected;
    this.updateSelectedServices();
    this.updateTotalPrice();
  }

  private updateSelectedServices(): void {
    this.selectedServices = this.additionalServices.filter(service => service.selected);
  }

  private updateTotalPrice(): void {
    // Le prix total est le prix de base plus les services additionnels
    const servicesTotal = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
    this.totalPrice = this.basePrice + servicesTotal;
  }

  getServicesTotal(): number {
    return this.selectedServices.reduce((sum, service) => sum + service.price, 0);
  }

  onSubmit() {
    if (this.guestForm.valid) {
      this.formValid = true;
      this.isProcessing = true;

      // Scroll to PayPal container
      setTimeout(() => {
        if (this.paypalContainer) {
          this.paypalContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
        this.loadPayPalButton();
      }, 100);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.guestForm.controls).forEach(key => {
        const control = this.guestForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  loadPayPalButton(): void {
    if (this.paypalRendered) return;

    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalPrice.toFixed(2),
              currency_code: 'EUR'
            },
            description: `Réservation - ${this.suiteDescription}`
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.handlePaymentSuccess(details);
        });
      },
      onError: (err: any) => {
        console.error('PayPal Error:', err);
        this.errorMessage = 'Une erreur est survenue lors du paiement. Veuillez réessayer.';
        this.isProcessing = false;
      }
    }).render(this.paypalContainer.nativeElement)
      .then(() => {
        this.paypalRendered = true;
        this.isProcessing = false;
      })
      .catch((err: any) => {
        console.error('PayPal Render Error:', err);
        this.errorMessage = 'Impossible de charger PayPal. Veuillez réessayer.';
        this.isProcessing = false;
      });
  }

  async generateReservationPDF(reservationData: any): Promise<string> {
    try {
      console.log('Starting PDF generation...');
      const doc = new jsPDF();

      // Add content to PDF
      const margin = 20;
      let yPosition = 20;

      // Add header
      doc.setFontSize(20);
      doc.text('Reservation Confirmation', margin, yPosition);
      yPosition += 20;

      // Add reservation details
      doc.setFontSize(12);
      doc.text('Reservation Details:', margin, yPosition);
      yPosition += 10;

      const details = [
        ['Suite', reservationData.suite.description],
        ['Check-in Date', this.formatDate(reservationData.startDate)],
        ['Check-out Date', this.formatDate(reservationData.endDate)],
        ['Number of Guests', reservationData.numberOfGuests.toString()],
        ['Expected Arrival Time', reservationData.arrivalTime || 'Not specified'],
        ['Payment Method', reservationData.payment.paymentMethod || 'PayPal']
      ];

      details.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, margin, yPosition);
        yPosition += 10;
      });

      // Add client information
      yPosition += 10;
      doc.text('Client Information:', margin, yPosition);
      yPosition += 10;

      const clientDetails = [
        ['Name', reservationData.client.fullName],
        ['Email', reservationData.client.email],
        ['Phone', reservationData.client.tel],
        ['Address', reservationData.client.address],
        ['City', reservationData.client.city],
        ['Postal Code', reservationData.client.postalCode],
        ['Country', reservationData.client.country]
      ];

      clientDetails.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, margin, yPosition);
        yPosition += 10;
      });

      // Add total amount
      yPosition += 10;
      doc.text(`Total Amount: ${reservationData.payment.amount.toFixed(2)} €`, margin, yPosition);
      yPosition += 20;

      // Add thank you message
      doc.text('Thank you for choosing our hotel. We look forward to welcoming you!', margin, yPosition);
      yPosition += 10;

      // Add contact information
      doc.text('For any questions, please contact us at:', margin, yPosition);
      yPosition += 10;
      doc.text('contact@hotel.com', margin, yPosition);
      yPosition += 10;
      doc.text('Phone: +212 123-456-789', margin, yPosition);

      const pdfOutput = doc.output('datauristring');
      const base64Content = pdfOutput.split(',')[1];

      console.log('PDF generated successfully');
      return base64Content;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return '';
    }
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  handlePaymentSuccess(paymentDetails: any) {
    console.log('Payment successful:', paymentDetails);
    this.isProcessing = true;
    this.paymentSuccess.emit();


    const firstName = this.guestForm.get('firstName')?.value;
    const lastName = this.guestForm.get('lastName')?.value;
    const clientEmail = this.guestForm.get('email')?.value;
    const arrivalTime = this.guestForm.get('arrivalTime')?.value;

    const pdfBase64 = this.pdfService.generateReservationPDF({
      client: {
        fullName: `${firstName} ${lastName}`.trim(),
        firstName: firstName,
        lastName: lastName,
        email: clientEmail,
        tel: this.guestForm.get('phone')?.value,
        address: this.guestForm.get('address')?.value,
        city: this.guestForm.get('city')?.value,
        postalCode: this.guestForm.get('postalCode')?.value,
        country: this.guestForm.get('country')?.value
      },
      suite: {
        description: this.suiteDescription
      },
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: parseInt(this.route.snapshot.queryParams['numberOfGuests']),
      payment: {
        amount: this.totalPrice,
        transactionId: paymentDetails.id,
        paymentMethod: 'PayPal',
        paymentDate: new Date().toISOString()
      },
      additionalServices: this.selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        description: service.description
      })),
      arrivalTime: arrivalTime,
      bookingType: this.guestForm.get('bookingType')?.value,
      specialRequests: this.guestForm.get('specialRequests')?.value,
      isBusinessTrip: this.guestForm.get('isBusinessTrip')?.value,
      basePrice: this.basePrice
    });

    // Create reservation DTO with PDF data
    const reservationDto = {
      client: {
        fullName: `${firstName} ${lastName}`.trim(),
        firstName: firstName,
        lastName: lastName,
        email: clientEmail,
        tel: this.guestForm.get('phone')?.value,
        address: this.guestForm.get('address')?.value,
        city: this.guestForm.get('city')?.value,
        postalCode: this.guestForm.get('postalCode')?.value,
        country: this.guestForm.get('country')?.value
      },
      suite: {
        description: this.suiteDescription
      },
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: parseInt(this.route.snapshot.queryParams['numberOfGuests']),
      payment: {
        amount: this.totalPrice,
        transactionId: paymentDetails.id,
        paymentMethod: 'PayPal',
        paymentDate: new Date().toISOString()
      },
      additionalServices: this.selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        description: service.description
      })),
      arrivalTime: arrivalTime,
      bookingType: this.guestForm.get('bookingType')?.value,
      specialRequests: this.guestForm.get('specialRequests')?.value,
      isBusinessTrip: this.guestForm.get('isBusinessTrip')?.value,
      basePrice: this.basePrice,
      pdfData: pdfBase64
    };


    this.http.post<{id: number}>('http://localhost:8080/api/reservations/save', reservationDto)
      .subscribe({
        next: async (response) => {
          console.log('Reservation saved:', response);
          this.isProcessing = false;
          this.router.navigate(['/confirmation'], {
            queryParams: {
              reservationId: response.id,
              email: clientEmail
            }
          });
        },
        error: (error) => {
          console.error('Error saving reservation:', error);
          this.isProcessing = false;
          this.errorMessage = 'Erreur lors de la sauvegarde de la réservation. Veuillez réessayer.';
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.guestForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
