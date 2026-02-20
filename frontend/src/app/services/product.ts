import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment'; 

export interface ShopProduct {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  rating?: number;
  numReviews?: number;
  reviews?: Array<{
    _id?: string;
    name: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class Product {

  constructor(private http: HttpClient) {}

  getProducts(filters?: { search?: string; category?: string }): Observable<ShopProduct[]> {
    const params = new URLSearchParams();

    if (filters?.search?.trim()) {
      params.set('search', filters.search.trim());
    }

    if (filters?.category?.trim()) {
      params.set('category', filters.category.trim());
    }

    const query = params.toString();
    const url = query
      ? `${environment.apiUrl}/products?${query}`
      : `${environment.apiUrl}/products`;

    return this.http.get<ShopProduct[]>(url);
  }

  getProductById(id: string): Observable<ShopProduct> {
    return this.http.get<ShopProduct>(`${environment.apiUrl}/products/${id}`);
  }
}

