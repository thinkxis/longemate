 
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingStore } from '../../../../stores/booking.store';
import { CustomerStore } from '../../../../stores/customer.store';
import { Address } from '../../../../models/address.model';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="step">
      <h2 class="question">Where should we come?</h2>

      @if (savedAddresses.length > 0) {
        <p class="saved-label">Your saved addresses</p>
        @for (addr of savedAddresses; track addr.line1) {
          <button class="addr-chip" [class.active]="isSelected(addr)" (click)="selectAddr(addr)">
            📍 {{ addr.line1 }}, {{ addr.city }}
          </button>
        }
        <div class="or-divider">or enter a new address</div>
      }

      <label class="field-label">Address *</label>
      <input type="text" class="field" placeholder="Flat / House / Street"
             [ngModel]="addr.line1" (ngModelChange)="patch('line1', $event)"
             aria-label="Street address" />

      <label class="field-label">Landmark</label>
      <input type="text" class="field" placeholder="Near landmark (optional)"
             [ngModel]="addr.landmark" (ngModelChange)="patch('landmark', $event)"
             aria-label="Landmark" />

      <div class="row">
        <div style="flex:1">
          <label class="field-label">City *</label>
          <input type="text" class="field" placeholder="City"
                 [ngModel]="addr.city" (ngModelChange)="patch('city', $event)"
                 aria-label="City" />
        </div>
        <div style="width:120px">
          <label class="field-label">Pincode</label>
          <input type="text" class="field" placeholder="400001"
                 inputmode="numeric" maxlength="6"
                 [ngModel]="addr.pincode" (ngModelChange)="patch('pincode', $event)"
                 aria-label="PIN code" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .question { font-size: 26px; font-weight: 700; color: #202124; margin: 0 0 20px; line-height: 1.2; }
    .saved-label { font-size: 12px; color: #5F6368; margin-bottom: 8px; }
    .addr-chip {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 12px;
      padding: 12px 14px; font-size: 13px; color: #3C4043;
      cursor: pointer; margin-bottom: 8px;
    }
    .addr-chip.active { border-color: #1A73E8; background: #E8F0FE; color: #1A73E8; }
    .or-divider { text-align: center; font-size: 12px; color: #80868B; margin: 12px 0; }
    .field-label { font-size: 12px; color: #5F6368; display: block; margin-bottom: 4px; margin-top: 12px; }
    .field {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 10px;
      padding: 12px 14px; font-size: 15px; color: #202124;
      outline: none; font-family: inherit;
      transition: border-color 0.2s;
    }
    .field:focus { border-color: #1A73E8; }
    .row { display: flex; gap: 12px; }
  `]
})
export class LocationStepComponent implements OnInit {
  store    = inject(BookingStore);
  customer = inject(CustomerStore);
  savedAddresses: Address[] = [];

  get addr() { return this.store.draft().address; }

  ngOnInit() {
    this.savedAddresses = this.customer.profile().addresses;
    // Auto-fill preferred address if current is empty
    if (!this.addr.line1 && this.customer.preferredAddress) {
      this.store.patchDraft({ address: { ...this.customer.preferredAddress } });
    }
  }

  patch(field: keyof Address, val: string) {
    this.store.patchDraft({ address: { ...this.addr, [field]: val } });
  }

  selectAddr(addr: Address) {
    this.store.patchDraft({ address: { ...addr } });
  }

  isSelected(addr: Address) {
    return this.addr.line1 === addr.line1 && this.addr.city === addr.city;
  }
}