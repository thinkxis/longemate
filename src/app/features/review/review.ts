import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingStore } from '../../stores/booking.store';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [OrderSummaryComponent, MatIconModule],
  template: `
    <div class="page">
      <header class="top-bar">
        <button class="back" (click)="router.navigate(['/wizard'])" aria-label="Back"><mat-icon>arrow_back</mat-icon></button>
        <h1 class="title">Review your booking</h1>
      </header>

      <div class="content">
        <app-order-summary [order]="store.draft()" />

        <div class="fee-box">
          <div class="fee-row">
            <span>Booking fee (non-refundable)</span>
            <span class="fee-amount">₹99</span>
          </div>
          <p class="fee-note">
            This reserves your slot. Your worker negotiates the job price directly with you.
            Platform takes zero commission.
          </p>
        </div>

        <div class="trust-row">
          <span>🔒 Secured</span>
          <span>📞 We'll call within 2 hrs</span>
          <span>💸 Zero commission</span>
        </div>
      </div>

      <div class="footer">
        <button class="btn-primary" (click)="proceed()">
          Confirm &amp; Pay ₹99
        </button>
        <button class="btn-secondary" (click)="router.navigate(['/wizard'])">Edit details</button>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; display: flex; flex-direction: column; }
    .top-bar { display: flex; align-items: center; gap: 12px; padding: 20px 16px 16px; border-bottom: 1px solid #F1F3F4; }
    .back { all: unset; font-size: 22px; cursor: pointer; color: #202124; padding: 4px; }
    .title { font-size: 20px; font-weight: 700; color: #202124; margin: 0; }
    .content { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }
    .fee-box { background: #FFF8E1; border: 1px solid #FFE082; border-radius: 12px; padding: 16px; }
    .fee-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600; font-size: 15px; }
    .fee-amount { color: #1A73E8; }
    .usd { font-size: 12px; color: #80868B; font-weight: 400; }
    .fee-note { font-size: 12px; color: #5F6368; margin: 0; line-height: 1.5; }
    .trust-row { display: flex; justify-content: space-between; font-size: 12px; color: #5F6368; padding: 4px 0; }
    .footer { padding: 16px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid #F1F3F4; }
    .btn-primary {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      background: #1A73E8; color: #fff; border-radius: 28px;
      padding: 16px; font-size: 16px; font-weight: 600; text-align: center; cursor: pointer;
    }
    .btn-primary:active { background: #1557B0; }
    .btn-secondary {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; color: #5F6368; border-radius: 28px;
      padding: 14px; font-size: 15px; text-align: center; cursor: pointer;
    }
  `]
})
export class ReviewComponent {
  store  = inject(BookingStore);
  router = inject(Router);
  proceed() { this.router.navigate(['/payment']); }
}
