import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart';
import { OrderService } from '../services/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  error = '';
  successMessage = '';
  placedOrderId = '';
  paymentOrderId = '';

  readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['India', [Validators.required]],
    paymentMethod: ['COD' as 'COD' | 'ONLINE', [Validators.required]],
    saveAddress: [true]
  });

  readonly subtotal = computed(() => this.cartService.subtotal());
  readonly shippingCharge = computed(() => (this.subtotal() > 999 ? 0 : 79));
  readonly tax = computed(() => Math.round(this.subtotal() * 0.18));
  readonly grandTotal = computed(() => this.subtotal() + this.shippingCharge() + this.tax());

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  submit(): void {
    if (this.cartService.items().length === 0) {
      this.error = 'Your cart is empty. Add products before checkout.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.paymentOrderId = '';

    const value = this.form.getRawValue();

    this.orderService
      .placeOrder({
        shippingAddress: {
          address: value.address,
          city: value.city,
          postalCode: value.postalCode,
          country: value.country
        },
        paymentMethod: value.paymentMethod,
        items: this.cartService.items().map((item) => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      })
      .subscribe({
        next: (order) => {
          this.placedOrderId = order._id;

          if (value.paymentMethod === 'ONLINE') {
            this.createPaymentOrder(order._id);
            return;
          }

          this.loading = false;
          this.successMessage = `Order placed successfully. Order ID: ${order._id}`;
          this.cartService.clearCart();
        },
        error: (err: { error?: { message?: string } }) => {
          this.loading = false;
          this.error = err.error?.message || 'Checkout failed. Please try again.';
        }
      });
  }

  private createPaymentOrder(orderId: string): void {
    this.orderService.createPaymentOrder(orderId).subscribe({
      next: (res) => {
        this.loading = false;
        this.paymentOrderId = res.razorpayOrderId;
        this.successMessage = `Order created. Complete payment using Razorpay Order ID: ${res.razorpayOrderId}`;
        this.cartService.clearCart();
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        this.error =
          err.error?.message ||
          'Order was placed, but payment initialization failed. Please contact support with your order ID.';
      }
    });
  }

  fieldError(
    controlName: 'fullName' | 'phone' | 'address' | 'city' | 'postalCode' | 'country'
  ): string {
    const control = this.form.controls[controlName];

    if (!control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['minlength']) {
      return 'Please enter a valid value.';
    }

    return 'Invalid value.';
  }

  goToProducts(): void {
    void this.router.navigateByUrl('/');
  }
}
