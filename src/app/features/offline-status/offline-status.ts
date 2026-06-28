
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkService } from '../../core/services/network.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offline-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="icon">📡</div>
      <h1>You're offline</h1>
      <p>You can still fill in your booking. It'll be submitted automatically when you reconnect.</p>
      @if (network.online()) {
        <p class="back-online">✅ You're back online!</p>
        <button class="btn" (click)="router.navigate(['/home'])">Continue booking</button>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; }
    .icon { font-size: 64px; }
    h1 { font-size: 24px; font-weight: 700; color: #202124; margin: 0; text-align: center; }
    p  { font-size: 15px; color: #5F6368; margin: 0; text-align: center; line-height: 1.6; }
    .back-online { color: #34A853; font-weight: 600; }
    .btn { all: unset; background: #1A73E8; color: #fff; border-radius: 28px; padding: 14px 32px; font-size: 16px; font-weight: 600; cursor: pointer; }
  `]
})
export class OfflineStatusComponent { network = inject(NetworkService); router = inject(Router); }