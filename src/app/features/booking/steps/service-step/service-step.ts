
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingStore } from '../../../../stores/booking.store';

@Component({
  selector: 'app-service-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="step">
      <h2 class="question">What do you need done?</h2>
      <p class="hint">Booked: <strong>{{ store.draft().categoryName }}</strong></p>

      <div class="chips">
        @for (opt of quickOptions; track opt) {
          <button class="chip" [class.active]="isActive(opt)" (click)="toggle(opt)">{{ opt }}</button>
        }
      </div>

      <textarea
        class="desc-input"
        rows="4"
        placeholder="Describe the job in a few words…"
        [ngModel]="store.draft().description"
        (ngModelChange)="store.patchDraft({ description: $event })"
        aria-label="Job description">
      </textarea>
      <p class="helper">The more detail, the faster we can match you with the right professional.</p>
    </div>
  `,
  styles: [`
    .step h2.question { font-size: 26px; font-weight: 700; color: #202124; margin: 0 0 6px; line-height: 1.2; }
    .hint { font-size: 13px; color: #5F6368; margin: 0 0 24px; }
    .hint strong { color: #1A73E8; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .chip {
      all: unset; border: 1.5px solid #DADCE0; border-radius: 20px;
      padding: 8px 16px; font-size: 13px; color: #3C4043; cursor: pointer;
      transition: all 0.15s;
    }
    .chip.active { background: #E8F0FE; border-color: #1A73E8; color: #1A73E8; font-weight: 600; }
    .desc-input {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 12px;
      padding: 14px; font-size: 15px; color: #202124;
      resize: none; outline: none; font-family: inherit;
      transition: border-color 0.2s;
    }
    .desc-input:focus { border-color: #1A73E8; }
    .helper { font-size: 12px; color: #80868B; margin: 8px 0 0; }
  `]
})
export class ServiceStepComponent {
  store = inject(BookingStore);
  quickOptions = [
  'Instant Book',
  'AC Room',
  'Non-AC',
  'Couple Friendly',
  'Free Wi-Fi'];

  isActive(opt: string) { return this.store.draft().description.includes(opt); }
  toggle(opt: string) {
    const desc = this.store.draft().description;
    const next = desc.includes(opt) ? desc.replace(opt, '').trim() : `${opt}. ${desc}`.trim();
    this.store.patchDraft({ description: next });
  }
}