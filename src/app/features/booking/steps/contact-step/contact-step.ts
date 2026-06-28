 
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingStore } from '../../../../stores/booking.store';
import { CustomerStore } from '../../../../stores/customer.store';

@Component({
  selector: 'app-contact-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="step">
      <h2 class="question">How do we reach you?</h2>
      <p class="hint">We'll call to confirm your booking.</p>

      <label class="field-label">Your name *</label>
      <input type="text" class="field" placeholder="Full name"
             [ngModel]="customer().name"
             (ngModelChange)="update('name', $event)"
             autocomplete="name"
             aria-label="Your name" />

      <label class="field-label">Mobile number *</label>
      <div class="phone-wrap">
        <span class="prefix">+91</span>
        <input type="tel" class="field phone-field" placeholder="98200 00000"
               inputmode="tel" maxlength="10"
               [ngModel]="rawPhone()"
               (ngModelChange)="updatePhone($event)"
               autocomplete="tel"
               aria-label="Mobile number" />
      </div>

      @if (isSaved) {
        <p class="saved-tag">✅ Auto-filled from your last booking</p>
      }
    </div>
  `,
  styles: [`
    .question { font-size: 26px; font-weight: 700; color: #202124; margin: 0 0 6px; line-height: 1.2; }
    .hint { font-size: 13px; color: #5F6368; margin: 0 0 24px; }
    .field-label { font-size: 12px; color: #5F6368; display: block; margin-bottom: 4px; margin-top: 16px; }
    .field {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 10px;
      padding: 12px 14px; font-size: 16px; color: #202124;
      outline: none; font-family: inherit;
      transition: border-color 0.2s;
    }
    .field:focus { border-color: #1A73E8; }
    .phone-wrap { display: flex; align-items: stretch; gap: 0; }
    .prefix {
      background: #F1F3F4; border: 1.5px solid #DADCE0; border-right: none;
      border-radius: 10px 0 0 10px; padding: 12px 12px;
      font-size: 15px; color: #5F6368; white-space: nowrap;
    }
    .phone-field { border-radius: 0 10px 10px 0; }
    .saved-tag { font-size: 12px; color: #34A853; margin: 10px 0 0; }
  `]
})
export class ContactStepComponent implements OnInit {
  store    = inject(BookingStore);
  customerStore = inject(CustomerStore);
  customer = this.customerStore.profile;
  isSaved  = false;

  ngOnInit() {
    const saved = this.customerStore.profile();
    if (saved.name) {
      this.store.patchDraft({ customer: { ...saved } });
      this.isSaved = true;
    }
  }

  rawPhone() {
    return this.store.draft().customer.phone.replace('+91', '').trim();
  }

  update(field: 'name' | 'phone', val: string) {
    const c = this.store.draft().customer;
    this.store.patchDraft({ customer: { ...c, [field]: val } });
  }

  updatePhone(val: string) {
    const c = this.store.draft().customer;
    this.store.patchDraft({ customer: { ...c, phone: '+91' + val } });
  }
}