import { Address } from './address.model';
import { CustomerProfile } from './customer.model';
 
export type ScheduleOption = 'asap' | 'today' | 'tomorrow' | 'this-week' | 'custom';
 
export interface OrderDraft {
  categoryId:   string;
  categoryName: string;
  description:  string;
  address:      Address;
  schedule:     ScheduleOption;
  scheduledAt:  string | null;   // ISO datetime for 'custom'
  notes:        string;
  customer:     CustomerProfile;
}
 
export interface OrderResponse {
  orderId:       string;
  razorpayOrderId: string;
  amount:        number;  // paise (₹90)
  currency:      string;  // 'INR'
}
 
export const EMPTY_DRAFT: OrderDraft = {
  categoryId:   '',
  categoryName: '',
  description:  '',
  address:      { line1: '', landmark: '', city: '', pincode: '' },
  schedule:     'asap',
  scheduledAt:  null,
  notes:        '',
  customer:     { name: '', phone: '', addresses: [] },
};