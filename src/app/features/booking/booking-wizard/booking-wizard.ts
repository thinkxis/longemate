import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingStore, TOTAL_STEPS } from '../../../stores/booking.store';
import { CustomerStore } from '../../../stores/customer.store';
import { ProgressStepperComponent } from '../../../shared/components/progress-stepper/progress-stepper';
import { ServiceStepComponent } from '../steps/service-step/service-step';
import { LocationStepComponent } from '../steps/location-step/location-step';
import { ScheduleStepComponent } from '../steps/schedule-step/schedule-step';
import { NotesStepComponent } from '../steps/notes-step/notes-step';
import { ContactStepComponent } from '../steps/contact-step/contact-step';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    ServiceStepComponent,
    LocationStepComponent,
    ScheduleStepComponent,
    NotesStepComponent,
    ContactStepComponent,
    MatIconModule
  ],
  template: `
    <div class="wizard-page">
      <div class="wizard-header">
        <button class="back" (click)="handleBack()" aria-label="Go back"><mat-icon>arrow_back</mat-icon></button>
        <div class="stepper-wrap">
          <app-progress-stepper [current]="store.currentStep()" [total]="totalSteps" />
        </div>
        <p class="label">Step {{ store.currentStep() }} of {{ totalSteps }}</p>
      </div>

      <div class="step-area">
        @switch (store.currentStep()) {
          @case (1) { <app-service-step /> }
          @case (2) { <app-location-step /> }
          @case (3) { <app-schedule-step /> }
          @case (4) { <app-notes-step /> }
          @case (5) { <app-contact-step /> }
        }
      </div>

      <div class="wizard-footer">
        @if (store.currentStep() === totalSteps) {
          <button class="btn-primary" (click)="goToReview()" [disabled]="!store.canAdvance()">
            Review my booking <mat-icon>arrow_forward</mat-icon>
          </button>
        } @else {
          @if (store.currentStep() === 4) {
            <button class="btn-secondary" (click)="store.nextStep()">Skip notes</button>
          }
          <button class="btn-primary" (click)="store.nextStep()" [disabled]="!store.canAdvance()">
            Continue
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .label { text-align: center; font-size: 12px; color: #5F6368; margin: 0; }
    .wizard-page {
      max-width: 480px; margin: 0 auto;
      min-height: 100vh; background: #fff;
      display: flex; flex-direction: column;
    }
    .wizard-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 16px 8px;
      border-bottom: 1px solid #F1F3F4;
    }
    .back {
      all: unset; font-size: 22px; cursor: pointer;
      color: #202124; padding: 4px; flex-shrink: 0;
    }
    .stepper-wrap { flex: 1; }
    .step-area { flex: 1; padding: 32px 16px 16px; }
    .wizard-footer {
      padding: 16px; display: flex; flex-direction: column; gap: 10px;
      border-top: 1px solid #F1F3F4;
    }
    mat-icon { vertical-align: middle; }
    .btn-primary {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      background: #1A73E8; color: #fff; border-radius: 28px;
      padding: 16px; font-size: 16px; font-weight: 600;
      text-align: center; cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }
    .btn-primary:disabled { background: #DADCE0; color: #80868B; cursor: not-allowed; }
    .btn-primary:not(:disabled):active { background: #1557B0; }
    .btn-secondary {
      all: unset; display: block; width: 100%; box-sizing: border-box;
      border: 1.5px solid #DADCE0; color: #5F6368; border-radius: 28px;
      padding: 14px; font-size: 15px;
      text-align: center; cursor: pointer;
    }
  `]
})
export class BookingWizardComponent {
  store      = inject(BookingStore);
  totalSteps = TOTAL_STEPS;
  private router = inject(Router);
  private customer = inject(CustomerStore);

  handleBack() {
    if (this.store.currentStep() === 1) this.router.navigate(['/home']);
    else this.store.prevStep();
  }

  goToReview() {
    // Save address to customer profile
    const addr = this.store.draft().address;
    if (addr.line1) this.customer.saveAddress(addr);
    // Save name/phone
    const { name, phone } = this.store.draft().customer;
    this.customer.patch({ name, phone });
    this.router.navigate(['/review']);
  }
}