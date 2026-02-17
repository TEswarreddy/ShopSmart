import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${this.apiUrl}/products`);
  }

  getProductById(id: string) {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  addProduct(data: any) {
    return this.http.post(`${this.apiUrl}/products`, data);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/products/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
