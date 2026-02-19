import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // optional, if standalone
import { HttpClientModule } from '@angular/common/http'; 
// import { Product } from '../services/product';
import { Product } from '../../services/product'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

products: any[] = [];

  // Inject the Product service
  constructor(private product: Product) {}

  // Call getProducts in ngOnInit
  ngOnInit(): void {
    console.log('Fetching products...');
    this.product.getProducts().subscribe((res: any) => {
      this.products = res;
      console.log('Products fetched:', this.products);
    });  

  }
}

