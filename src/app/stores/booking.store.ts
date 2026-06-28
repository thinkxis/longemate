
import { Injectable, signal, computed } from '@angular/core';
import { OrderDraft, EMPTY_DRAFT } from '../models/order.model';

export const TOTAL_STEPS = 5;

@Injectable({ providedIn: 'root' })
export class BookingStore {
  readonly draft       = signal<OrderDraft>({ ...EMPTY_DRAFT });
  readonly currentStep = signal<number>(1);
  readonly isSubmitting = signal<boolean>(false);
  readonly submittedOrderId = signal<string | null>(null);

  readonly progress = computed(() => (this.currentStep() / TOTAL_STEPS) * 100);
  readonly canAdvance = computed(() => {
    const d = this.draft();
    switch (this.currentStep()) {
      case 1: return d.description.trim().length > 0;
      case 2: return d.address.line1.trim().length > 0;
      case 3: return true; // schedule has a default
      case 4: return true; // notes optional
      case 5: return d.customer.name.trim().length > 0 && d.customer.phone.trim().length >= 10;
      default: return false;
    }
  });

  patchDraft(partial: Partial<OrderDraft>) {
    this.draft.update(d => ({ ...d, ...partial }));
  }

  nextStep() {
    if (this.currentStep() < TOTAL_STEPS) this.currentStep.update(s => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  reset() {
    this.draft.set({ ...EMPTY_DRAFT });
    this.currentStep.set(1);
    this.isSubmitting.set(false);
    this.submittedOrderId.set(null);
  }
}
