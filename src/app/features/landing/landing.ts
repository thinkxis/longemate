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
          <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>menu</mat-icon></button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item routerLink="/my-bookings">My Bookings</a>
            <a mat-menu-item href="https://frycold.com">Join as Service Provider</a>
            <a mat-menu-item href="https://frycold.com">Join as Vendor Business</a>
            <a mat-menu-item href="https://frycold.com">Join as Application Developer</a>
            <a mat-menu-item routerLink="/settings">Settings</a>
          </mat-menu>

          <span class="divide"></span>
          <img src="assets/logo.png" routerLink="/" alt="Doorcall Logo" />
          <span class="divide"></span>

          <button mat-icon-button [matMenuTriggerFor]="menuHelp"><mat-icon>contact_support</mat-icon></button>
          <mat-menu #menuHelp="matMenu">
            <a mat-menu-item href="https://wa.me/918169619854?text=Customer Support">Customer Support</a>
            <a mat-menu-item href="https://wa.me/918169619854?text=Merchant Support">Merchant Support</a>
            <a mat-menu-item href="https://wa.me/918169619854?text=Vendor Support">Vendor Support</a>
          </mat-menu>
        </div>
  </header>

  <div class="page">
    <div class="hero">
      <span class="eyebrow">⚡ Flat ₹99 fee · under 60 seconds</span>
      <h1 class="headline">What do you <span class="accent">need</span>?</h1>
      <p class="sub">Pick a category and we'll provide you with options right away.</p>
    </div>

    <div class="grid">
      @for (cat of categories; track cat.id; let i = $index) {
        <div class="cat-slot" [style.--i]="i">
          <app-category-card [category]="cat" (selected)="onSelect($event)" />
        </div>
      }
    </div>



    <div class="banners">
  <div class="banner reviews">
    <div class="reviews-top">
      <div class="rating">
        <span class="rating-num">4.8</span>
        <span class="stars">★★★★★</span>
      </div>
      <div class="avatars">
        <span class="avatar" style="--c:#EEEDFE;--tc:#3C3489">RM</span>
        <span class="avatar" style="--c:#E1F5EE;--tc:#085041">AK</span>
        <span class="avatar" style="--c:#FBEAF0;--tc:#72243E">SP</span>
        <span class="avatar-count">+50k</span>
      </div>
    </div>
    <p class="quote">"We got our business listed on Lodgemate within a day and have seen a sudden increase in conversions!"</p>
    <span class="quote-by">— Marmik Patil, Mumbai</span>
  </div>

  <div class="banner offer">
    <div class="offer-text">
      <span class="offer-tag">Refer & earn</span>
      <h3>Invite, you get <span class="accent">₹49 OFF</span></h3>
    </div>
    <button class="offer-cta" (click)="onInviteClick()">Invite now →</button>
  </div>

  <div class="banner merchant">
    <span class="merchant-tag">For businesses</span>
    <h3>Bring your shop onto Lodgemate</h3>
    <p>Get discovered by thousands of night landers every day.</p>
    <a class="merchant-cta" href="https://frycold.com">Become a partner →</a>
  </div>
