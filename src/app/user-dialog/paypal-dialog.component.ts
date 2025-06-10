import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare var paypal: any;

@Component({
  selector: 'app-paypal-dialog',
  template: `
    <h2>Paiement</h2>
    <div id="paypal-button-container"></div>
  `
})
export class PaypalDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PaypalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Attendre que paypal soit disponible
    if (typeof paypal !== 'undefined') {
      this.renderPayPalButton();
    } else {
      // Attendre un peu puis réessayer
      const interval = setInterval(() => {
        if (typeof paypal !== 'undefined') {
          clearInterval(interval);
          this.renderPayPalButton();
        }
      }, 500);
    }
  }

  renderPayPalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.data.totalPrice.toFixed(2),
              currency_code: 'EUR'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          const transactionId = details.id;
          const paymentDate = new Date().toISOString().split('T')[0];
          this.dialogRef.close({
            transactionId,
            paymentDate,
            ...this.data
          });
        });
      },
      onError: (err: any) => {
        console.error('Erreur PayPal :', err);
      }
    }).render('#paypal-button-container');
  }
}
