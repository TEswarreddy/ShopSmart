import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart';
import { OrderService } from '../services/order';
import { AuthService } from '../services/auth';

const CHECKOUT_ADDRESS_KEY = 'shopsmart_checkout_address';

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    orderId: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

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
  requiresPayment = false;
  redirectingToOrders = false;

  readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.minLength(4)]],
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
    private router: Router,
    private authService: AuthService
  ) {
    this.patchSavedAddress();
  }

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
    this.requiresPayment = false;

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

          if (value.saveAddress) {
            this.saveAddressLocally();
          }

          if (value.paymentMethod === 'ONLINE') {
            this.requiresPayment = true;
            this.createPaymentOrder(order._id, value.fullName, value.phone);
            return;
          }

          this.loading = false;
          this.successMessage = `Order placed successfully. Order ID: ${order._id}. Redirecting to My Orders...`;
          this.cartService.clearCart();
          this.redirectToMyOrders();
        },
        error: (err: { error?: { message?: string } }) => {
          this.loading = false;
          this.error = err.error?.message || 'Checkout failed. Please try again.';
        }
      });
  }

  retryPayment(): void {
    if (!this.placedOrderId || !this.requiresPayment) {
      return;
    }

    const value = this.form.getRawValue();
    this.loading = true;
    this.error = '';
    this.createPaymentOrder(this.placedOrderId, value.fullName, value.phone);
  }

  private createPaymentOrder(orderId: string, fullName: string, phone: string): void {
    this.orderService.createPaymentOrder(orderId).subscribe({
      next: (res) => {
        this.loading = false;
        this.paymentOrderId = res.razorpayOrderId;
        this.launchRazorpay({
          keyId: res.keyId,
          amount: res.amount,
          currency: res.currency,
          razorpayOrderId: res.razorpayOrderId,
          appOrderId: orderId,
          fullName,
          phone
        });
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        this.error =
          err.error?.message ||
          'Order was placed, but payment initialization failed. Please contact support with your order ID.';
      }
    });
  }

  private launchRazorpay(config: {
    keyId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    appOrderId: string;
    fullName: string;
    phone: string;
  }): void {
    if (!window.Razorpay) {
      this.error = 'Razorpay SDK failed to load. Please refresh and try again.';
      return;
    }

    const user = this.authService.user();

    const options: RazorpayOptions = {
      key: config.keyId,
      amount: config.amount,
      currency: config.currency,
      name: 'ShopSmart',
      description: `Order #${config.appOrderId}`,
      order_id: config.razorpayOrderId,
      prefill: {
        name: config.fullName,
        email: user?.email,
        contact: config.phone
      },
      notes: {
        orderId: config.appOrderId
      },
      handler: (response: RazorpayPaymentResponse) => {
        this.verifyPayment(response, config.appOrderId);
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', (event) => {
      this.error = event.error?.description || 'Payment failed. You can retry payment.';
    });
    razorpay.open();
  }

  private verifyPayment(response: RazorpayPaymentResponse, orderId: string): void {
    this.loading = true;
    this.error = '';

    this.orderService
      .verifyPayment({
        ...response,
        orderId
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.requiresPayment = false;
          this.successMessage = `Payment completed and order confirmed. Order ID: ${orderId}. Redirecting to My Orders...`;
          this.cartService.clearCart();
          this.redirectToMyOrders();
        },
        error: (err: { error?: { message?: string } }) => {
          this.loading = false;
          this.error =
            err.error?.message || 'Payment captured, but verification failed. Please contact support.';
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

    if (control.errors['pattern']) {
      return 'Please enter a valid phone number.';
    }

    return 'Invalid value.';
  }

  goToProducts(): void {
    void this.router.navigateByUrl('/');
  }

  goToMyOrders(): void {
    void this.router.navigateByUrl('/orders');
  }

  private redirectToMyOrders(): void {
    this.redirectingToOrders = true;

    setTimeout(() => {
      this.goToMyOrders();
    }, 1200);
  }

  private saveAddressLocally(): void {
    const value = this.form.getRawValue();

    const address = {
      fullName: value.fullName,
      phone: value.phone,
      address: value.address,
      city: value.city,
      postalCode: value.postalCode,
      country: value.country
    };

    localStorage.setItem(CHECKOUT_ADDRESS_KEY, JSON.stringify(address));
  }

  private patchSavedAddress(): void {
    const raw = localStorage.getItem(CHECKOUT_ADDRESS_KEY);
    if (!raw) {
      return;
    }

    try {
      const saved = JSON.parse(raw) as {
        fullName?: string;
        phone?: string;
        address?: string;
        city?: string;
        postalCode?: string;
        country?: string;
      };

      this.form.patchValue({
        fullName: saved.fullName || '',
        phone: saved.phone || '',
        address: saved.address || '',
        city: saved.city || '',
        postalCode: saved.postalCode || '',
        country: saved.country || 'India'
      });
    } catch {
      localStorage.removeItem(CHECKOUT_ADDRESS_KEY);
    }
  }
}
