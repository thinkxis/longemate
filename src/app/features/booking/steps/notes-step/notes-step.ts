 
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingStore } from '../../../../stores/booking.store';

@Component({
  selector: 'app-notes-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="step">
      <h2 class="question">Anything else we should know?</h2>
      <p class="hint">This step is optional — tap Skip if nothing to add.</p>
      <textarea
        class="notes-input"
        rows="6"
        placeholder="e.g. Second floor, no lift. Bring your own tools. Gate code is 1234."
        [ngModel]="store.draft().notes"
        (ngModelChange)="store.patchDraft({ notes: $event })"
        aria-label="Additional notes">
      </textarea>
    </div>
  `,
  styles: [`
    .question { font-size: 26px; font-weight: 700; color: #202124; margin: 0 0 6px; line-height: 1.2; }
    .hint { font-size: 13px; color: #5F6368; margin: 0 0 24px; }
    .notes-input {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; border-radius: 12px;
      padding: 14px; font-size: 15px; color: #202124;
      resize: none; outline: none; font-family: inherit;
      transition: border-color 0.2s;
    }
    .notes-input:focus { border-color: #1A73E8; }
  `]
})
export class NotesStepComponent {
  store = inject(BookingStore);
}