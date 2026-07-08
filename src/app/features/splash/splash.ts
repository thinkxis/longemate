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
      <div class="logo" >
        <img src="assets/logoSquare.png" alt="lodgemate Logo" />
      </div>
      <p class="tagline">Book any home service in under 60 seconds.</p>
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .splash {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #686DF4; gap: 16px;
    }
    .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
    img { height: 169px; vertical-align: middle; background: #000; padding: 0 16px; border-radius: 4px; }
    }
    .logo-mark {
      width: 56px; height: 56px; border-radius: 16px;
      background: #fff; color: #1A73E8;
      font-size: 32px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
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
