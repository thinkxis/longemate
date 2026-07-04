 
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingStore } from '../../stores/booking.store';
import { ApiService } from '../../core/services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

declare var Razorpay: any;  // loaded via script tag in index.html

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="page">
      <header class="top-bar">
        <button class="back" (click)="router.navigate(['/review'])" aria-label="Back"><mat-icon>arrow_back</mat-icon></button>
        <h1 class="title">Pay booking fee</h1>
      </header>

      <div class="content">
        <div class="amount-card">
          <div class="amount">₹99</div>
          <div class="amount-sub">One-time booking fee</div>
          <div class="amount-usd">Non-refundable</div>
        </div>

        <div class="what-you-get">
          <h3>What happens next</h3>
          <ul>
            <li>📞 Our team calls you within 2 hours</li>
            <li>🔗 We connect you with the right professional</li>
            <li>💬 You and the worker negotiate price directly</li>
            <li>💸 Platform earns zero commission on the job</li>
          </ul>
        </div>

        @if (error()) {
          <div class="error-box" role="alert">{{ error() }}</div>
        }
      </div>

      <div class="footer">
        <button class="btn-pay" (click)="pay()" [disabled]="loading()">
          @if (loading()) {
            <span class="spinner"></span> Processing…
          } @else {
            🔒 Pay ₹99 with Razorpay
          }
        </button>
        <p class="secure-note">Secured by Razorpay · UPI · Cards · Net Banking</p>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; display: flex; flex-direction: column; }
    .top-bar { display: flex; align-items: center; gap: 12px; padding: 20px 16px 16px; border-bottom: 1px solid #F1F3F4; }
    .back { all: unset; font-size: 22px; cursor: pointer; color: #202124; padding: 4px; }
    .title { font-size: 20px; font-weight: 700; color: #202124; margin: 0; }
    .content { flex: 1; padding: 32px 16px 16px; display: flex; flex-direction: column; gap: 24px; }
    .amount-card {
      text-align: center; background: #E8F0FE; border-radius: 20px; padding: 32px;
    }
    .amount { font-size: 56px; font-weight: 800; color: #1A73E8; line-height: 1; }
    .amount-sub { font-size: 14px; color: #5F6368; margin-top: 8px; }
    .amount-usd { font-size: 12px; color: #80868B; margin-top: 4px; }
    .what-you-get h3 { font-size: 15px; font-weight: 600; color: #202124; margin: 0 0 12px; }
    .what-you-get ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
    .what-you-get li { font-size: 14px; color: #3C4043; display: flex; gap: 8px; }
    .error-box { background: #FDECEA; border: 1px solid #F5C6CB; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #C62828; }
    .footer { padding: 16px; border-top: 1px solid #F1F3F4; }
    .btn-pay {
      all: unset; display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; box-sizing: border-box;
      background: #1A73E8; color: #fff; border-radius: 28px;
      padding: 18px; font-size: 17px; font-weight: 700; cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }
    .btn-pay:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-pay:not(:disabled):active { background: #1557B0; }
    .secure-note { text-align: center; font-size: 12px; color: #80868B; margin: 10px 0 0; }
    .spinner {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PaymentComponent implements OnInit {
  store   = inject(BookingStore);
  api     = inject(ApiService);
  router  = inject(Router);
  loading = signal(false);
  error   = signal('');

  ngOnInit() {
    if (!this.store.draft().categoryId) {
      this.router.navigate(['/home']);
    }
  }

  pay() {
    this.loading.set(true);
    this.error.set('');
    this.store.isSubmitting.set(true);

    this.api.createOrder(this.store.draft()).subscribe({
      next: (orderResp) => {
        this.openRazorpay(orderResp.razorpayOrderId, orderResp.orderId);
      },
      error: (err) => {
        this.loading.set(false);
        this.store.isSubmitting.set(false);
        if (err?.offline) {
          // Queued offline – go to success with a temp id
          this.store.submittedOrderId.set(err.localId);
          this.router.navigate(['/success'], { queryParams: { offline: 1 } });
        } else {
          this.error.set('Something went wrong. Please try again.');
        }
      }
    });
  }

  private openRazorpay(rzpOrderId: string, internalOrderId: string) {
    const options = {
      key: 'rzp_live_RnHINLRtRYB6PV',   // replace with env var
      amount: 9900,  
      currency: 'INR',
      name: 'lodgemate',
      description: `${this.store.draft().categoryName} booking fee`,
      order_id: rzpOrderId,
      prefill: {
        name:    this.store.draft().customer.name,
        contact: this.store.draft().customer.phone,
      },
      theme: { color: '#1A73E8' },
      handler: (response: any) => {
        // Verify payment on server
        this.api.verifyPayment({
          razorpay_order_id:   response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature:  response.razorpay_signature,
          orderId:             internalOrderId,
        }).subscribe({
          next: (res) => {
            this.loading.set(false);
            this.store.isSubmitting.set(false);
            this.store.submittedOrderId.set(res.orderId);
            this.router.navigate(['/success']);
          },
          error: () => {
            this.loading.set(false);
            this.error.set('Payment verified but confirmation failed. We\'ll contact you shortly.');
          }
        });
      },
      modal: {
        ondismiss: () => {
          this.loading.set(false);
          this.store.isSubmitting.set(false);
        }
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  }
}