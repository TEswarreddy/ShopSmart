import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutItemPayload {
  product: string;
  quantity: number;
}

export interface PlaceOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'ONLINE';
  items: CheckoutItemPayload[];
}

export interface OrderResponse {
  _id: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(payload: PlaceOrderPayload): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, payload);
  }

  createPaymentOrder(orderId: string): Observable<PaymentOrderResponse> {
    return this.http.post<PaymentOrderResponse>(`${environment.apiUrl}/payment/create-order`, {
      orderId
    });
  }
}
