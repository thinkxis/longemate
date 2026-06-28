
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div class="skeleton-wrap" aria-hidden="true">
      @for (i of lines; track i) {
        <div class="line" [class.short]="i % 3 === 0"></div>
      }
    </div>
  `,
  styles: [`
    .skeleton-wrap { padding: 16px; }
    .line {
      height: 16px; border-radius: 8px;
      background: linear-gradient(90deg, #F1F3F4 25%, #E8EAED 50%, #F1F3F4 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      margin-bottom: 12px;
    }
    .line.short { width: 60%; }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  count = input<number>(4);
  get lines() { return Array.from({ length: this.count() }, (_, i) => i + 1); }
}
