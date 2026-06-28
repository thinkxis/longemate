import { Injectable, signal, effect } from '@angular/core';
import { CustomerProfile, EMPTY_CUSTOMER } from '../models/customer.model';
import { Address } from '../models/address.model';

const LS_KEY = 'bk_customer';

function load(): CustomerProfile {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { ...EMPTY_CUSTOMER };
  } catch { return { ...EMPTY_CUSTOMER }; }
}

@Injectable({ providedIn: 'root' })
export class CustomerStore {
  readonly profile = signal<CustomerProfile>(load());

  constructor() {
    // Persist every change automatically
    effect(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(this.profile()));
    });
  }

  patch(partial: Partial<CustomerProfile>) {
    this.profile.update(p => ({ ...p, ...partial }));
  }

  saveAddress(addr: Address) {
    this.profile.update(p => {
      const existing = p.addresses.filter(
        a => a.line1 !== addr.line1 || a.city !== addr.city
      );
      return { ...p, addresses: [addr, ...existing].slice(0, 3) };
    });
  }

  get preferredAddress(): Address | null {
    return this.profile().addresses[0] ?? null;
  }
}
