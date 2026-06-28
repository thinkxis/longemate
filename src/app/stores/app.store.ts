
import { Injectable, signal, effect } from '@angular/core';

const CAT_KEY = 'bk_recent_cats';

@Injectable({ providedIn: 'root' })
export class AppStore {
  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly recentCategories = signal<string[]>(
    JSON.parse(localStorage.getItem(CAT_KEY) ?? '[]')
  );

  constructor() {
    window.addEventListener('online',  () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
    effect(() => {
      localStorage.setItem(CAT_KEY, JSON.stringify(this.recentCategories()));
    });
  }

  addRecentCategory(id: string) {
    this.recentCategories.update(cats =>
      [id, ...cats.filter(c => c !== id)].slice(0, 3)
    );
  }
}