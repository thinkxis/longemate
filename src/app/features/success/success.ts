 
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingStore } from '../../stores/booking.store';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="content">
        <div class="checkmark" aria-hidden="true">
          <div class="check-circle">✓</div>
        </div>

        <h1 class="heading">Booking confirmed!</h1>

        @if (isOffline) {
          <p class="sub offline-sub">
            You're offline. Your booking is saved and will be submitted automatically when you reconnect.
          </p>
        } @else {
          <p class="sub">We'll call you within 2 hours to connect you with your {{ categoryName }}.</p>
        }

        <div class="info-card">
          <div class="info-row"><span class="label">Service</span><span>{{ categoryName }}</span></div>
          <div class="info-row"><span class="label">Booking fee paid</span><span class="green">₹90</span></div>
          @if (orderId) {
            <div class="info-row"><span class="label">Reference</span><span class="mono">{{ orderId }}</span></div>
          }
        </div>

        <div class="expect">
          <h3>What happens next</h3>
          <ol>
            <li>Our team calls you within 2 hours</li>
            <li>We introduce you to a vetted professional</li>
            <li>You agree on a price directly — no middleman</li>
          </ol>
        </div>
      </div>

      <div class="footer">
        <button class="btn-primary" (click)="bookAnother()">Book another service</button>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; display: flex; flex-direction: column; }
    .content { flex: 1; padding: 48px 24px 24px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
    .checkmark { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
    @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .check-circle {
      width: 80px; height: 80px; border-radius: 50%;
      background: #34A853; color: #fff;
      font-size: 36px; display: flex; align-items: center; justify-content: center;
    }
    .heading { font-size: 28px; font-weight: 700; color: #202124; text-align: center; margin: 0; }
    .sub { font-size: 15px; color: #5F6368; text-align: center; margin: 0; line-height: 1.6; }
    .offline-sub { color: #EA4335; }
    .info-card { width: 100%; background: #F8F9FA; border-radius: 12px; padding: 16px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E8EAED; font-size: 14px; }
    .info-row:last-child { border: none; }
    .label { color: #5F6368; }
    .green { color: #34A853; font-weight: 600; }
    .mono  { font-family: monospace; font-size: 12px; color: #80868B; }
    .expect { width: 100%; }
    .expect h3 { font-size: 15px; font-weight: 600; color: #202124; margin: 0 0 12px; }
    .expect ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
    .expect li { font-size: 14px; color: #3C4043; line-height: 1.5; }
    .footer { padding: 16px; border-top: 1px solid #F1F3F4; }
    .btn-primary {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      background: #1A73E8; color: #fff; border-radius: 28px;
      padding: 16px; font-size: 16px; font-weight: 600; text-align: center; cursor: pointer;
    }
  `]
})
export class SuccessComponent implements OnInit {
  store    = inject(BookingStore);
  router   = inject(Router);
  route    = inject(ActivatedRoute);
  isOffline  = false;
  categoryName = '';
  orderId = '';

  ngOnInit() {
    this.isOffline   = !!this.route.snapshot.queryParams['offline'];
    this.categoryName = this.store.draft().categoryName || 'service';
    this.orderId      = this.store.submittedOrderId() ?? '';
  }

  bookAnother() {
    this.store.reset();
    this.router.navigate(['/home']);
  }
}
