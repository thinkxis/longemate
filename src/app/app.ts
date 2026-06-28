import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineBannerComponent } from './shared/components/offline-banner/offline-banner';
import { ApiService } from './core/services/api.service';
import { NetworkService } from './core/services/network.service';
import { effect } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OfflineBannerComponent],

  template: `
    <app-offline-banner />
    <router-outlet />
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--md-sys-color-surface-variant); }
  `]
})
export class App  implements OnInit {
  private api     = inject(ApiService);
  private network = inject(NetworkService);

  constructor() {
    // Drain queued offline orders when connectivity returns
    effect(() => {
      if (this.network.online()) {
        this.api.drainOfflineQueue();
      }
    }, { allowSignalWrites: true });

  }
  ngOnInit() {
  }
}
