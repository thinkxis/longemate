import { Injectable } from '@angular/core';
 

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch { return null; }
  }

  set<T>(key: string, value: T): void {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* quota exceeded – silently ignore */ }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
