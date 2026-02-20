import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, AdminShop, AdminUser } from '../../services/auth';
import { Product, ShopProduct } from '../../services/product';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-dashboard.html',
  styleUrl: './role-dashboard.css'
})
export class RoleDashboard {
  shops: AdminShop[] = [];
  users: AdminUser[] = [];
  products: ShopProduct[] = [];
  approvalLoading = false;
  approvalError = '';
  productLoading = false;
  productError = '';

  constructor(public authService: AuthService, private productService: Product) {}

  ngOnInit(): void {
    if (this.authService.role() === 'admin') {
      this.loadShops();
      this.loadUsers();
      this.loadProducts();
    }
  }

  readonly heading = computed(() => {
    const role = this.authService.role();

    if (role === 'admin') {
      return 'Admin Dashboard';
    }
    if (role === 'shop') {
      return 'Shop Dashboard';
    }
    return 'User Dashboard';
  });

  readonly description = computed(() => {
    const role = this.authService.role();

    if (role === 'admin') {
      return 'Manage platform access and monitor operations from this admin panel.';
    }
    if (role === 'shop') {
      return 'Manage your store activity and continue to the shopping experience.';
    }
    return 'Welcome back. Continue exploring products and complete your orders.';
  });

  readonly primaryRoute = computed(() => {
    const role = this.authService.role();

    if (role === 'user') {
      return '/';
    }

    return '/';
  });

  readonly primaryLabel = computed(() => {
    const role = this.authService.role();

    if (role === 'shop') {
      return 'Go to Products';
    }
    if (role === 'admin') {
      return 'View Storefront';
    }
    return 'Browse Products';
  });

  loadShops(): void {
    this.approvalLoading = true;
    this.approvalError = '';

    this.authService.getAllShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.approvalLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to load shops.';
        this.approvalLoading = false;
      }
    });
  }

  updateShopStatus(shopId: string, status: 'pending' | 'approved' | 'rejected' | 'suspended'): void {
    this.approvalError = '';

    this.authService.updateShopStatus(shopId, status).subscribe({
      next: () => {
        this.loadShops();
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to update shop status.';
      }
    });
  }

  deleteShop(shopId: string): void {
    this.approvalError = '';

    this.authService.deleteShop(shopId).subscribe({
      next: () => {
        this.shops = this.shops.filter((shop) => shop._id !== shopId);
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to delete shop.';
      }
    });
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to load users.';
      }
    });
  }

  toggleUserBlock(user: AdminUser): void {
    this.approvalError = '';

    this.authService.updateUserBlockStatus(user._id, !user.isBlocked).subscribe({
      next: (updated) => {
        this.users = this.users.map((item) => (item._id === updated._id ? updated : item));
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to update user block status.';
      }
    });
  }

  deleteUser(userId: string): void {
    this.approvalError = '';

    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user._id !== userId);
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to delete user.';
      }
    });
  }

  loadProducts(): void {
    this.productLoading = true;
    this.productError = '';

    this.productService.getAllProductsForAdmin().subscribe({
      next: (products) => {
        this.products = products;
        this.productLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.productError = err.error?.message || 'Unable to load products.';
        this.productLoading = false;
      }
    });
  }

  removeInappropriateProduct(productId: string): void {
    this.productError = '';

    this.productService.deleteProductAsAdmin(productId).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product._id !== productId);
      },
      error: (err: { error?: { message?: string } }) => {
        this.productError = err.error?.message || 'Unable to remove product.';
      }
    });
  }
}
