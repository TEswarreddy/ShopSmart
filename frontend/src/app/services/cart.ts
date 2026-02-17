import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addToCart(data: any) {
    return this.http.post(`${this.apiUrl}/cart`, data);
  }

  getCart() {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  updateCart(data: any) {
    return this.http.put(`${this.apiUrl}/cart`, data);
  }

  removeFromCart(data: any) {
    return this.http.delete(`${this.apiUrl}/cart`, { body: data });
  }
}
