import { Injectable } from '@angular/core';
import { OrderDraft } from '../../models/order.model';

interface QueuedOrder {
  id:        string;
  payload:   OrderDraft;
  createdAt: number;
  retries:   number;
}

const DB_NAME    = 'bookit_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_queue';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private db: IDBDatabase | null = null;

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = e => { this.db = (e.target as IDBOpenDBRequest).result; resolve(this.db); };
      req.onerror   = () => reject(req.error);
    });
  }

  async enqueue(payload: OrderDraft): Promise<string> {
    const db    = await this.open();
    const entry: QueuedOrder = { id: crypto.randomUUID(), payload, createdAt: Date.now(), retries: 0 };
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).add(entry);
      req.onsuccess = () => resolve(entry.id);
      req.onerror   = () => reject(req.error);
    });
  }

  async getAll(): Promise<QueuedOrder[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  async remove(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }
}