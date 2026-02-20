import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment'; 

export interface ShopProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Product {

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ShopProduct[]> {
    return this.http.get<ShopProduct[]>(environment.apiUrl + '/products');
  }

  getProductById(id: string): Observable<ShopProduct> {
    return this.http.get<ShopProduct>(`${environment.apiUrl}/products/${id}`);
  }
}

