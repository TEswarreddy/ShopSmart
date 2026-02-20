import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { ShopProduct } from './product';
import { environment } from './environment';
import { AuthService } from './auth';

const CART_KEY = 'shopsmart_cart';

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

interface CartApiItem {
  product: ShopProduct;
  quantity: number;
}

interface CartApiResponse {
  items?: CartApiItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.readFromStorage());

  readonly items = this.itemsSignal.asReadonly();
  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.refreshCart();
    }
  }

  addToCart(product: ShopProduct): void {
    const productId = this.productId(product);
    if (!productId) {
      return;
    }

    this.http
      .post<CartApiResponse>(`${environment.apiUrl}/cart`, { productId, quantity: 1 })
      .pipe(
        catchError(() => {
          this.addToLocalCart(product);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.updateItems(this.mapApiItems(response.items));
        }
      });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.http
      .put<CartApiResponse>(`${environment.apiUrl}/cart`, { productId, quantity })
      .pipe(
        catchError(() => {
          this.updateLocalQuantity(productId, quantity);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.updateItems(this.mapApiItems(response.items));
        }
      });
  }

  removeFromCart(productId: string): void {
    this.http
      .request<CartApiResponse>('delete', `${environment.apiUrl}/cart`, { body: { productId } })
      .pipe(
        catchError(() => {
          this.removeFromLocalCart(productId);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.updateItems(this.mapApiItems(response.items));
        }
      });
  }

  clearCart(): void {
    const currentItems = this.itemsSignal();

    if (currentItems.length === 0) {
      return;
    }

    currentItems.forEach((item) => {
      const id = this.productId(item.product);
      if (!id) {
        return;
      }

      this.http.request('delete', `${environment.apiUrl}/cart`, { body: { productId: id } }).subscribe({
        next: () => {
          this.removeFromLocalCart(id);
        },
        error: () => {
          this.removeFromLocalCart(id);
        }
      });
    });

    this.updateItems([]);
  }

  refreshCart(): void {
    this.http
      .get<CartApiResponse>(`${environment.apiUrl}/cart`)
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        if (response) {
          this.updateItems(this.mapApiItems(response.items));
        }
      });
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  private mapApiItems(items?: CartApiItem[]): CartItem[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.filter((item) => !!item.product).map((item) => ({
      product: item.product,
      quantity: Number(item.quantity || 1)
    }));
  }

  private productId(product: ShopProduct): string {
    return product._id || product.id || '';
  }

  private addToLocalCart(product: ShopProduct): void {
    const productId = this.productId(product);
    const items = [...this.itemsSignal()];
    const index = items.findIndex((item) => this.productId(item.product) === productId);

    if (index > -1) {
      items[index] = { ...items[index], quantity: items[index].quantity + 1 };
    } else {
      items.push({ product, quantity: 1 });
    }

    this.updateItems(items);
  }

  private updateLocalQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromLocalCart(productId);
      return;
    }

    const items = this.itemsSignal().map((item) =>
      this.productId(item.product) === productId ? { ...item, quantity } : item
    );

    this.updateItems(items);
  }

  private removeFromLocalCart(productId: string): void {
    const items = this.itemsSignal().filter((item) => this.productId(item.product) !== productId);
    this.updateItems(items);
  }

  private readFromStorage(): CartItem[] {
    const cart = localStorage.getItem(CART_KEY);
    if (!cart) {
      return [];
    }

    try {
      return JSON.parse(cart) as CartItem[];
    } catch {
      return [];
    }
  }
}