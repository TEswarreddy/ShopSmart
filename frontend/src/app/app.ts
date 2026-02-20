import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart';
import { AuthService, UserRole } from './services/auth';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isMenuOpen = false;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    void this.router.navigateByUrl('/');
  }

  dashboardRoute(): string {
    return this.authService.getDefaultRouteByRole();
  }

  orderHistoryRoute(): string {
    return this.authService.role() === 'admin' ? '/admin/orders' : '/orders';
  }

  roleLabel(role: UserRole | null | undefined): string {
    if (role === 'admin') {
      return 'Admin';
    }
    if (role === 'shop') {
      return 'Shop';
    }
    return 'User';
  }

  canAccessUserCommerce(): boolean {
    const role = this.authService.role();
    return !role || role === 'user';
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
