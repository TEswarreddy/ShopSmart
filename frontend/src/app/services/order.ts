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
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      title: string;
      price: number;
      image?: string;
      category?: string;
    };
    quantity: number;
  }>;
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export interface UpdateOrderStatusPayload {
  status?: string;
  paymentStatus?: string;
}

export interface ShopSalesReportResponse {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  recentOrders: OrderResponse[];
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

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/myorders`);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: string, payload: UpdateOrderStatusPayload): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${environment.apiUrl}/orders/${orderId}`, payload);
  }

  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${orderId}/cancel`, {});
  }

  verifyPayment(payload: VerifyPaymentPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/payment/verify`, payload);
  }

  getShopOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/shop`);
  }

  updateShopOrderStatus(orderId: string, payload: UpdateOrderStatusPayload): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${environment.apiUrl}/orders/shop/${orderId}/status`, payload);
  }

  getShopSalesReport(): Observable<ShopSalesReportResponse> {
    return this.http.get<ShopSalesReportResponse>(`${environment.apiUrl}/orders/shop/sales-report`);
  }
}
