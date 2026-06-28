import { CanActivateFn } from '@angular/router';

export const offlineGuard: CanActivateFn = (route, state) => {
  return true;
};
