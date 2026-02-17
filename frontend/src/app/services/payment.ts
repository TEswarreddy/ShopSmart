import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPaymentOrder(orderId: string) {
    return this.http.post(`${this.apiUrl}/payment/create-order`, { orderId });
  }

  verifyPayment(data: any) {
    return this.http.post(`${this.apiUrl}/payment/verify`, data);
  }
}
