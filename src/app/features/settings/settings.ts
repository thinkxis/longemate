import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerStore } from '../../stores/customer.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="page">
      <header class="top-bar">
        <button class="back" (click)="router.navigate(['/home'])" aria-label="Back"><mat-icon>arrow_back</mat-icon></button>
        <h1 class="title">Settings</h1>
      </header>
      <div class="content">
        <section class="section">
          <h2 class="section-title">Your saved details</h2>
          <p class="section-sub">These auto-fill your next booking.</p>

          <label class="field-label">Name</label>
          <input type="text" class="field" placeholder="Your name"
                 [ngModel]="cs.profile().name"
                 (ngModelChange)="cs.patch({ name: $event })" />

          <label class="field-label">Mobile number</label>
          <input type="tel" class="field" placeholder="+91 98200 00000"
                 [ngModel]="cs.profile().phone"
                 (ngModelChange)="cs.patch({ phone: $event })" />
        </section>

        <section class="section">
          <h2 class="section-title">Saved addresses</h2>
          @if (cs.profile().addresses.length === 0) {
            <p class="empty">No saved addresses yet. They'll appear here after your first booking.</p>
          }
          @for (addr of cs.profile().addresses; track addr.line1) {
            <div class="addr-row">
              <span>📍 {{ addr.line1 }}, {{ addr.city }}</span>
            </div>
          }
        </section>

        <button class="btn-danger" (click)="clearData()">Clear all saved data</button>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; }
    .top-bar { display: flex; align-items: center; gap: 12px; padding: 20px 16px 16px; border-bottom: 1px solid #F1F3F4; }
    .back { all: unset; font-size: 22px; cursor: pointer; color: #202124; padding: 4px; }
    .title { font-size: 20px; font-weight: 700; color: #202124; margin: 0; }
    .content { padding: 24px 16px; display: flex; flex-direction: column; gap: 32px; }
    .section-title { font-size: 16px; font-weight: 600; color: #202124; margin: 0 0 4px; }
    .section-sub  { font-size: 13px; color: #5F6368; margin: 0 0 16px; }
    .field-label { font-size: 12px; color: #5F6368; display: block; margin-bottom: 4px; margin-top: 12px; }
    .field {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 10px;
      padding: 12px 14px; font-size: 15px; color: #202124;
      outline: none; font-family: inherit;
    }
    .field:focus { border-color: #1A73E8; }
    .empty { font-size: 13px; color: #80868B; }
    .addr-row { padding: 12px 0; border-bottom: 1px solid #F1F3F4; font-size: 14px; color: #3C4043; }
    .btn-danger {
      all: unset; color: #EA4335; font-size: 14px; cursor: pointer;
      border: 1px solid #EA4335; border-radius: 10px; padding: 12px 20px;
      text-align: center;
    }
  `]
})
export class SettingsComponent {
  cs     = inject(CustomerStore);
  router = inject(Router);

  clearData() {
    if (confirm('Clear all saved names, phone and addresses?')) {
      this.cs.patch({ name: '', phone: '', addresses: [] });
    }
  }
}