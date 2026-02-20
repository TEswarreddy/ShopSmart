import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, PendingShop } from '../../services/auth';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-dashboard.html',
  styleUrl: './role-dashboard.css'
})
export class RoleDashboard {
  pendingShops: PendingShop[] = [];
  approvalLoading = false;
  approvalError = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.role() === 'admin') {
      this.loadPendingShops();
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

  loadPendingShops(): void {
    this.approvalLoading = true;
    this.approvalError = '';

    this.authService.getPendingShops().subscribe({
      next: (shops) => {
        this.pendingShops = shops;
        this.approvalLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to load pending shops.';
        this.approvalLoading = false;
      }
    });
  }

  updateApproval(shopId: string, status: 'approved' | 'rejected'): void {
    this.approvalError = '';

    this.authService.updateShopApprovalStatus(shopId, status).subscribe({
      next: () => {
        this.pendingShops = this.pendingShops.filter((shop) => shop._id !== shopId);
      },
      error: (err: { error?: { message?: string } }) => {
        this.approvalError = err.error?.message || 'Unable to update shop approval.';
      }
    });
  }
}
