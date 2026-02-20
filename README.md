# ShopSmart - E-Commerce Marketplace Platform

A full-stack, feature-rich e-commerce marketplace application built with modern web technologies. ShopSmart connects customers with quality sellers, offering competitive prices, reliable service, and exceptional product selection.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Frontend Documentation](#frontend-documentation)
7. [Backend Documentation](#backend-documentation)
8. [Database Schema](#database-schema)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [Troubleshooting](#troubleshooting)

---

## Overview

ShopSmart is a next-generation e-commerce platform designed to revolutionize online shopping. The platform empowers:

- **Customers**: Easy discovery, secure purchasing, and excellent support
- **Sellers**: Tools to manage shops, products, and orders
- **Administrators**: Comprehensive dashboard for platform management

### Core Mission
To create a thriving digital marketplace that empowers businesses and delights customers through convenience, selection, and trust.

### Core Values
- 🎯 **Customer First**: Prioritize satisfaction in every decision
- 🔒 **Trust & Security**: Data and transactions always protected
- 💰 **Fair Pricing**: Transparent pricing without hidden charges
- ✨ **Quality Products**: Curated sellers offering authentic items
- 🚀 **Continuous Innovation**: Always improving to serve better

---

## Key Features

### 🛍️ Customer Features
- **Product Discovery**
  - Browse 50K+ products from verified sellers
  - Advanced search and filtering
  - Real-time product recommendations
  - Today's Deals with flash sale countdown timers

- **Shopping Experience**
  - Secure shopping cart with persistent storage
  - Multiple payment options via Razorpay
  - Real-time order tracking
  - Easy returns (30-day window) with refund processing

- **User Accounts**
  - Secure login/registration with email verification
  - Order history and tracking
  - Wishlist management
  - Profile management with address book
  - Payment method management

- **Customer Support**
  - 24/7 live chat support with real-time messaging
  - Email support (response: 2-4 hours)
  - Phone support (Mon-Fri 9 AM - 6 PM IST)
  - Comprehensive help center with FAQs
  - Contact form for inquiries

### 🏪 Seller Features
- **Shop Management**
  - Create and customize shop profile
  - Shop analytics and performance metrics
  - Seller dashboard with key statistics
  - Commission tracking and earnings

- **Product Management**
  - Upload and manage products
  - Inventory tracking
  - Pricing and discount management
  - Product categorization
  - Real-time sales analytics

- **Order Management**
  - View incoming orders
  - Track fulfillment status
  - Order history and analytics
  - Return/refund management

- **Commission Structure**
  - **Affiliate Program**: 5-15% commission on referrals
  - **Advertising Services**: Pay-per-placement options
  - **Premium Seller Options**: Enhanced visibility

### 👨‍💼 Admin Features
- **User Management**
  - User dashboard with statistics
  - View all users with filters
  - User activity tracking
  - Account status management

- **Shop Management**
  - Verify sellers
  - Monitor shop performance
  - Handle disputes
  - Commission management

- **Product Management**
  - Approve/reject products
  - Quality control
  - Product categorization
  - Inventory monitoring

- **Order Management**
  - View all orders across platform
  - Update order/payment status
  - Handle disputes and refunds
  - Analytics and reporting

- **Analytics & Reporting**
  - Revenue tracking
  - User growth metrics
  - Sales by category
  - Commission earned

- **Refunds & Disputes**
  - Manage refund requests
  - Handle seller disputes
  - Resolution tracking
  - Dispute history

---

## Technology Stack

### Frontend
```
Framework:       Angular 17+
Language:        TypeScript
Styling:         CSS3 (Custom + Bootstrap utilities)
State Management: Angular Signals (Reactive)
HTTP Client:     Angular HttpClient with Interceptors
Routing:         Angular Router
Build Tool:      Angular CLI
```

**Key Libraries:**
- `@angular/common`: Core utilities
- `@angular/router`: Routing
- `@angular/forms`: Form handling (Template & Reactive)
- `rxjs`: Reactive programming

**Features:**
- Standalone components
- Signal-based reactivity
- Route guards (auth, guest, role-based)
- HTTP interceptors for authentication
- Responsive design (mobile-first)

### Backend
```
Runtime:         Node.js
Framework:       Express.js
Language:        JavaScript (ES6+)
API Style:       RESTful
Authentication:  JWT (JSON Web Tokens)
```

**Key Libraries:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `dotenv`: Environment configuration
- `cors`: Cross-Origin Resource Sharing
- `razorpay`: Payment gateway integration

### Database
```
Primary:         MongoDB
Connection:      Mongoose ODM
Data Type:       Document-based (JSON-like)
```

### Payment Gateway
```
Provider:        Razorpay
Integration:     Order placement & payment processing
Features:        Multiple payment methods, refunds
```

---

## Project Structure

```
ShopSmart/
├── frontend/                          # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts                # Main app component
│   │   │   ├── app.html              # App shell template
│   │   │   ├── app.routes.ts         # Route definitions
│   │   │   ├── app.config.ts         # App configuration
│   │   │   │
│   │   │   ├── auth/                 # Authentication Module
│   │   │   │   ├── login/            # Login component
│   │   │   │   ├── register/         # Registration component
│   │   │   │   └── role-dashboard/   # Role-specific dashboard routing
│   │   │   │
│   │   │   ├── products/             # Product Management
│   │   │   │   ├── products.ts       # Main products view
│   │   │   │   ├── product-list/     # Product listing
│   │   │   │   └── product-details/  # Product detail page
│   │   │   │
│   │   │   ├── cart/                 # Shopping Cart
│   │   │   │   └── cart.ts           # Cart management
│   │   │   │
│   │   │   ├── checkout/             # Checkout Flow
│   │   │   │   └── checkout.ts       # Checkout process
│   │   │   │
│   │   │   ├── orders/               # Order Management
│   │   │   │   └── order-history/    # Order history & returns
│   │   │   │
│   │   │   ├── pages/                # Marketing Pages
│   │   │   │   ├── about-us/         # Company information
│   │   │   │   ├── careers/          # Career listings
│   │   │   │   ├── sell-on-shopsmart/# Seller program
│   │   │   │   ├── advertise-products/ # Advertising solutions
│   │   │   │   ├── affiliate-program/  # Affiliate program
│   │   │   │   ├── help-faq/         # Help center & FAQs
│   │   │   │   ├── contact-support/  # Contact page
│   │   │   │   ├── todays-deals/     # Flash deals
│   │   │   │   └── customer-support/ # Live chat support
│   │   │   │
│   │   │   ├── guards/               # Route Guards
│   │   │   │   ├── auth.guard.ts     # Authentication guard
│   │   │   │   ├── guest.guard.ts    # Guest access guard
│   │   │   │   └── role.guard.ts     # Role-based access guard
│   │   │   │
│   │   │   ├── interceptors/         # HTTP Interceptors
│   │   │   │   └── auth.interceptor.ts # JWT token injection
│   │   │   │
│   │   │   ├── services/             # Services
│   │   │   │   ├── auth.ts           # Authentication service
│   │   │   │   ├── product.ts        # Product service
│   │   │   │   ├── cart.ts           # Cart service
│   │   │   │   ├── order.ts          # Order service
│   │   │   │   └── environment.ts    # App configuration
│   │   │   │
│   │   │   └── profile/              # User Profile
│   │   │       └── profile.ts        # Profile management
│   │   │
│   │   ├── index.html                # Main HTML file
│   │   ├── main.ts                   # App initialization
│   │   └── styles.css                # Global styles
│   │
│   ├── angular.json                  # Angular configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # Frontend dependencies
│   └── README.md                     # Frontend specific docs
│
├── backend/                           # Express.js Backend
│   ├── server.js                     # Entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── config/                       # Configuration
│   │   ├── db.js                     # MongoDB connection
│   │   └── razorpay.js               # Razorpay setup
│   │
│   ├── models/                       # Data Models
│   │   ├── User.js                   # User schema
│   │   ├── Product.js                # Product schema
│   │   ├── Cart.js                   # Shopping cart schema
│   │   └── Order.js                  # Order schema
│   │
│   ├── controllers/                  # Business Logic
│   │   ├── userController.js         # User operations
│   │   ├── productController.js      # Product operations
│   │   ├── cartController.js         # Cart operations
│   │   ├── orderController.js        # Order operations
│   │   └── paymentController.js      # Payment operations
│   │
│   ├── routes/                       # API Routes
│   │   ├── userRoutes.js             # User endpoints
│   │   ├── productRoutes.js          # Product endpoints
│   │   ├── cartRoutes.js             # Cart endpoints
│   │   ├── orderRoutes.js            # Order endpoints
│   │   └── paymentRoutes.js          # Payment endpoints
│   │
│   ├── middleware/                   # Custom Middleware
│   │   └── authMiddleware.js         # JWT verification
│   │
│   └── README.md                     # Backend specific docs
│
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local or cloud instance (MongoDB Atlas)
- **Git**: For version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ShopSmart
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with configuration
# See Backend Configuration section below

# Start development server
npm start
# Server runs on http://localhost:5000
```

**Backend Environment Variables (.env):**
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsmart

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRY=7d

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS
CORS_ORIGIN=http://localhost:4200

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint in environment files
# src/app/services/environment.ts

# Start development server
npm start
# Application runs on http://localhost:4200

# For production build
npm run build
# Output in dist/frontend/
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Access the application at `http://localhost:4200`

---

## Frontend Documentation

### Architecture Overview

#### Component Structure
- **Standalone Components**: All components are Angular v17+ standalone
- **Signals**: Used for reactive state management
- **Services**: Centralized business logic
- **Guards**: Route protection based on authentication and roles
- **Interceptors**: Automatic JWT token injection

#### Key Components

##### Authentication Module
- **Login Component** (`auth/login/`)
  - Support for user, seller, and admin login
  - Email/password validation
  - Error handling and feedback
  - "Remember me" functionality

- **Register Component** (`auth/register/`)
  - User self-registration
  - Email verification
  - Password strength validation
  - Role selection (user/seller)

##### Shopping Components
- **Product List** (`products/product-list/`)
  - Grid-based product display
  - Pagination and filtering
  - Search functionality
  - Real-time sorting

- **Product Details** (`products/product-details/`)
  - Full product information
  - Customer reviews and ratings
  - Add to cart functionality
  - Seller information

- **Shopping Cart** (`cart/`)
  - Item management (add, remove, update qty)
  - Price calculation with discounts
  - Persistent storage
  - Checkout integration

- **Checkout** (`checkout/`)
  - Order review
  - Shipping address entry
  - Payment method selection
  - Order confirmation

##### Order Management
- **Order History** (`orders/order-history/`)
  - View all orders
  - Order status tracking
  - Return/refund management
  - Admin: Manage all orders and statuses

##### Dashboard Pages
- **Role Dashboard** (`auth/role-dashboard/`)
  - Route to appropriate dashboard based on role:
    - User: Order history & profile
    - Seller: Shop dashboard & analytics
    - Admin: Admin control panel

##### Marketing Pages
- **About Us**: Company story, values, statistics
- **Careers**: Job listings and recruitment
- **Sell on ShopSmart**: Seller program information
- **Advertise Products**: Advertising solutions and pricing
- **Affiliate Program**: Commission structure and earnings
- **Help & FAQ**: Support resources with expandable Q&A
- **Contact Support**: Multiple contact channels
- **Today's Deals**: Flash sales with countdown timers
- **Customer Support**: Real-time live chat widget

#### Services

##### AuthService
```typescript
login(credentials): Observable<LoginResponse>
register(userData): Observable<User>
logout(): void
isLoggedIn(): boolean
role(): 'user' | 'shop' | 'admin'
user(): User | null
```

##### ProductService
```typescript
getProducts(filters?): Observable<Product[]>
getProductById(id): Observable<Product>
searchProducts(query): Observable<Product[]>
getProductsByShop(shopId): Observable<Product[]>
```

##### CartService
```typescript
addToCart(product, quantity): void
removeFromCart(productId): void
updateQuantity(productId, quantity): void
getTotalPrice(): number
clearCart(): void
totalItems(): number
```

##### OrderService
```typescript
createOrder(orderData): Observable<Order>
getMyOrders(): Observable<Order[]>
getOrderById(id): Observable<Order>
getAllOrders(): Observable<Order[]> // Admin
updateOrderStatus(id, status): Observable<Order>
```

#### Route Guards

##### AuthGuard
- Prevents unauthenticated access
- Redirects to login if not authenticated

##### GuestGuard
- Prevents authenticated users from accessing login/register
- Redirects to home if already logged in

##### RoleGuard
- Checks user role against required roles
- Prevents unauthorized role access
- Data: `{ roles: ['user', 'admin'] }`

#### HTTP Interceptor

##### AuthInterceptor
- Automatically injects JWT token in Authorization header
- Handles token refresh on expiry
- Error handling and global error responses

### Styling Architecture

**CSS Organization:**
- Global styles: `src/styles.css`
- Component-scoped CSS: `component.css`
- Variables: CSS custom properties for theming
- **Color Scheme**: 
  - Primary: #667eea (Purple)
  - Secondary: #764ba2 (Dark Purple)
  - Accent: #ff6b6b (Red)
  - Warning: #f39c12 (Orange)
  - Success: #27ae60 (Green)

**Responsive Breakpoints:**
- **Desktop**: > 1024px (3-column layouts)
- **Tablet**: 768px - 1024px (2-column layouts)
- **Mobile**: 480px - 768px (stacked layouts)
- **Small Mobile**: < 480px (optimized single column)

### Building for Production

```bash
cd frontend
npm run build

# Optimized build output
# dist/frontend/ - Ready for deployment
```

**Build Optimization:**
- Tree-shaking: Removes unused code
- Minification: Compresses JS and CSS
- AoT Compilation: Ahead-of-Time compilation
- Lazy Loading: Code splitting for faster loading

---

## Backend Documentation

### Server Architecture

#### Entry Point
**server.js**
- Express.js server initialization
- Middleware configuration
- Route mounting
- Error handling setup
- Server listening on configured port (default: 5000)

#### Middleware Stack
1. CORS - Cross-origin request handling
2. JSON Parser - Request body parsing
3. Auth Middleware - JWT verification
4. Error Handler - Global error catching

### Database Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['user', 'shop', 'admin'],
  phone: String,
  avatar: String (URL),
  addresses: [{
    street, city, state, postalCode, country
  }],
  wishlist: [ObjectId],
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  images: [String (URLs)],
  rating: Number,
  reviews: Number,
  stock: Number,
  shop: ObjectId (Reference to User),
  discount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Cart Model
```javascript
{
  user: ObjectId (Reference to User),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  // Maintains one cart per user
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Model
```javascript
{
  user: ObjectId (Reference to User),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: Enum ['Pending', 'Completed', 'Failed', 'Refunded'],
  orderStatus: Enum ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Controllers

#### UserController
```javascript
register(req, res)           // User registration
login(req, res)              // User login with JWT
getProfile(req, res)         // Get current user profile
updateProfile(req, res)      // Update user info
addAddress(req, res)         // Add shipping address
getAddresses(req, res)       // Get all user addresses
deleteAddress(req, res)      // Remove address
getWishlist(req, res)        // Get wishlist items
addToWishlist(req, res)      // Add item to wishlist
```

#### ProductController
```javascript
getProducts(req, res)        // List all products with filtering
getProductById(req, res)     // Get single product
createProduct(req, res)      // Create new product (seller)
updateProduct(req, res)      // Update product (seller)
deleteProduct(req, res)      // Delete product (seller)
getProductsByShop(req, res)  // Get seller's products
searchProducts(req, res)     // Search functionality
```

#### CartController
```javascript
getCart(req, res)            // Get user's cart
addToCart(req, res)          // Add item to cart
removeFromCart(req, res)     // Remove item from cart
updateCartItem(req, res)     // Update item quantity
clearCart(req, res)          // Empty cart
```

#### OrderController
```javascript
createOrder(req, res)        // Create new order
getMyOrders(req, res)        // Get user's orders
getOrderById(req, res)       // Get order details
getAllOrders(req, res)       // Get all orders (admin)
updateOrderStatus(req, res)  // Update status (admin)
cancelOrder(req, res)        // Cancel order
submitReturn(req, res)       // Request return/refund
```

#### PaymentController
```javascript
createPaymentOrder(req, res) // Initialize Razorpay order
verifyPayment(req, res)      // Verify payment signature
getPaymentStatus(req, res)   // Check payment status
processRefund(req, res)      // Process refund (admin)
```

### Authentication Flow

#### Registration
1. User submits credentials (name, email, password)
2. Server validates input and checks email uniqueness
3. Password hashed with bcryptjs (10 rounds)
4. User created in database
5. JWT token generated and returned
6. Client stores token in localStorage

#### Login
1. User enters email and password
2. Server finds user by email
3. Password compared with stored hash
4. JWT token generated if match
5. Client stores token and sets auth header

#### JWT Structure
```
Header: { alg: 'HS256', typ: 'JWT' }
Payload: { userId, role, email, iat, exp }
Signature: HMAC-SHA256(header + payload + secret)
```

#### Protected Routes
- Middleware checks Authorization header
- Extracts and verifies JWT token
- Attaches user info to request object
- Allows or denies access

### API Error Handling

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional information"
  }
}
```

**Common Error Codes:**
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Unauthorized access
- `VALIDATION_001`: Invalid input
- `RESOURCE_001`: Not found
- `PAYMENT_001`: Payment failed

---

## Database Schema

### Collections Overview

#### Users Collection
```
Index: email (unique)
Index: role
Index: createdAt
```

#### Products Collection
```
Index: category
Index: shop (Reference)
Index: price
Index: rating
Index: createdAt
```

#### Carts Collection
```
Index: user (unique, one cart per user)
Index: updatedAt
```

#### Orders Collection
```
Index: user
Index: orderStatus
Index: paymentStatus
Index: createdAt
Index: transactionId
```

### Relationships
```
User --owns--> Shop (seller)
User --creates--> Order
User --adds--> Cart
Product --belongs-to--> Shop
Product --listed-in--> Cart
Product --purchased-in--> Order
Order --contains--> Products
```

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.shopsmart.com/api
```

### Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
```

### Auth Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}

Response: {
  "success": true,
  "user": { ... },
  "token": "eyJhbGc..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: {
  "success": true,
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### Product Endpoints

#### Get All Products
```
GET /products?category=electronics&minPrice=1000&maxPrice=50000&page=1&limit=20

Response: {
  "success": true,
  "products": [ ... ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

#### Get Product by ID
```
GET /products/:id

Response: {
  "success": true,
  "product": { ... }
}
```

#### Create Product (Seller)
```
POST /products
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Laptop",
  "description": "High-performance laptop",
  "price": 49999,
  "originalPrice": 65000,
  "category": "Electronics",
  "images": ["url1", "url2"],
  "stock": 50
}

Response: {
  "success": true,
  "product": { ... }
}
```

#### Update Product (Seller)
```
PUT /products/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

Response: {
  "success": true,
  "product": { ... }
}
```

#### Delete Product (Seller)
```
DELETE /products/:id
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "message": "Product deleted"
}
```

### Cart Endpoints

#### Get Cart
```
GET /cart
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "cart": {
    "items": [ ... ],
    "totalPrice": 15000
  }
}
```

#### Add to Cart
```
POST /cart/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}

Response: {
  "success": true,
  "cart": { ... }
}
```

#### Remove from Cart
```
POST /cart/remove
Authorization: Bearer <TOKEN>

{
  "productId": "507f1f77bcf86cd799439011"
}

Response: {
  "success": true,
  "cart": { ... }
}
```

#### Update Cart Item
```
PUT /cart/update
Authorization: Bearer <TOKEN>

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 3
}

Response: {
  "success": true,
  "cart": { ... }
}
```

#### Clear Cart
```
DELETE /cart
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "message": "Cart cleared"
}
```

### Order Endpoints

#### Create Order
```
POST /orders
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "items": [ ... ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "razorpay"
}

Response: {
  "success": true,
  "order": { ... },
  "razorpayOrder": { ... }
}
```

#### Get My Orders
```
GET /orders/my-orders
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "orders": [ ... ]
}
```

#### Get Order by ID
```
GET /orders/:id
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "order": { ... }
}
```

#### Get All Orders (Admin)
```
GET /orders
Authorization: Bearer <ADMIN_TOKEN>

Response: {
  "success": true,
  "orders": [ ... ],
  "total": 500
}
```

#### Update Order Status (Admin)
```
PUT /orders/:id/status
Authorization: Bearer <ADMIN_TOKEN>

{
  "orderStatus": "Shipped"
}

Response: {
  "success": true,
  "order": { ... }
}
```

#### Cancel Order
```
POST /orders/:id/cancel
Authorization: Bearer <TOKEN>

Response: {
  "success": true,
  "message": "Order cancelled"
}
```

### Payment Endpoints

#### Initialize Razorpay Order
```
POST /payment/create-order
Authorization: Bearer <TOKEN>

{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 15000
}

Response: {
  "success": true,
  "razorpayOrder": {
    "id": "order_...",
    "amount": 1500000,
    "currency": "INR"
  }
}
```

#### Verify Payment
```
POST /payment/verify
Authorization: Bearer <TOKEN>

{
  "razorpay_payment_id": "pay_...",
  "razorpay_order_id": "order_...",
  "razorpay_signature": "..."
}

Response: {
  "success": true,
  "message": "Payment verified",
  "order": { ... }
}
```

---

## Deployment

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel deploy --prod
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

cd frontend
npm run build
netlify deploy --prod --dir=dist/frontend
```

#### Option 3: AWS S3 + CloudFront
```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/frontend/ s3://your-bucket-name/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

#### Option 4: Docker
```dockerfile
# frontend.Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -f frontend.Dockerfile -t shopsmart-frontend:latest .
docker run -p 80:80 shopsmart-frontend:latest
```

### Backend Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

cd backend
heroku create shopsmart-api
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

#### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

cd backend
railway init
railway link
railway up
```

#### Option 3: AWS EC2
```bash
# SSH into EC2 instance
ssh -i key.pem ec2-user@instance-public-ip

# Install Node.js and MongoDB
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash
sudo yum install nodejs

# Clone repository and setup
git clone <repo-url>
cd ShopSmart/backend
npm install
npm start
```

#### Option 4: Docker
```dockerfile
# backend.Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -f backend.Dockerfile -t shopsmart-backend:latest .
docker run -p 5000:5000 --env-file .env shopsmart-backend:latest
```

### Database Deployment

#### MongoDB Atlas (Recommended)
1. Go to mongodb.com/cloud
2. Create a cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in .env

#### Self-Hosted MongoDB

```bash
# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt update && apt install -y mongodb-org

# Start service
systemctl start mongod
systemctl enable mongod
```

### Production Checklist

- [ ] Environment variables configured
- [ ] JWT_SECRET uses strong random string
- [ ] CORS origin set to production domain
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error logging setup
- [ ] API rate limiting enabled
- [ ] Security headers configured
- [ ] Secrets not committed to repo
- [ ] Tests passing
- [ ] Bundle size optimized
- [ ] Assets cached properly

---

## Contributing

### Development Workflow

#### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

#### 2. Make Changes
- Write clean, readable code
- Follow existing patterns
- Add comments for complex logic
- Test thoroughly

#### 3. Commit Changes
```bash
git add .
git commit -m "feat: Add new feature description"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/dependency updates

#### 4. Push and Create PR
```bash
git push origin feature/feature-name
```

### Code Style Guide

#### TypeScript
- Use strong typing
- Avoid `any` type
- Use interfaces over types when possible
- Follow Angular style guide

#### CSS
- Use CSS custom properties for colors
- Mobile-first approach
- Consistent spacing (0.25rem units)
- Semantic class names

#### JavaScript
- Use ES6+ features
- Consistent async/await usage
- Proper error handling
- Clear variable names

### Testing

#### Frontend Unit Tests
```bash
cd frontend
npm test
```

#### Backend Unit Tests
```bash
cd backend
npm test
```

#### E2E Tests
```bash
cd frontend
npm run e2e
```

---

## Troubleshooting

### Frontend Issues

#### 1. Port 4200 Already in Use
```bash
# Kill process on port 4200
npx kill-port 4200

# Or use different port
ng serve --port 4201
```

#### 2. Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build Errors
```bash
# Clear Angular cache
ng cache clean
npm run build
```

#### 4. Styles Not Applying
- Check component selector matches
- Verify CSS file reference in component
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS specificity conflicts

#### 5. Router Not Working
- Verify route is added to `app.routes.ts`
- Check `routerLink` binding
- Ensure component is imported
- Check RoleGuard configuration for protected routes

#### 6. Authentication Issues
- Check JWT token in localStorage
- Verify AuthInterceptor is imported
- Check Authorization header format
- Verify token not expired

### Backend Issues

#### 1. Port 5000 Already in Use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill
```

#### 2. MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running
- Check MONGODB_URI environment variable
- Verify database credentials
- Check network connectivity

#### 3. CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
- Check CORS_ORIGIN in .env matches frontend URL
- Ensure CORS middleware is configured
- Check preflight requests are handled

#### 4. JWT Verification Failed
```
Error: invalid token
```
- Verify JWT_SECRET matches frontend
- Check token format: "Bearer <token>"
- Ensure token not expired
- Clear localStorage and re-login

#### 5. Razorpay Integration Issues
```
Error: Razorpay initialization failed
```
- Verify RAZORPAY_KEY_ID is set
- Check RAZORPAY_KEY_SECRET
- Ensure order amount is in paise (x100)
- Verify webhook configuration

### Database Issues

#### 1. MongoDB Performance Slow
```javascript
// Add indexes for frequently queried fields
db.users.createIndex({ "email": 1 })
db.products.createIndex({ "category": 1, "price": -1 })
db.orders.createIndex({ "user": 1, "createdAt": -1 })
```

#### 2. Data Integrity
```javascript
// Validate schema
db.users.validate()
db.products.validate()
```

#### 3. Backup and Restore
```bash
# Backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/shopsmart" --out=./backup

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net" ./backup
```

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update CORS_ORIGIN in backend .env |
| 401 Unauthorized | Re-login, check localStorage for token |
| Cart not persisting | Check localStorage enabled in browser |
| Products not loading | Verify database connection and product data |
| Payment fails | Check Razorpay API keys and test mode |
| Orders not saving | Check backend MongoDB connection |

### Debug Mode

#### Frontend
```typescript
// Enable detailed logging
localStorage.setItem('DEBUG', 'true')

// Check auth state
console.log(authService.user())
console.log(authService.role())
console.log(localStorage.getItem('token'))
```

#### Backend
```bash
# Enable debug logging
DEBUG=* npm start

# Check logs
tail -f logs/app.log
```

---

## Support & Contact

### Help Resources
- **Help Center**: `/help` - Browse FAQs and knowledge base
- **Contact Page**: `/contact` - Submit inquiry or feedback
- **Live Chat**: `/support` - Real-time support (24/7)
- **Email**: support@shopsmart.com
- **Phone**: 1800-SHOP-SMART (Mon-Fri 9 AM - 6 PM IST)

### For Developers
- **GitHub Issues**: Report bugs and request features
- **Documentation**: See this README and inline code comments
- **Code Examples**: Check component implementations

### Security

#### Report Security Vulnerabilities
- **DO NOT** post vulnerabilities in public issues
- Email: security@shopsmart.com
- Include detailed vulnerability report
- Allow 48 hours for initial response

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Version History

### v1.0.0 (Current)
- ✅ User authentication (register, login, roles)
- ✅ Product browsing and search
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Razorpay payment integration
- ✅ Seller dashboard
- ✅ Admin dashboard
- ✅ Today's Deals flash sales
- ✅ Customer support chat
- ✅ Marketing pages (About, Careers, Sell, Advertise, Affiliate, Help, Contact)
- ✅ Responsive design
- ✅ SSL security

### Upcoming Features
- 🔜 Product reviews and ratings
- 🔜 Wishlist functionality
- 🔜 Email notifications
- 🔜 SMS notifications
- 🔜 Recommendation engine
- 🔜 Loyalty program
- 🔜 Bulk import/export
- 🔜 Analytics dashboard
- 🔜 Internationalization (i18n)
- 🔜 Mobile app (React Native)

---

## Credits

Built with modern web technologies and best practices. Special thanks to:
- Angular team for the amazing framework
- Express.js community
- MongoDB for flexible database
- Razorpay for payment solutions

---

**Last Updated**: February 21, 2026
**Maintained By**: ShopSmart Development Team
**Repository**: [Link to repository]
