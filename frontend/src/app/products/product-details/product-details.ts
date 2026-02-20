import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ShopProduct } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { catchError, of, switchMap, tap, timeout } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product: ShopProduct | null = null;
  loading = true;
  error = '';
  reviewRating = 5;
  reviewComment = '';
  submittingReview = false;
  reviewError = '';
  reviewSuccess = '';

  constructor(
    private route: ActivatedRoute,
    private productService: Product,
    private cartService: CartService,
    public authService: AuthService
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

  submitReview(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.reviewError = 'Please login to submit a review.';
      this.reviewSuccess = '';
      return;
    }

    if (this.reviewRating < 1 || this.reviewRating > 5) {
      this.reviewError = 'Rating must be between 1 and 5.';
      this.reviewSuccess = '';
      return;
    }

    if (!this.reviewComment.trim()) {
      this.reviewError = 'Comment is required.';
      this.reviewSuccess = '';
      return;
    }

    this.submittingReview = true;
    this.reviewError = '';
    this.reviewSuccess = '';

    this.productService
      .addReview(this.product._id, {
        rating: this.reviewRating,
        comment: this.reviewComment.trim(),
      })
      .pipe(
        switchMap(() => this.productService.getProductById(this.product!._id)),
        catchError((err: { error?: { message?: string } }) => {
          this.reviewError = err.error?.message || 'Unable to submit review. Please try again.';
          this.submittingReview = false;
          return of(null);
        })
      )
      .subscribe((updatedProduct) => {
        if (updatedProduct) {
          this.product = updatedProduct;
          this.reviewSuccess = 'Review submitted successfully.';
          this.reviewComment = '';
          this.reviewRating = 5;
        }

        this.submittingReview = false;
      });
  }

}
