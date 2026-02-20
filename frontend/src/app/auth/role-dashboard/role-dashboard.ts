import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, AdminShop, AdminUser, DashboardAnalytics, MonthlyRevenueData } from '../../services/auth';
import { Product, ShopProduct } from '../../services/product';
import { OrderService, OrderResponse } from '../../services/order';

type AdminSection = 'overview' | 'shops' | 'users' | 'products' | 'orders';

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
  orders: OrderResponse[] = [];
  analytics: DashboardAnalytics | null = null;
  monthlyRevenue: MonthlyRevenueData[] = [];
  approvalLoading = false;
  approvalError = '';
  productLoading = false;
  productError = '';
  orderLoading = false;
  orderError = '';
  analyticsLoading = false;
  analyticsError = '';
  selectedOrder: OrderResponse | null = null;
  disputeAction = '';
  refundAction = '';
  sidebarOpen = false;
  currentSection: AdminSection = 'overview';

  constructor(public authService: AuthService, private productService: Product, private orderService: OrderService) {}

  ngOnInit(): void {
    if (this.authService.role() === 'admin') {
      this.loadAnalytics();
      this.loadShops();
      this.loadUsers();
      this.loadProducts();
      this.loadOrders();
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

  loadAnalytics(): void {
    this.analyticsLoading = true;
    this.analyticsError = '';

    this.authService.getDashboardAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loadMonthlyRevenue();
      },
      error: (err: { error?: { message?: string } }) => {
        this.analyticsError = err.error?.message || 'Unable to load analytics.';
        this.analyticsLoading = false;
      }
    });
  }

  loadMonthlyRevenue(): void {
    this.authService.getMonthlyRevenueChart().subscribe({
      next: (data) => {
        this.monthlyRevenue = data;
        this.analyticsLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.analyticsError = err.error?.message || 'Unable to load revenue chart.';
        this.analyticsLoading = false;
      }
    });
  }

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

  loadOrders(): void {
    this.orderLoading = true;
    this.orderError = '';

    this.orderService.getAllOrdersDetailed().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.orderLoading = false;
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to load orders.';
        this.orderLoading = false;
      }
    });
  }

  selectOrder(order: OrderResponse): void {
    this.selectedOrder = order;
    this.disputeAction = '';
    this.refundAction = '';
  }

  raiseDispute(order: OrderResponse): void {
    const reason = prompt('Enter dispute reason:');
    if (!reason) return;
    const description = prompt('Enter dispute description:');
    if (!description) return;

    this.orderError = '';
    this.orderService.handleDispute(order._id, 'raise', { reason, description }).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrder = null;
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to raise dispute.';
      }
    });
  }

  resolveDispute(order: OrderResponse): void {
    const resolution = prompt('Enter dispute resolution:');
    if (!resolution) return;

    this.orderError = '';
    this.orderService.handleDispute(order._id, 'resolve', { resolution }).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrder = null;
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to resolve dispute.';
      }
    });
  }

  closeDispute(order: OrderResponse): void {
    this.orderError = '';
    this.orderService.handleDispute(order._id, 'close', {}).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrder = null;
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to close dispute.';
      }
    });
  }

  requestRefund(order: OrderResponse): void {
    const amount = prompt(`Enter refund amount (max ₹${order.totalPrice}):`);
    if (!amount) return;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Invalid amount');
      return;
    }

    const reason = prompt('Enter refund reason:') || 'No reason provided';

    this.orderError = '';
    this.orderService.processRefund(order._id, 'request', { amount: numAmount, reason }).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to request refund.';
      }
    });
  }

  approveRefund(order: OrderResponse): void {
    this.orderError = '';
    this.orderService.processRefund(order._id, 'approve', {}).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to approve refund.';
      }
    });
  }

  processRefundPayment(order: OrderResponse): void {
    const transactionId = prompt('Enter transaction ID for refund:');
    if (!transactionId) return;

    this.orderError = '';
    this.orderService.processRefund(order._id, 'process', { transactionId }).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrder = null;
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to process refund.';
      }
    });
  }

  rejectRefund(order: OrderResponse): void {
    this.orderError = '';
    this.orderService.processRefund(order._id, 'reject', {}).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: { error?: { message?: string } }) => {
        this.orderError = err.error?.message || 'Unable to reject refund.';
      }
    });
  }

  getMaxRevenue(): number {
    return this.monthlyRevenue.length > 0 ? Math.max(...this.monthlyRevenue.map(d => d.revenue), 1) : 1;
  }

  getBarHeight(revenue: number): number {
    const max = this.getMaxRevenue();
    return (revenue / max) * 200;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  selectSection(section: AdminSection): void {
    this.currentSection = section;
    this.sidebarOpen = false;
  }

  isSectionActive(section: AdminSection): boolean {
    return this.currentSection === section;
  }
}
