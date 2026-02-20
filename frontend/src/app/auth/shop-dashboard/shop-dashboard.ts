import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { OrderResponse, OrderService, ShopSalesReportResponse } from '../../services/order';
import { Product, ShopProduct } from '../../services/product';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './shop-dashboard.html',
  styleUrl: './shop-dashboard.css'
})
export class ShopDashboard {
  readonly sidebarItems = [
    { id: 'add-product', label: 'Add Product' },
    { id: 'manage-products', label: 'Manage Products' },
    { id: 'view-orders', label: 'View Orders' },
    { id: 'update-order-status', label: 'Update Order Status' },
    { id: 'sales-report', label: 'View Sales Report' }
  ] as const;

  activeSection: (typeof this.sidebarItems)[number]['id'] = 'add-product';
  sidebarOpen = false;

  loading = true;
  error = '';

  productForm: Partial<ShopProduct> = {
    title: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: ''
  };

  products: ShopProduct[] = [];
  selectedProduct: ShopProduct | null = null;
  savingProduct = false;
  deletingProductId = '';

  shopOrders: OrderResponse[] = [];
  orderStatusOptions = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
  paymentStatusOptions = ['Pending', 'Completed', 'Failed', 'Refunded'];

  salesReport: ShopSalesReportResponse | null = null;

  constructor(
    public authService: AuthService,
    private productService: Product,
    private orderService: OrderService
  ) {
    this.loadDashboard();
  }

  loadDashboard(): void {
    if (!this.authService.isShopApproved()) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.productService.getMyShopProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadShopOrders();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to load shop dashboard.';
        this.loading = false;
      }
    });
  }

  loadShopOrders(): void {
    this.orderService.getShopOrders().subscribe({
      next: (orders) => {
        this.shopOrders = orders;
        this.loadSalesReport();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to load shop orders.';
        this.loading = false;
      }
    });
  }

  loadSalesReport(): void {
    this.orderService.getShopSalesReport().subscribe({
      next: (report) => {
        this.salesReport = report;
        this.loading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to load sales report.';
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    if (!this.productForm.title || !this.productForm.description || !this.productForm.price) {
      this.error = 'Title, description, and price are required.';
      return;
    }

    this.savingProduct = true;
    this.error = '';

    this.productService.addShopProduct(this.productForm).subscribe({
      next: (product) => {
        this.products = [product, ...this.products];
        this.productForm = {
          title: '',
          description: '',
          price: 0,
          category: '',
          stock: 0,
          image: ''
        };
        this.savingProduct = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to add product.';
        this.savingProduct = false;
      }
    });
  }

  editProduct(product: ShopProduct): void {
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    if (!this.selectedProduct || !this.selectedProduct._id) {
      return;
    }

    this.savingProduct = true;
    this.error = '';

    this.productService.updateShopProduct(this.selectedProduct._id, this.selectedProduct).subscribe({
      next: (updated) => {
        this.products = this.products.map((product) =>
          product._id === updated._id ? updated : product
        );
        this.selectedProduct = null;
        this.savingProduct = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to update product.';
        this.savingProduct = false;
      }
    });
  }

  deleteProduct(productId: string): void {
    this.deletingProductId = productId;
    this.error = '';

    this.productService.deleteShopProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product._id !== productId);
        this.deletingProductId = '';
      },
      error: (err: { error?: { message?: string } }) => {
        this.error = err.error?.message || 'Unable to delete product.';
        this.deletingProductId = '';
      }
    });
  }

  updateOrderStatus(order: OrderResponse, status: string, paymentStatus: string): void {
    this.orderService
      .updateShopOrderStatus(order._id, { status, paymentStatus })
      .subscribe({
        next: (updatedOrder) => {
          this.shopOrders = this.shopOrders.map((item) =>
            item._id === updatedOrder._id ? updatedOrder : item
          );
          this.loadSalesReport();
        },
        error: (err: { error?: { message?: string } }) => {
          this.error = err.error?.message || 'Unable to update order status.';
        }
      });
  }

  selectSection(sectionId: (typeof this.sidebarItems)[number]['id']): void {
    this.activeSection = sectionId;
    this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  isSectionActive(sectionId: (typeof this.sidebarItems)[number]['id']): boolean {
    return this.activeSection === sectionId;
  }

  get activeSectionLabel(): string {
    const current = this.sidebarItems.find((item) => item.id === this.activeSection);
    return current?.label || 'Shop Dashboard';
  }
}
