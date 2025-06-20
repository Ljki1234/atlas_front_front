import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-dialog">
      <div class="spinner"></div>
      <p>Veuillez patienter un instant, votre réservation est en cours de validation</p>
    </div>
  `,
  styles: [`
    .loading-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    p {
      color: white;
      font-size: 1.2em;
      text-align: center;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingDialogComponent {}
