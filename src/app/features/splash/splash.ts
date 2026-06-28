import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [
RouterModule, MatIconModule
  ],
  template: `
    <div class="splash">
      <div class="logo" routerLink="/">
        <span class="logo-name">Door<br>Call<mat-icon  
        style=" transform: scale(1.5);">doorbell</mat-icon></span>
      </div>
      <p class="tagline">Book any home service in under 60 seconds.</p>
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .splash {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #1A73E8; gap: 16px;
    }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-mark {
      width: 56px; height: 56px; border-radius: 16px;
      background: #fff; color: #1A73E8;
      font-size: 32px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-name { 
      background: #000; padding: 8px 16px; border-radius: 8px; 
      font-size: 42px; line-height: 42px; font-weight: bold; color: #fff; margin-bottom: 24px; letter-spacing: 1px;  }
    .tagline   { color: rgba(255,255,255,0.85); font-size: 16px; margin: 0; }
    .spinner {
      width: 28px; height: 28px; border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SplashComponent implements OnInit {
  private router = inject(Router);
  ngOnInit() { 
    setTimeout(() => this.router.navigate(['/home']), 1800); 

  }
}
