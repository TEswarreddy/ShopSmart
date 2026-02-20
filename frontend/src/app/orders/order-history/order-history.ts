import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OrderResponse, OrderService } from '../../services/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory {
  private readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly orders = signal<OrderResponse[]>([]);

  readonly isAdmin = computed(() => this.authService.role() === 'admin');
  readonly title = computed(() => (this.isAdmin() ? 'All Orders' : 'Your Order History'));

  readonly orderStatusOptions = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
  readonly paymentStatusOptions = ['Pending', 'Completed', 'Failed', 'Refunded'];

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set('');

    const request$ = this.isAdmin() ? this.orderService.getAllOrders() : this.orderService.getMyOrders();

    request$.subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message || 'Unable to load order history right now.');
        this.loading.set(false);
      }
    });
  }

  itemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  updateOrder(order: OrderResponse, event: Event, field: 'status' | 'paymentStatus'): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }

    const value = target.value;

    const payload =
      field === 'status'
        ? { status: value, paymentStatus: order.paymentStatus }
        : { status: order.orderStatus, paymentStatus: value };

    this.orderService.updateOrderStatus(order._id, payload).subscribe({
      next: (updatedOrder) => {
        this.orders.update((orders) =>
          orders.map((currentOrder) => (currentOrder._id === updatedOrder._id ? updatedOrder : currentOrder))
        );
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message || 'Unable to update order status.');
      }
    });
  }
}
