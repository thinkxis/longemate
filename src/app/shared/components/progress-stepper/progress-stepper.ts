
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stepper" role="progressbar"
         [attr.aria-valuenow]="current()"
         [attr.aria-valuemax]="total()"
         aria-label="Booking progress">
      @for (i of steps; track i) {
        <div class="dot"
             [class.active]="i === current()"
             [class.done]="i < current()">
        </div>
      }
    </div>
  `,
  styles: [`
    .stepper { display: flex; gap: 8px; justify-content: center; margin-bottom: 4px; }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #DADCE0;
      transition: background 0.25s, transform 0.25s;
    }
    .dot.done   { background: #A8C7FA; }
    .dot.active { background: #1A73E8; transform: scale(1.3); }
  `]
})
export class ProgressStepperComponent {
  current = input.required<number>();
  total   = input.required<number>();
  get steps() { return Array.from({ length: this.total() }, (_, i) => i + 1); }
}
