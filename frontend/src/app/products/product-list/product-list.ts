import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // optional, if standalone
import { RouterLink } from '@angular/router';
import { Product, ShopProduct } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  products: ShopProduct[] = [];
  filteredProducts: ShopProduct[] = [];
  loading = true;
  error = '';
  search = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private product: Product,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.product.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.categories = [...new Set(res.map((item) => item.category).filter(Boolean) as string[])].sort();
        this.filteredProducts = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load products right now. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.search = term;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  addToCart(item: ShopProduct): void {
    this.cartService.addToCart(item);
  }

  private applyFilters(): void {
    const query = this.search.trim().toLowerCase();

    this.filteredProducts = this.products.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;

      return !!matchesSearch && matchesCategory;
    });
  }

  productId(item: ShopProduct): string {
    return item._id || item.id || '';
  }
}

