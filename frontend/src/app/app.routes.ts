import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CartPageComponent } from './components/cart/cart-page.component';
import { MyOrdersComponent } from './components/orders/my-orders.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'orders', component: MyOrdersComponent },
];
