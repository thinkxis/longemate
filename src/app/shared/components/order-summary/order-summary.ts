
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDraft } from '../../../models/order.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary">
      <div class="row"><span class="label">Service</span><span class="val">{{ order().categoryName }}</span></div>
      <div class="row"><span class="label">Description</span><span class="val">{{ order().description }}</span></div>
      <div class="row">
        <span class="label">Location</span>
        <span class="val">{{ order().address.line1 }}{{ order().address.landmark ? ', ' + order().address.landmark : '' }}, {{ order().address.city }}</span>
      </div>
      <div class="row"><span class="label">When</span><span class="val">{{ scheduleLabel() }}</span></div>
      @if (order().notes) {
        <div class="row"><span class="label">Notes</span><span class="val">{{ order().notes }}</span></div>
      }
      <div class="divider"></div>
      <div class="row"><span class="label">Name</span><span class="val">{{ order().customer.name }}</span></div>
      <div class="row"><span class="label">Phone</span><span class="val">{{ order().customer.phone }}</span></div>
    </div>
  `,
  styles: [`
    .summary { background: #F8F9FA; border-radius: 12px; padding: 16px; }
    .row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #E8EAED; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #5F6368; white-space: nowrap; }
    .val   { font-size: 13px; color: #202124; font-weight: 500; text-align: right; }
    .divider { height: 8px; }
  `]
})
export class OrderSummaryComponent {
  order = input.required<OrderDraft>();

  scheduleLabel() {
    const s = this.order().schedule;
    if (s === 'asap')      return 'As soon as possible';
    if (s === 'today')     return 'Today';
    if (s === 'tomorrow')  return 'Tomorrow';
    if (s === 'this-week') return 'This week';
    return this.order().scheduledAt ?? s;
  }
}