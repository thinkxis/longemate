import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  template: `
    <div class="page">
      <div class="emoji">🔧</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button class="btn" (click)="router.navigate(['/home'])">Go home</button>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; }
    .emoji { font-size: 64px; }
    h1 { font-size: 24px; font-weight: 700; color: #202124; margin: 0; }
    p  { font-size: 15px; color: #5F6368; margin: 0; text-align: center; }
    .btn { all: unset; background: #1A73E8; color: #fff; border-radius: 28px; padding: 14px 32px; font-size: 16px; font-weight: 600; cursor: pointer; }
  `]
})
export class ErrorComponent { router = inject(Router); }
