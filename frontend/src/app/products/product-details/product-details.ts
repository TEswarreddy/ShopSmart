import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ShopProduct } from '../../services/product';
import { CartService } from '../../services/cart';
import { catchError, of, switchMap, tap, timeout } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product: ShopProduct | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: Product,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.error = '';
          this.product = null;
        }),
        switchMap((params) => {
          const id = params.get('id');

          if (!id) {
            this.error = 'Invalid product.';
            this.loading = false;
            return of(null);
          }

          return this.productService.getProductById(id).pipe(
            timeout(10000),
            catchError(() => {
              this.error = 'Unable to load product details. Please try again.';
              return of(null);
            })
          );
        })
      )
      .subscribe((res) => {
        if (res) {
          this.product = res;
        }

        this.loading = false;
      });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

}
