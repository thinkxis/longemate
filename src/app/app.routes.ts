import { Routes } from '@angular/router';
 

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/splash/splash').then(m => m.SplashComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.LandingComponent),
  },
  {
    path: 'book',
    loadComponent: () =>
      import('./features/categories/categories').then(m => m.CategoriesComponent),
  },
  // {
  //   path: 'book/:categoryId',
  //   loadComponent: () =>
  //     import('./features/services/services').then(m => m.Services),
  // },
  {
    path: 'wizard',
    loadComponent: () =>
      import('./features/booking/booking-wizard/booking-wizard').then(m => m.BookingWizardComponent),
  },
  {
    path: 'review',
    loadComponent: () =>
      import('./features/review/review').then(m => m.ReviewComponent),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment').then(m => m.PaymentComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./features/success/success').then(m => m.SuccessComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings').then(m => m.SettingsComponent),
  },
  {
    path: 'offline',
    loadComponent: () =>
      import('./features/offline-status/offline-status').then(m => m.OfflineStatusComponent),
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/order-status/order-status.component').then(m => m.OrderStatusComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/error').then(m => m.ErrorComponent),
  },
];