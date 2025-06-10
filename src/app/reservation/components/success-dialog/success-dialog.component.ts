import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-dialog">
      <div class="success-content">
        <div class="success-icon">✓</div>
        <h2>Réservation réussie !</h2>
        <p>Votre réservation a été confirmée. Merci d'avoir choisi Atlas Front !</p>
        <button (click)="goToHome()">Retour à l'accueil</button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .success-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }

    .success-icon {
      width: 60px;
      height: 60px;
      background: #4CAF50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 2rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    button {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    button:hover {
      background: #2980b9;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(private router: Router) {}

  goToHome() {
    window.location.href = '/';
  }
}
