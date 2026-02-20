import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductDetails } from './products/product-details/product-details';
import { Cart } from './cart/cart';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { Checkout } from './checkout/checkout';
import { roleGuard } from './guards/role.guard';
import { RoleDashboard } from './auth/role-dashboard/role-dashboard';
import { ShopDashboard } from './auth/shop-dashboard/shop-dashboard';
import { OrderHistory } from './orders/order-history/order-history';
import { Profile } from './profile/profile';

export const routes: Routes = [
	{ path: '', component: ProductList, title: 'ShopSmart | Products' },
	{ path: 'products/:id', component: ProductDetails, title: 'ShopSmart | Product Details' },
	{ path: 'cart', component: Cart, canActivate: [authGuard, roleGuard], data: { roles: ['user'] }, title: 'ShopSmart | Cart' },
	{ path: 'checkout', component: Checkout, canActivate: [authGuard, roleGuard], data: { roles: ['user'] }, title: 'ShopSmart | Checkout' },
	{ path: 'profile', component: Profile, canActivate: [authGuard], title: 'ShopSmart | My Profile' },
	{ path: 'login', component: Login, canActivate: [guestGuard], title: 'ShopSmart | Login' },
	{ path: 'login/:role', component: Login, canActivate: [guestGuard], title: 'ShopSmart | Login' },
	{ path: 'register', component: Register, canActivate: [guestGuard], title: 'ShopSmart | Register' },
	{ path: 'register/:role', component: Register, canActivate: [guestGuard], title: 'ShopSmart | Register' },
	{ path: 'shop/dashboard', component: ShopDashboard, canActivate: [authGuard, roleGuard], data: { roles: ['shop'] }, title: 'ShopSmart | Shop Dashboard' },
	{ path: 'admin/dashboard', component: RoleDashboard, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }, title: 'ShopSmart | Admin Dashboard' },
	{ path: 'orders', component: OrderHistory, canActivate: [authGuard, roleGuard], data: { roles: ['user', 'shop'] }, title: 'ShopSmart | Order History' },
	{ path: 'admin/orders', component: OrderHistory, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }, title: 'ShopSmart | Admin Order History' },
	{ path: '**', redirectTo: '' }
];
