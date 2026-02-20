import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductDetails } from './products/product-details/product-details';
import { Cart } from './cart/cart';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
	{ path: '', component: ProductList, title: 'ShopSmart | Products' },
	{ path: 'products/:id', component: ProductDetails, title: 'ShopSmart | Product Details' },
	{ path: 'cart', component: Cart, canActivate: [authGuard], title: 'ShopSmart | Cart' },
	{ path: 'login', component: Login, canActivate: [guestGuard], title: 'ShopSmart | Login' },
	{ path: 'register', component: Register, canActivate: [guestGuard], title: 'ShopSmart | Register' },
	{ path: '**', redirectTo: '' }
];
