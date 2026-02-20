import { Injectable, signal, computed } from '@angular/core';
import { ShopProduct } from './product';

const CART_KEY = 'shopsmart_cart';

export interface CartItem {
  product: ShopProduct;
  quantity: number;
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

  addToCart(product: ShopProduct): void {
    const items = [...this.itemsSignal()];
    const index = items.findIndex((item) => item.product._id === product._id);

    if (index > -1) {
      items[index] = { ...items[index], quantity: items[index].quantity + 1 };
    } else {
      items.push({ product, quantity: 1 });
    }

    this.updateItems(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.itemsSignal().map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    );

    this.updateItems(items);
  }

  removeFromCart(productId: string): void {
    const items = this.itemsSignal().filter((item) => item.product._id !== productId);
    this.updateItems(items);
  }

  clearCart(): void {
    this.updateItems([]);
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
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