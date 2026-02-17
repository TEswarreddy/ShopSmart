import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent implements OnInit {

  cart: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((res: any) => {
      this.cart = res;
    });
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart({ productId })
      .subscribe(() => this.loadCart());
  }
}
