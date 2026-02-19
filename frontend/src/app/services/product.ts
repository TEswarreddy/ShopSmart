import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment'; 

@Injectable({
  providedIn: 'root',
})
export class Product {

  constructor(private http: HttpClient) {}
  //private apiUrl: string = 'https://fakestoreapi.com/products';
  
    getProducts() {
    return this.http.get(environment.apiUrl + '/products'); 
  }
// getProducts() {
//     return this.http.get(this.apiUrl);
//   }
  getProductById(id: string) {
    return this.http.get(`${environment.apiUrl}/products/${id}`);
  }
}

