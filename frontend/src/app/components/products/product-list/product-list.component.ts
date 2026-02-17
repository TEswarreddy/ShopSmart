import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res;
    });
  }

  addToCart(productId: string) {
    this.cartService.addToCart({
      productId,
      quantity: 1
    }).subscribe(() => {
      alert('Product added to cart');
    });
  }
}
