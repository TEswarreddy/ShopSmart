# ShopSmart Frontend - Complete Documentation

Comprehensive guide for the Angular 17+ frontend application of ShopSmart e-commerce platform.

**Project Name**: ShopSmart  
**Framework**: Angular 17+  
**Language**: TypeScript  
**Styling**: CSS3 + Bootstrap utilities  
**State Management**: Angular Signals  
**Build Tool**: Angular CLI  

---

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
2. [Installation & Setup](#installation--setup)
3. [Project Architecture](#project-architecture)
4. [Component Documentation](#component-documentation)
5. [Service Layer](#service-layer)
6. [State Management with Signals](#state-management-with-signals)
7. [Routing System](#routing-system)
8. [Styling Guide](#styling-guide)
9. [Authentication & Security](#authentication--security)
10. [Development Workflow](#development-workflow)
11. [Testing Guide](#testing-guide)
12. [Build & Deployment](#build--deployment)
13. [Performance Optimization](#performance-optimization)
14. [Common Issues & Solutions](#common-issues--solutions)

---

## Quick Start Guide

### Prerequisites
- Node.js 18.0.0+
- npm 9.0.0+
- Git

### Installation
```bash
# Clone repository
git clone <repo-url>
cd ShopSmart/frontend

# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

### Common Commands
```bash
npm start               # Start dev server
npm run build          # Production build
npm test               # Run unit tests
npm run e2e            # End-to-end tests
ng generate            # Scaffold new components
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

This installs all required packages from `package.json`:
- @angular/* (framework and utilities)
- rxjs (reactive programming)
- bootstrap (optional UI utilities)
- Development tools (TypeScript, testing libraries, etc.)

### 2. Configure API Endpoint

Edit `src/app/services/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'  // Backend API URL
};
```

### 3. Setup Environment Variables (Optional)
```bash
# Create .env file if needed
cp .env.example .env
```

### 4. Start Development Server
```bash
npm start
# Opens http://localhost:4200 automatically
```

### 5. Build for Production
```bash
npm run build
# Creates optimized build in dist/frontend/
```

---

## Project Architecture

### Directory Structure
```
src/
├── app/                              # Main application
│   ├── app.ts                       # Root component
│   ├── app.html                     # Root template with routing outlet
│   ├── app.routes.ts                # Route definitions
│   ├── app.config.ts                # App providers and configuration
│   ├── app.css                      # Global styles
│   │
│   ├── auth/                        # Authentication module
│   │   ├── login/                  # Login component
│   │   ├── register/               # Registration component
│   │   └── role-dashboard/         # Role-based dashboard routing
│   │
│   ├── products/                    # Product browsing
│   │   ├── products.ts             # Main products page
│   │   ├── product-list/           # Product listing with filters
│   │   └── product-details/        # Individual product details
│   │
│   ├── cart/                        # Shopping cart
│   │   └── cart.ts                 # Cart management
│   │
│   ├── checkout/                    # Checkout flow
│   │   └── checkout.ts             # Checkout process
│   │
│   ├── orders/                      # Order management
│   │   └── order-history/          # View and manage orders
│   │
│   ├── pages/                       # Marketing & feature pages
│   │   ├── about-us/               # Company information
│   │   ├── careers/                # Job listings
│   │   ├── sell-on-shopsmart/      # Seller program
│   │   ├── advertise-products/     # Advertising solutions
│   │   ├── affiliate-program/      # Affiliate opportunities
│   │   ├── help-faq/               # Support & FAQ
│   │   ├── contact-support/        # Contact form
│   │   ├── todays-deals/           # Flash sales
│   │   └── customer-support/       # Live chat
│   │
│   ├── guards/                      # Route protection
│   │   ├── auth.guard.ts           # Authentication guard
│   │   ├── guest.guard.ts          # Guest-only guard
│   │   └── role.guard.ts           # Role-based guard
│   │
│   ├── interceptors/                # HTTP interceptors
│   │   └── auth.interceptor.ts     # JWT token injection
│   │
│   ├── services/                    # Business logic services
│   │   ├── auth.ts                 # Authentication service
│   │   ├── product.ts              # Product service
│   │   ├── cart.ts                 # Cart service
│   │   ├── order.ts                # Order service
│   │   └── environment.ts          # Configuration
│   │
│   └── profile/                     # User profile
│       └── profile.ts              # Profile management
│
├── main.ts                          # Application bootstrap
├── index.html                       # Main HTML document
└── styles.css                       # Global styles

angular.json                         # Angular configuration
tsconfig.json                        # TypeScript configuration
tsconfig.app.json                    # App-specific TS config
tsconfig.spec.json                   # Test-specific TS config
package.json                         # Dependencies & scripts
```

### Component Architecture

All components follow Angular 17+ standalone component pattern:

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, FormsModule, ...],  // Explicit imports
  templateUrl: './component.html',
  styleUrl: './component.css'
})
export class ComponentName {
  // Properties with signals
  // Methods
  // Computed properties
}
```

---

## Component Documentation

### Core Layout Components

#### App Component (root)
Entry point of the application. Includes:
- Header with navigation
- Router outlet for page content
- Footer with links and info

### Feature Components

#### Authentication Components

**Login (`auth/login/`)**
- Email/password validation
- Role-specific login (user/seller/admin)
- Error handling and user feedback
- "Remember me" functionality
- Password recovery link

**Usage:**
```html
<app-login></app-login>
```

**Register (`auth/register/`)**
- User registration form
- Email verification
- Password strength validation
- Role selection
- Terms acceptance

**Methods:**
```typescript
register(formData): void          // Submit registration
validateEmail(email): boolean     // Email validation
checkPasswordStrength(): void     // Password strength check
```

#### Product Components

**Product List (`products/product-list/`)**
- Grid-based product display
- Filtering (category, price, ratings)
- Search functionality
- Sorting options
- Pagination

**Key Signals:**
```typescript
products = signal<Product[]>([]);
filters = signal({ category: '', minPrice: 0, ... });
sortBy = signal('relevance');
currentPage = signal(1);
```

**Product Details (`products/product-details/`)**
- Full product information
- Image gallery with zoom
- Customer reviews
- Stock status
- Add to cart functionality

**Methods:**
```typescript
addToCart(quantity): void         // Add product to cart
shareProduct(): void              // Share product link
saveForLater(): void              // Save to wishlist
reportProduct(): void             // Report inappropriate content
```

#### Shopping Components

**Cart (`cart/`)**
- View cart items
- Update quantities
- Remove items
- Apply discount codes
- Checkout

**Computed Properties:**
```typescript
totalPrice = computed(() => {
  return this.items().reduce((sum, item) => 
    sum + (item.price * item.quantity), 0);
});
```

**Checkout (`checkout/`)**
- Order review
- Shipping address entry/selection
- Payment method selection
- Order confirmation
- Invoice generation

#### Order Management

**Order History (`orders/order-history/`)**
- List all user orders
- Track order status
- View order details
- Request returns
- Download invoices
- Admin: Manage all orders

---

## Service Layer

Services handle all business logic and API communication.

### AuthService

**Purpose**: User authentication and session management

```typescript
// Signals
user = signal<User | null>(null);
isLoggedIn = computed(() => !!this.user());
role = computed(() => this.user()?.role);

// Methods
login(email: string, password: string): Observable<LoginResponse>
register(userData: RegisterData): Observable<User>
logout(): void
isAuthenticated(): boolean
hasRole(role: string): boolean
refreshToken(): Observable<TokenResponse>
```

**Features:**
- JWT token management
- Automatic token refresh
- Session persistence
- Role-based access

### ProductService

**Purpose**: Product data management

```typescript
// Methods
getProducts(filters?: FilterOptions): Observable<PaginatedProducts>
getProductById(id: string): Observable<Product>
searchProducts(query: string): Observable<Product[]>
getProductsByCategory(category: string): Observable<Product[]>
getProductsByShop(shopId: string): Observable<Product[]>
rateProduct(productId: string, rating: number): Observable<void>
addReview(productId: string, review: ReviewData): Observable<Review>
```

**Caching:**
- Products cached for 5 minutes
- Cache invalidation per query
- Search results cached

### CartService

**Purpose**: Shopping cart management

```typescript
// Signals
items = signal<CartItem[]>([]);
totalItems = computed(() => this.items().length);
totalPrice = computed(() => { ... });

// Methods
addToCart(product: Product, quantity: number): void
removeFromCart(productId: string): void
updateQuantity(productId: string, quantity: number): void
clearCart(): void
getCartTotal(): number
applyDiscount(code: string): void
```

**Features:**
- Real-time updates
- LocalStorage persistence
- Discount calculations
- Stock validation

### OrderService

**Purpose**: Order lifecycle management

```typescript
// Methods
createOrder(orderData: OrderData): Observable<Order>
getMyOrders(): Observable<Order[]>
getOrderById(id: string): Observable<OrderDetails>
updateOrderStatus(id: string, status: string): Observable<Order>
cancelOrder(id: string): Observable<void>
submitReturn(id: string, details: ReturnRequest): Observable<Return>
downloadInvoice(id: string): Observable<Blob>
```

---

## State Management with Signals

Angular Signals provide reactive state management without RxJS complexity.

### Basic Signal Usage

```typescript
// Define signal
count = signal(0);

// Read signal
console.log(count());  // Access with ()

// Update signal
count.set(5);          // Replace entire value
count.update(c => c + 1);  // Modify current value

// Computed signal
doubled = computed(() => this.count() * 2);

// Watch changes (in effect/constructor)
effect(() => {
  console.log('Count changed:', this.count());
});
```

### Component State Pattern

```typescript
export class MyComponent {
  // Data state
  items = signal<Item[]>([]);
  loading = signal(false);
  error = signal('');

  // Derived state
  isEmpty = computed(() => this.items().length === 0);
  hasError = computed(() => this.error() !== '');

  constructor(private service: ItemService) {
    // Initial data load
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.service.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  // Template binding
  // {{ items() }} - read value
  // {{ isEmpty() }} - read computed
  // (click)="loadItems()" - call method
}
```

### Shared Service State

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private state = signal<AppState>({
    users: [],
    selectedUser: null
  });

  users = computed(() => this.state().users);
  selectedUser = computed(() => this.state().selectedUser);

  selectUser(id: string): void {
    this.state.update(s => ({
      ...s,
      selectedUser: s.users.find(u => u.id === id) || null
    }));
  }
}
```

---

## Routing System

### Route Configuration

Routes are defined in `app.routes.ts`:

```typescript
export const routes: Routes = [
  // Public routes
  { path: '', component: ProductList, title: 'Shop' },
  { path: 'products/:id', component: ProductDetails },

  // Protected routes
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard]
  },

  // Role-based routes
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  // Wildcard
  { path: '**', redirectTo: '' }
];
```

### Route Guards

**AuthGuard**: Requires authentication
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login/user']);
  return false;
};
```

**RoleGuard**: Checks user role
```typescript
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const requiredRoles = route.data['roles'] as string[];

  return requiredRoles.includes(authService.role() ?? '');
};
```

**GuestGuard**: Prevents authenticated users
```typescript
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
```

### Navigation

**HTML Template:**
```html
<!-- Simple navigation -->
<a routerLink="/products">Products</a>

<!-- Dynamic routing -->
<a [routerLink]="['/products', product.id]">
  {{ product.name }}
</a>

<!-- With query parameters -->
<a [routerLink]="['/products']" 
   [queryParams]="{ sort: 'price', order: 'asc' }">
  Sort by Price
</a>

<!-- Active link styling -->
<a routerLink="/cart" routerLinkActive="active">Cart</a>
```

**TypeScript Navigation:**
```typescript
constructor(private router: Router) {}

// Simple navigation
navigateToProduct(id: string): void {
  this.router.navigate(['/products', id]);
}

// With query parameters
filterProducts(): void {
  this.router.navigate(['/products'], {
    queryParams: { category: 'electronics' }
  });
}

// Programmatic with state
goToCheckout(): void {
  this.router.navigate(['/checkout'], {
    state: { orderId: '123' }
  });
}
```

---

## Styling Guide

### Color Scheme

```css
/* Primary Brand Colors */
--primary: #667eea        /* Purple */
--secondary: #764ba2      /* Dark Purple */
--accent: #ff6b6b         /* Red */

/* Status Colors */
--success: #27ae60        /* Green */
--warning: #f39c12        /* Orange */
--error: #e74c3c          /* Dark Red */
--info: #3498db           /* Blue */

/* Neutral Colors */
--bg-light: #f8f9fa       /* Light Gray */
--bg-dark: #1f2937        /* Dark Gray */
--text-primary: #1f2937   /* Dark Text */
--text-secondary: #6b7280 /* Gray Text */
```

### Responsive Breakpoints

```css
/* Mobile First Approach */

/* Base: Small Mobile (< 480px) */
max-width: 100%;
padding: 1rem;

/* Medium Mobile (480px - 768px) */
@media (min-width: 480px) {
  padding: 1.5rem;
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) {
  padding: 2rem;
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
  max-width: 1200px;
  grid-template-columns: repeat(3, 1fr);
}
```

### Component Styling Pattern

```css
/* component.css */

:host {
  display: block;
  --component-spacing: 1rem;
}

.component-container {
  background: white;
  border-radius: 12px;
  padding: var(--component-spacing);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.component-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Responsive variants */
@media (max-width: 768px) {
  :host {
    --component-spacing: 0.75rem;
  }
}
```

---

## Authentication & Security

### JWT Token Management

1. **Login**: User credentials → Server → JWT Token
2. **Storage**: Token saved to localStorage
3. **Transmission**: Token in Authorization header
4. **Refresh**: Automatic refresh on expiry
5. **Logout**: Token cleared from storage

### HTTP Interceptor

Automatically injects JWT token:

```typescript
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
```

### Security Best Practices

1. Never store sensitive data in localStorage (use IndexedDB if needed)
2. Always validate input on both client and server
3. Use HTTPS in production
4. Implement CSRF protection
5. Sanitize user-generated content
6. Use strong password requirements
7. Implement 2FA for admin accounts
8. Regular security audits

---

## Development Workflow

### Creating New Components

```bash
# Generate standalone component
ng generate component path/component-name --standalone

# This creates:
# - component.ts (TypeScript)
# - component.html (Template)
# - component.css (Styles)
# - component.spec.ts (Tests)
```

### Creating Services

```bash
# Generate service
ng generate service services/service-name

# Provides in root by default
```

### Best Practices

1. **Use Signals** for component state
2. **Avoid ngOnInit** when possible
3. **Type Everything** - no `any` types
4. **Use Standalone Components**
5. **Lazy Load** large features
6. **Handle Errors** in subscriptions
7. **Use OnPush** change detection
8. **Keep Components Focused** (single responsibility)
9. **Extract Logic to Services**
10. **Test Thoroughly** before merging

---

## Testing Guide

### Unit Testing

```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add item to list', () => {
    component.addItem('Test');
    expect(component.items().length).toBe(1);
  });
});
```

### Running Tests

```bash
npm test                              # Watch mode
npm test -- --no-watch               # Single run
npm test -- --code-coverage          # With coverage report
```

---

## Build & Deployment

### Development Build
```bash
npm start
# Unoptimized, faster compile
# Source maps enabled for debugging
```

### Production Build
```bash
npm run build
# Output: dist/frontend/
# Optimized, minified, tree-shaken
```

### Deployment Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel deploy --prod
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/frontend
```

**Docker**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Performance Optimization

1. **Lazy Loading**: Code split by feature
2. **OnPush Change Detection**: Improve CD performance
3. **TrackBy in *ngFor**: Efficient list rendering
4. **Image Optimization**: Use modern formats
5. **Bundle Analysis**: Monitor bundle size
6. **Compression**: Enable gzip/brotli
7. **Caching**: Browser and HTTP caching
8. **CDN**: Serve static assets from CDN

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 4200 in use | `npx kill-port 4200` |
| Module not found | `rm -rf node_modules && npm install` |
| Cache issues | `ng cache clean && npm run build` |
| Styles not applying | Clear browser cache, verify CSS link |
| Router not working | Check route in app.routes.ts |
| Auth failing | Check localStorage, verify token |

---

**Last Updated**: February 21, 2026  
**Maintained By**: ShopSmart Development Team

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
