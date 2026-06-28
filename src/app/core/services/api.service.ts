import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, timeout, retry, switchMap } from 'rxjs/operators';
import { OrderDraft, OrderResponse } from '../../models/order.model';
import { IndexedDbService } from './indexed-db.service';
import { NetworkService } from './network.service';

// const production = true;  
const production = false; 

const BASE = production ? '/api' : 'http://localhost:3000' + '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http    = inject(HttpClient);
  private idb     = inject(IndexedDbService);
  private network = inject(NetworkService);

  // Creates a Razorpay order on the server → returns order details
  createOrder(draft: OrderDraft): Observable<OrderResponse> {
    if (!this.network.online()) {
      // Queue locally, return a fake order id so UI can proceed
      return from(this.idb.enqueue(draft)).pipe(
        switchMap(id => throwError(() => ({ offline: true, localId: id })))
      );
    }
    return this.http.post<OrderResponse>(`${BASE}/orders`, draft).pipe(
      timeout(12_000),
      retry({ count: 2, delay: 2000 }),
      catchError(err => {
        // Network failed mid-request – queue it
        return from(this.idb.enqueue(draft)).pipe(
          switchMap(id => throwError(() => ({ offline: true, localId: id })))
        );
      })
    );
  }

  // Verify payment after Razorpay callback
  verifyPayment(data: {
    razorpay_order_id:   string;
    razorpay_payment_id: string;
    razorpay_signature:  string;
    orderId:             string;
  }): Observable<{ success: boolean; orderId: string }> {
    return this.http.post<{ success: boolean; orderId: string }>(
      `${BASE}/orders/verify`, data
    ).pipe(timeout(10_000));
  }

  // Drain offline queue when connectivity returns
  async drainOfflineQueue(): Promise<void> {
    if (!this.network.online()) return;
    const queue = await this.idb.getAll();
    for (const item of queue) {
      try {
        await this.http.post<OrderResponse>(`${BASE}/orders`, item.payload)
          .pipe(timeout(10_000))
          .toPromise();
        await this.idb.remove(item.id);
      } catch { /* leave in queue, try next time */ }
    }
  }
}