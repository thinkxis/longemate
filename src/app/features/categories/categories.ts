 
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CATEGORIES, Category } from '../../models/category.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card';
import { AppStore } from '../../stores/app.store';
import { BookingStore } from '../../stores/booking.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent, MatIconModule],
  template: `
    <div class="page">
      <header class="top-bar">
        <button class="back" (click)="router.navigate(['/home'])" aria-label="Back"><mat-icon>arrow_back</mat-icon></button>
        <h1 class="title">Choose a service</h1>
      </header>
      <div class="grid">
        @for (cat of categories; track cat.id) {
          <app-category-card [category]="cat" (selected)="onSelect($event)" />
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 480px; margin: 0 auto; padding: 0 16px 40px; background: #fff; min-height: 100vh; }
    .top-bar { display: flex; align-items: center; gap: 12px; padding: 20px 0 16px; }
    .back { all: unset; font-size: 22px; cursor: pointer; color: #202124; padding: 4px; }
    .title { font-size: 22px; font-weight: 700; color: #202124; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  `]
})
export class CategoriesComponent {
  categories = CATEGORIES;
  router     = inject(Router);
  private appStore = inject(AppStore);
  private booking  = inject(BookingStore);

  onSelect(cat: Category) {
    this.appStore.addRecentCategory(cat.id);
    this.booking.patchDraft({ categoryId: cat.id, categoryName: cat.name });
    this.router.navigate(['/wizard']);
  }
}