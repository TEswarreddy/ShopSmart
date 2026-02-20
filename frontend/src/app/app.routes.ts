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
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CareersComponent } from './pages/careers/careers.component';
import { SellOnShopsmartComponent } from './pages/sell-on-shopsmart/sell-on-shopsmart.component';
import { AdvertiseProductsComponent } from './pages/advertise-products/advertise-products.component';
import { AffiliateProgramComponent } from './pages/affiliate-program/affiliate-program.component';
import { HelpFaqComponent } from './pages/help-faq/help-faq.component';
import { ContactSupportComponent } from './pages/contact-support/contact-support.component';
import { TodaysDealComponent } from './pages/todays-deals/todays-deals.component';
import { CustomerSupportComponent } from './pages/customer-support/customer-support.component';

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
	// Footer Pages
	{ path: 'about-us', component: AboutUsComponent, title: 'ShopSmart | About Us' },
	{ path: 'careers', component: CareersComponent, title: 'ShopSmart | Careers' },
	{ path: 'sell', component: SellOnShopsmartComponent, title: 'ShopSmart | Sell on ShopSmart' },
	{ path: 'advertise', component: AdvertiseProductsComponent, title: 'ShopSmart | Advertise Products' },
	{ path: 'affiliate', component: AffiliateProgramComponent, title: 'ShopSmart | Affiliate Program' },
	{ path: 'help', component: HelpFaqComponent, title: 'ShopSmart | Help Center' },
	{ path: 'contact', component: ContactSupportComponent, title: 'ShopSmart | Contact Support' },
	// Special Features
	{ path: 'deals', component: TodaysDealComponent, title: 'ShopSmart | Today\'s Deals' },
	{ path: 'support', component: CustomerSupportComponent, title: 'ShopSmart | Customer Support' },
	{ path: '**', redirectTo: '' }
];
