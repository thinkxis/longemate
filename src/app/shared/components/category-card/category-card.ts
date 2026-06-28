
import { Component, input, output } from '@angular/core';
import { Category } from '../../../models/category.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    MatIconModule
  ],
  template: `
    <button class="card" (click)="selected.emit(category())"
            [attr.aria-label]="'Book ' + category().name">
      <div class="icon-wrap">
        <span class="icon-text"><mat-icon>{{ category().icon }}</mat-icon></span>
      </div>
      <div class="name">{{ category().name }}</div>
      <div class="desc">{{ category().description }}</div>
      <div class="meta">
        <span class="time">{{ category().responseTime }}</span>
        <span class="price">{{ category().startingPrice }}</span>
      </div>
    </button>
  `,
  styles: [`
    .card {
      all: unset;
      display: flex; flex-direction: column;
      background: #fff;
      border: 1px solid #E8EAED;
      border-radius: 16px;
      padding: 16px 14px 14px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s;
      width: 100%; box-sizing: border-box;
    }
    .card:hover  { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #1A73E8; }
    .card:active { transform: scale(0.97); }
    .card:focus-visible { outline: 3px solid #1A73E8; outline-offset: 2px; }
    .icon-wrap {
      width: 44px; height: 44px; border-radius: 12px;
      background: #E8F0FE;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px; font-size: 22px;
    }
    .name  { font-size: 15px; font-weight: 600; color: #202124; margin-bottom: 4px; }
    .desc  { font-size: 12px; color: #5F6368; margin-bottom: 10px; line-height: 1.4; flex: 1; }
    .meta  { display: flex; justify-content: space-between; align-items: center; }
    .time  { font-size: 11px; color: #80868B; }
    .price { font-size: 12px; color: #1A73E8; font-weight: 600; }
  `]
})
export class CategoryCardComponent {
  category = input.required<Category>();
  selected = output<Category>();
 
}