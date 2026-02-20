import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-dashboard.html',
  styleUrl: './role-dashboard.css'
})
export class RoleDashboard {
  constructor(public authService: AuthService) {}

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
}
