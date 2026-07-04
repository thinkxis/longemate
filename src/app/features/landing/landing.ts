
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from '../../models/category.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card';
import { AppStore } from '../../stores/app.store';
import { BookingStore } from '../../stores/booking.store';
import { Category } from '../../models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
  <header>
        <div class="logo-sm">
          <button mat-icon-button [matMenuTriggerFor]="menu" ><mat-icon>menu</mat-icon></button>
<mat-menu #menu="matMenu">
        <a  mat-menu-item routerLink="/my-bookings">My Bookings</a>
        <a mat-menu-item href="https://frycold.com">Join as Service Provider</a>
        <a mat-menu-item href="https://frycold.com">Join as Vendor Business</a>
        <a mat-menu-item href="https://frycold.com">Join as Application Developer</a>
        <a  mat-menu-item routerLink="/settings">Settings</a>
</mat-menu>

          <span class="divide"></span>
          <img src="assets/logo.png" routerLink="/" alt="lodgemate Logo" />
          <span class="divide"></span>

          <button mat-icon-button  [matMenuTriggerFor]="menuHelp"><mat-icon>contact_support</mat-icon></button>
<mat-menu #menuHelp="matMenu">
  <a mat-menu-item href="https://wa.me/918169619854?text=Customer Support">Customer Support</a>
  <a mat-menu-item href="https://wa.me/918169619854?text=Merchant Support">Merchant Support</a>
  <a mat-menu-item href="https://wa.me/918169619854?text=Vendor Support">Vendor Support</a>
</mat-menu>

        </div>
  </header>
    <div class="page">
      <div class="hero">
        <h1 class="headline">What do you need ?</h1>
        <p class="sub">Book any service under 60 seconds. Flat ₹99 fee.</p>
      </div>

      <div class="grid">
        @for (cat of categories; track cat.id) {
          <app-category-card [category]="cat" (selected)="onSelect($event)" />
        }
      </div>

      <footer class="footer">
        <a href="https://frycold.com/about-us">About</a>
        <a href="https://frycold.com/legal/privacy_policy">Privacy</a>
        <a href="https://frycold.com/legal/terms_of_service">Terms</a>
      </footer>
    </div>
  `,
  styles: [`
  header{
    width: 100%;
      display: flex; align-items: center; justify-content: center; color: #fff;
      position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: #000; 
      .divide{ flex: 1; }
    .logo-sm { margin: 0 auto; padding: 0 24px; max-width: 420px; width: calc(100% - 48px);
      line-height: 60px; height: 60px; font-weight: bold; letter-spacing: 1px;
      padding: 18px 24px 8px 24px; border-radius: 0 0 14px 14px; text-align: center; 
      display: flex; align-items: center; 
      img{ height: 60px; vertical-align: middle; margin: 0 12px; }
      button{ color: #fff; }
    }
  }
    .page { max-width: 480px; margin: 0 auto; padding: 0 16px; min-height: 100vh; background: #fff; }
    .hero { padding: 16px 0 32px 0; text-align: center; }
    .headline { font-size: 32px; font-weight: 700; color: #202124; line-height: 1.2; margin: 0 0 12px 0; }
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
