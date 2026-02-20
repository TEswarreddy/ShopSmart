import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, AdminShop } from '../../services/auth';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-dashboard.html',
  styleUrl: './role-dashboard.css'
})
export class RoleDashboard {
  shops: AdminShop[] = [];
  approvalLoading = false;
  approvalError = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.role() === 'admin') {
      this.loadShops();
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
}