</div>

    <footer class="footer">
      <a href="https://frycold.com/about-us">About</a>
      <span class="dot">·</span>
      <a href="https://frycold.com/legal/privacy_policy">Privacy</a>
      <span class="dot">·</span>
      <a href="https://frycold.com/legal/terms_of_service">Terms</a>
    </footer>
  </div>
  `,
  styles: [`
 
    :host {
      --ink: #14141C;
      --muted: #6E7180;
      --surface: #F6F5FB;
      --line: #ECEAF3;
      --grad: linear-gradient(135deg, #7C5CFF 0%, #FF5FA2 100%);
      display: block; 
      background: #fff;
    }

    header {
      width: 100%;
      display: flex; align-items: center; justify-content: center;
      position: sticky; top: 0; z-index: 100;
      background: #000; color: #fff;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
    }
    .logo-sm {
      margin: 0 auto; padding: 10px 0 8px 0;
      max-width: 420px; width: calc(100% - 40px);
      display: flex; align-items: center;
      .divide { flex: 1; }
      img { height: 46px; vertical-align: middle; margin: 0 12px; vertical-align: middle; }
      button { color: var(--ink); color: #fff; }
    }

    .page {
      max-width: 480px; margin: 0 auto; padding: 0 20px 24px;
      min-height: 100vh; background: #fff; position: relative;
    }

    .hero {
      position: relative;
      padding: 40px 0 32px;
      text-align: center;
      isolation: isolate;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -60px; left: 50%;
      transform: translateX(-50%);
      width: 320px; height: 220px;
      background: var(--grad);
      opacity: 0.14;
      filter: blur(60px);
      z-index: -1;
      border-radius: 50%;
    }
    .eyebrow {
      display: inline-block;
      font-size: 12px; font-weight: 600;
      color: var(--ink);
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 18px;
      letter-spacing: 0.2px;
    }
    .headline { 
      font-size: 40px; font-weight: 700;
      color: var(--ink);
      line-height: 1.1;
      letter-spacing: -0.5px;
      margin: 0 0 12px;
    }
    .accent {
      background: var(--grad);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .sub {
      font-size: 15px; color: var(--muted);
      margin: 0; line-height: 1.5;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 8px;
    }
    .cat-slot {
      border-radius: 18px;
      transition: transform 0.15s ease;
    }
    .cat-slot:active { transform: scale(0.96); }

    .banners {
  display: flex; flex-direction: column;
  gap: 16px; margin-top: 28px;
}
.banner {
  border-radius: 20px;
  padding: 20px;
}

.reviews {
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(20,20,28,0.05);
}
.reviews-top {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.rating { display: flex; flex-direction: column; }
.rating-num { 
  font-size: 28px; font-weight: 700;
  color: var(--ink); line-height: 1;
}
.stars { color: #FFB100; font-size: 13px; letter-spacing: 1px; margin-top: 2px; }
.avatars { display: flex; align-items: center; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--c); color: var(--tc);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  border: 2px solid #fff; margin-left: -8px;
}
.avatar:first-child { margin-left: 0; }
.avatar-count { font-size: 12px; color: var(--muted); margin-left: 8px; font-weight: 600; }
.quote {
  font-size: 15px; color: var(--ink);
  line-height: 1.5; margin: 0 0 6px;
  font-style: italic;
}
.quote-by { font-size: 12px; color: var(--muted); font-weight: 500; }

.offer {
  background: linear-gradient(135deg, #F3F0FF 0%, #FFEAF3 100%);
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.offer-tag {
  display: inline-block; font-size: 11px; font-weight: 600;
  color: #534AB7; background: #fff;
  padding: 4px 10px; border-radius: 999px; margin-bottom: 8px;
}
.offer-text h3 { 
  font-size: 18px; font-weight: 700;
  color: var(--ink); margin: 0; line-height: 1.3;
}
.offer-text .accent {
  background: var(--grad);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.offer-cta {
  flex-shrink: 0; border: none;
  background: var(--ink); color: #fff;
  font-size: 13px; font-weight: 600;
  padding: 10px 16px; border-radius: 999px;
  cursor: pointer;
}

.merchant {
  background: linear-gradient(135deg, #FFF7E6 0%, #FFEFD6 100%);
}
.merchant-tag {
  display: inline-block; font-size: 11px; font-weight: 600;
  color: #854F0B; background: #fff;
  padding: 4px 10px; border-radius: 999px; margin-bottom: 10px;
}
.merchant h3 { 
  font-size: 18px; font-weight: 700;
  color: var(--ink); margin: 0 0 4px;
}
.merchant p {
  font-size: 13px; color: var(--muted);
  margin: 0 0 14px; line-height: 1.4;
}
.merchant-cta {
  display: inline-block;
  background: var(--ink); color: #fff;
  font-size: 13px; font-weight: 600;
  padding: 10px 16px; border-radius: 999px;
  text-decoration: none;
}


    .footer {
      display: flex; justify-content: center; align-items: center;
      gap: 10px; padding: 40px 0 16px;
    }
    .footer a {
      font-size: 13px; color: var(--muted); text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover { color: var(--ink); }
    .footer .dot { color: var(--line); font-size: 13px; }
  `]
})
export class LandingComponent {
  categories = CATEGORIES;
  private router = inject(Router);
  private appStore = inject(AppStore);
  private booking = inject(BookingStore);

  onSelect(cat: Category) {
    this.appStore.addRecentCategory(cat.id);
    this.booking.patchDraft({ categoryId: cat.id, categoryName: cat.name });
    this.router.navigate(['/wizard']);
  }

  onInviteClick() {
    const url = 'https://wa.me/?text=Hey!%20I%20found%20this%20awesome%20app%20called%20Doorcall.%20You%20can%20book%20any%20home%20service%20in%20under%2060%20seconds.%20Check%20it%20out:%20https://play.google.com/store/apps/details?id=com.frycold.doorcall.app';
    window.open(url, '_blank');
  }

}