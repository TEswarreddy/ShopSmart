import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  placeOrder(data: any) {
    return this.http.post(`${this.apiUrl}/orders`, data);
  }

  getMyOrders() {
    return this.http.get(`${this.apiUrl}/orders/myorders`);
  }

  getAllOrders() {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  updateOrder(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/orders/${id}`, data);
  }
}
