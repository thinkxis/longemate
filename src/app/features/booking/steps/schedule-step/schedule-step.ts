 
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingStore } from '../../../../stores/booking.store';
import { ScheduleOption } from '../../../../models/order.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-schedule-step',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  template: `
    <div class="step">
      <h2 class="question">When works for you?</h2>

      <div class="options">
        @for (opt of options; track opt.value) {
          <button class="opt" [class.active]="store.draft().schedule === opt.value"
                  (click)="select(opt.value)">
            <span class="opt-icon"><mat-icon>{{ opt.icon }}</mat-icon></span>
            <div>
              <div class="opt-label">{{ opt.label }}</div>
              <div class="opt-sub">{{ opt.sub }}</div>
            </div>
          </button>
        }
      </div>

      @if (store.draft().schedule === 'custom') {
        <div class="custom-time">
          <label class="field-label">Pick date & time</label>
          <input type="datetime-local" class="field"
                 [ngModel]="store.draft().scheduledAt"
                 (ngModelChange)="store.patchDraft({ scheduledAt: $event })"
                 [min]="minDate" />
        </div>
      }
    </div>
  `,
  styles: [`
    .question { font-size: 26px; font-weight: 700; color: #202124; margin: 0 0 24px; line-height: 1.2; }
    .options { display: flex; flex-direction: column; gap: 10px; }
    .opt {
      all: unset; display: flex; align-items: center; gap: 14px;
      border: 1.5px solid #DADCE0; border-radius: 14px;
      padding: 16px; cursor: pointer;
      transition: all 0.15s;
    }
    .opt.active { border-color: #1A73E8; background: #E8F0FE; }
    .opt-icon { font-size: 22px; }
    .opt-label { font-size: 15px; font-weight: 600; color: #202124; }
    .opt-sub   { font-size: 12px; color: #5F6368; }
    .custom-time { margin-top: 16px; }
    .field-label { font-size: 12px; color: #5F6368; display: block; margin-bottom: 6px; }
    .field {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 10px;
      padding: 12px 14px; font-size: 15px; outline: none;
      font-family: inherit; color: #202124;
    }
    .field:focus { border-color: #1A73E8; }
  `]
})
export class ScheduleStepComponent {
  store = inject(BookingStore);
 
  options: { value: ScheduleOption; label: string; sub: string; icon: string }[] = [
  {
    value: 'asap',
    label: 'As soon as possible',
    sub: 'We\'ll call within 2 hours',
    icon: 'bolt'
  },
  {
    value: 'today',
    label: 'Today',
    sub: 'Flexible on timing',
    icon: 'today'
  },
  {
    value: 'tomorrow',
    label: 'Tomorrow',
    sub: 'Morning or afternoon',
    icon: 'wb_sunny'
  },
  {
    value: 'this-week',
    label: 'This week',
    sub: 'Any day that works',
    icon: 'calendar_view_week'
  },
  {
    value: 'custom',
    label: 'Choose a date & time',
    sub: 'Pick exactly when',
    icon: 'event'
  },
];

  get minDate() { return new Date().toISOString().slice(0, 16); }

  select(val: ScheduleOption) { this.store.patchDraft({ schedule: val }); }
}
