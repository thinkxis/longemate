
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from '../../models/category.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card';
import { AppStore } from '../../stores/app.store';
import { BookingStore } from '../../stores/booking.store';
import { Category } from '../../models/category.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent, RouterModule, MatIconModule],
  template: `
    <div class="page">
        <div class="logo-sm" routerLink="/">DoorCall<mat-icon style="transform: scale(1.5);">doorbell</mat-icon></div>
      <header class="hero">
        <h1 class="headline">What do you need ?</h1>
        <p class="sub">Book any home service in under 60 seconds. ₹90 booking fee.</p>
      </header>

      <div class="grid">
        @for (cat of categories; track cat.id) {
          <app-category-card [category]="cat" (selected)="onSelect($event)" />
        }
      </div>

      <footer class="footer">
        <a href="/about">About</a>
        <a routerLink="/my-bookings">Bookings</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a routerLink="/settings">Settings</a>
      </footer>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; padding: 0 16px; min-height: 100vh; background: #fff; }
    .hero { padding: 32px 0 32px 0; text-align: center; }
    .logo-sm { font-size: 42px; line-height: 42px; font-weight: bold; color: #fff; margin-bottom: 24px; letter-spacing: 1px; background: #000; display: block; padding: 16px 12px; border-radius: 0 0 14px 14px; text-align: center; }
    .headline { font-size: 32px; font-weight: 700; color: #202124; line-height: 1.2; margin: 0 0 12px; }
    .sub { font-size: 15px; color: #5F6368; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .footer { display: flex; justify-content: center; gap: 20px; padding: 32px 0; }
    .footer a { font-size: 13px; color: #5F6368; text-decoration: none; }
    .footer a:hover { color: #1A73E8; }
  `]
})
export class LandingComponent {
  categories = CATEGORIES;
  private router  = inject(Router);
  private appStore = inject(AppStore);
  private booking  = inject(BookingStore);

  onSelect(cat: Category) {
    this.appStore.addRecentCategory(cat.id);
    this.booking.patchDraft({ categoryId: cat.id, categoryName: cat.name });
    this.router.navigate(['/wizard']);
  }
}
