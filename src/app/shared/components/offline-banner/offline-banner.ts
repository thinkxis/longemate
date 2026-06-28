import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!network.online()) {
      <div class="banner" role="alert" aria-live="polite">
        <span class="icon">📡</span>
        <span>You're offline — your booking will be submitted when you reconnect.</span>
      </div>
    }
  `,
  styles: [`
    .banner {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      background: #EA4335;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 500;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to   { transform: translateY(0); }
    }
  `]
})


export class OfflineBannerComponent {
  network = inject(NetworkService);
}