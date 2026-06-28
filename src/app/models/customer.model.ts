import { Address } from './address.model';
 
export interface CustomerProfile {
  name:      string;
  phone:     string;
  addresses: Address[];   // most recent first, max 3
}
 
export const EMPTY_CUSTOMER: CustomerProfile = {
  name: '', phone: '', addresses: []
};