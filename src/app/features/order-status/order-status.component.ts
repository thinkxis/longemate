
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

interface StatusEntry { label: string; note: string; timestamp: string; }
interface OrderItem {
  orderId:      string;
  categoryName: string;
  description:  string;
  city:         string;
  schedule:     string;
  status:       string;
  statusLabel:  string;
  paidAt:       string | null;
  createdAt:    string;
  amountPaid:   string | null;
  timeline:     StatusEntry[];
}

const STATUS_COLOR: Record<string, string> = {
  pending_payment: '#FBBC04',
  paid:            '#1A73E8',
  contacted:       '#9334E6',
  connected:       '#00897B',
  completed:       '#34A853',
  cancelled:       '#EA4335',
};

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="page">
      <header class="top-bar">
        <a class="back" href="/home" aria-label="Home"><mat-icon>arrow_back</mat-icon></a>
        <h1 class="title">My Bookings</h1>
      </header>

      <!-- Phone lookup form -->
      @if (!orders().length && !loading() && !errorMsg()) {
        <div class="lookup">
          <p class="lookup-desc">Enter the mobile number you used when booking.</p>
          <div class="phone-row">
            <span class="prefix">+91</span>
            <input
              type="tel"
              class="phone-input"
              placeholder="98200 00000"
              inputmode="numeric"
              maxlength="10"
              [(ngModel)]="phone"
              (keyup.enter)="search()"
              aria-label="Mobile number" />
          </div>
          <button class="btn-primary" (click)="search()" [disabled]="phone.length < 10">
            Find my bookings
          </button>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="center">
          <div class="spinner"></div>
          <p>Looking up your bookings…</p>
        </div>
      }

      <!-- Error -->
      @if (errorMsg()) {
        <div class="error-box" role="alert">
          <p>{{ errorMsg() }}</p>
          <button class="btn-link" (click)="reset()">Try a different number</button>
        </div>
      }

      <!-- Orders list -->
      @if (orders().length) {
        <div class="orders-header">
          <p class="orders-meta">{{ orders().length }} booking{{ orders().length > 1 ? 's' : '' }} for +91 {{ phone }}</p>
          <button class="btn-link" (click)="reset()">Search again</button>
        </div>

        <div class="orders-list">
          @for (order of orders(); track order.orderId) {
            <div class="order-card" [class.expanded]="expandedId() === order.orderId">

              <!-- Card header -->
              <button class="card-header" (click)="toggle(order.orderId)"
                      [attr.aria-expanded]="expandedId() === order.orderId">
                <div class="card-left">
                  <span class="cat-icon">{{ categoryEmoji(order.categoryName) }}</span>
                  <div>
                    <div class="card-title">{{ order.categoryName }}</div>
                    <div class="card-date">{{ order.createdAt | date:'d MMM y, h:mm a' }}</div>
                  </div>
                </div>
                <div class="card-right">
                  <span class="status-badge" [style.background]="statusBg(order.status)" [style.color]="statusColor(order.status)">
                    {{ order.statusLabel }}
                  </span>
                  <span class="chevron" [class.open]="expandedId() === order.orderId">›</span>
                </div>
              </button>

              <!-- Expanded detail -->
              @if (expandedId() === order.orderId) {
                <div class="card-body">
                  <div class="detail-row"><span class="dl">Job</span><span>{{ order.description }}</span></div>
                  <div class="detail-row"><span class="dl">Location</span><span>{{ order.city }}</span></div>
                  <div class="detail-row"><span class="dl">When</span><span>{{ scheduleLabel(order.schedule) }}</span></div>
                  @if (order.amountPaid) {
                    <div class="detail-row"><span class="dl">Fee paid</span><span class="green">{{ order.amountPaid }}</span></div>
                  }
                  <div class="detail-row"><span class="dl">Booking ID</span><span class="mono">{{ order.orderId }}</span></div>

                  <!-- Timeline -->
                  <div class="timeline-title">Status history</div>
                  <div class="timeline">
                    @for (entry of order.timeline; track entry.timestamp) {
                      <div class="tl-entry">
                        <div class="tl-dot" [style.background]="statusColor(entry.label)"></div>
                        <div class="tl-content">
                          <div class="tl-label">{{ entry.label }}</div>
                          @if (entry.note) {
                            <div class="tl-note">{{ entry.note }}</div>
                          }
                          <div class="tl-time">{{ entry.timestamp | date:'d MMM, h:mm a' }}</div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Help message depending on status -->
                  <div class="help-msg" [ngSwitch]="order.status">
                    <ng-container *ngSwitchCase="'paid'">
                      📞 Our team will call you within 2 hours.
                    </ng-container>
                    <ng-container *ngSwitchCase="'contacted'">
                      🔗 We're connecting you with a professional. Stay tuned.
                    </ng-container>
                    <ng-container *ngSwitchCase="'connected'">
                      💬 Negotiate the job price directly with your professional.
                    </ng-container>
                    <ng-container *ngSwitchCase="'completed'">
                      🎉 Job done! We hope it went well.
                    </ng-container>
                    <ng-container *ngSwitchCase="'pending_payment'">
                      ⚠️ Payment not yet completed. <a href="/payment">Complete payment →</a>
                    </ng-container>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; padding-bottom: 40px; }

    .top-bar { display: flex; align-items: center; gap: 12px; padding: 20px 16px 16px; border-bottom: 1px solid #F1F3F4; }
    .back  { font-size: 15px; color: #1A73E8; text-decoration: none; }
    .title { font-size: 20px; font-weight: 700; color: #202124; margin: 0; }

    /* Lookup */
    .lookup { padding: 40px 20px 0; display: flex; flex-direction: column; gap: 14px; }
    .lookup-desc { font-size: 15px; color: #5F6368; margin: 0; text-align: center; }
    .phone-row { display: flex; align-items: stretch; }
    .prefix {
      background: #F1F3F4; border: 1.5px solid #DADCE0; border-right: none;
      border-radius: 12px 0 0 12px; padding: 14px 12px;
      font-size: 15px; color: #5F6368;
    }
    .phone-input {
      flex: 1; border: 1.5px solid #DADCE0; border-left: none;
      border-radius: 0 12px 12px 0; padding: 14px;
      font-size: 16px; color: #202124; outline: none; font-family: inherit;
    }
    .phone-input:focus { border-color: #1A73E8; }

    .btn-primary {
      all: unset; background: #1A73E8; color: #fff;
      border-radius: 28px; padding: 16px; font-size: 16px; font-weight: 600;
      text-align: center; cursor: pointer; width: 100%; box-sizing: border-box;
      transition: background 0.15s, opacity 0.15s;
    }
    .btn-primary:disabled { background: #DADCE0; color: #80868B; cursor: not-allowed; }
    .btn-link { all: unset; font-size: 14px; color: #1A73E8; cursor: pointer; }

    /* States */
    .center { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 20px; }
    .spinner {
      width: 36px; height: 36px; border-radius: 50%;
      border: 3px solid #E8F0FE; border-top-color: #1A73E8;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-box { margin: 24px 16px; background: #FDECEA; border-radius: 12px; padding: 20px; text-align: center; }
    .error-box p { margin: 0 0 12px; color: #C62828; font-size: 14px; }

    /* Orders */
    .orders-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 16px 8px; }
    .orders-meta { font-size: 13px; color: #5F6368; margin: 0; }
    .orders-list { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }

    .order-card { border: 1.5px solid #E8EAED; border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
    .order-card.expanded { border-color: #1A73E8; }

    .card-header {
      all: unset; display: flex; justify-content: space-between; align-items: center;
      width: 100%; box-sizing: border-box; padding: 16px; cursor: pointer; gap: 12px;
    }
    .card-left  { display: flex; align-items: center; gap: 12px; }
    .card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .cat-icon   { font-size: 28px; }
    .card-title { font-size: 15px; font-weight: 600; color: #202124; }
    .card-date  { font-size: 12px; color: #5F6368; margin-top: 2px; }
    .chevron    { font-size: 20px; color: #80868B; transition: transform 0.2s; display: inline-block; }
    .chevron.open { transform: rotate(90deg); }

    .status-badge {
      font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
      white-space: nowrap;
    }

    /* Card body */
    .card-body { padding: 0 16px 16px; border-top: 1px solid #F1F3F4; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
    .detail-row {
      display: flex; justify-content: space-between; gap: 16px;
      padding: 9px 0; border-bottom: 1px solid #F8F9FA;
      font-size: 13px; color: #202124;
    }
    .detail-row:last-of-type { border: none; }
    .dl   { color: #5F6368; white-space: nowrap; }
    .green { color: #34A853; font-weight: 600; }
    .mono  { font-family: monospace; font-size: 11px; color: #80868B; }

    /* Timeline */
    .timeline-title { font-size: 13px; font-weight: 600; color: #202124; margin: 16px 0 12px; }
    .timeline { display: flex; flex-direction: column; gap: 0; position: relative; }
    .tl-entry { display: flex; gap: 12px; padding-bottom: 16px; position: relative; }
    .tl-entry:not(:last-child)::before {
      content: ''; position: absolute; left: 7px; top: 16px;
      width: 2px; bottom: 0; background: #E8EAED;
    }
    .tl-dot {
      width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
      margin-top: 2px; z-index: 1;
    }
    .tl-label { font-size: 13px; font-weight: 600; color: #202124; }
    .tl-note  { font-size: 12px; color: #5F6368; margin-top: 2px; }
    .tl-time  { font-size: 11px; color: #80868B; margin-top: 3px; }

    /* Help */
    .help-msg { background: #F8F9FA; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #3C4043; margin-top: 16px; line-height: 1.5; }
    .help-msg a { color: #1A73E8; }
  `]
})
export class OrderStatusComponent {
  private http = inject(HttpClient);

  phone      = '';
  loading    = signal(false);
  errorMsg   = signal('');
  orders     = signal<OrderItem[]>([]);
  expandedId = signal<string | null>(null);

  search() {
    if (this.phone.length < 10) return;
    this.loading.set(true);
    this.errorMsg.set('');
    this.orders.set([]);

    const encoded = encodeURIComponent('+91' + this.phone);
    this.http.get<{ orders: OrderItem[] }>(environment.server + `/api/orders/status/${encoded}`)
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.orders.set(res.orders);
          if (res.orders.length > 0) this.expandedId.set(res.orders[0].orderId);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.error ?? 'Could not find bookings for this number.');
        }
      });
  }

  reset() {
    this.orders.set([]);
    this.errorMsg.set('');
    this.phone = '';
    this.expandedId.set(null);
  }

  toggle(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  statusColor(status: string): string {
    return STATUS_COLOR[status] ?? STATUS_COLOR[this.keyFromLabel(status)] ?? '#80868B';
  }

  statusBg(status: string): string {
    const hex = this.statusColor(status);
    return hex + '1A'; // 10% opacity background
  }

  keyFromLabel(label: string): string {
    // Reverse-map label back to key for timeline entries which carry labels not keys
    const map: Record<string, string> = {
      '⏳ Awaiting payment': 'pending_payment',
      '✅ Booking confirmed': 'paid',
      '📞 Team has called you': 'contacted',
      '🔗 Connected with professional': 'connected',
      '🎉 Job completed': 'completed',
      '❌ Cancelled': 'cancelled',
    };
    return map[label] ?? 'paid';
  }

  categoryEmoji(name: string): string {
    const map: Record<string, string> = {
      Cleaning: '✨', Electrician: '⚡', Plumber: '💧',
      Carpenter: '🔧', Massage: '💆', Salon: '✂️',
      Painting: '🎨', Welder: '🔥', Cooking: '👨‍🍳',
    };
    return map[name] ?? '🛠️';
  }

  scheduleLabel(s: string): string {
    const m: Record<string, string> = {
      asap: 'As soon as possible', today: 'Today',
      tomorrow: 'Tomorrow', 'this-week': 'This week',
    };
    return m[s] ?? s;
  }
}