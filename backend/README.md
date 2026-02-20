# ShopSmart Backend - Complete API Documentation

Enterprise-grade Node.js/Express backend for ShopSmart e-commerce platform with MongoDB.

**Project Name**: ShopSmart Backend  
**Runtime**: Node.js 18+  
**Framework**: Express.js 4.x  
**Database**: MongoDB + Mongoose  
**Authentication**: JWT (JSON Web Tokens)  
**Payment**: Razorpay Integration  

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation & Setup](#installation--setup)
3. [Architecture Overview](#architecture-overview)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [Error Handling](#error-handling)
8. [Middleware & Interceptors](#middleware--interceptors)
9. [Configuration](#configuration)
10. [Development](#development)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 18.0.0+
- npm 9.0.0+
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payments)

### Installation & Run

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with configuration
cp .env.example .env

# Start development server
npm start
# Server runs on http://localhost:5000

# For development with auto-reload
npm run dev
```

### Verify Installation

```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Response should be:
# { "status": "ok", "timestamp": "..." }
```

---

## Installation & Setup

### 1. Install Node Modules
```bash
npm install
```

### 2. Create Environment Files

**`.env` - Development Configuration**
```
# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsmart

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
JWT_EXPIRY=7d

# Razorpay Payment
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx

# CORS
CORS_ORIGIN=http://localhost:4200

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Session
SESSION_SECRET=your-session-secret
```

**`.env.production` - Production Configuration**
```
NODE_ENV=production
PORT=5000
BASE_URL=https://api.shopsmart.com
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/shopsmart
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://shopsmart.com
```

### 3. Initialize MongoDB

**Option A: MongoDB Atlas (Cloud)**
```bash
# 1. Go to mongodb.com/cloud
# 2. Create free cluster
# 3. Create database user
# 4. Get connection string
# 5. Update MONGODB_URI in .env
```

**Option B: Local MongoDB**
```bash
# Install locally
# macOS: brew install mongodb-community
# Windows: Download MSI installer
# Linux: sudo apt-get install mongodb

# Start service
# macOS: brew services start mongodb-community
# Windows: Run MongoDB Server
# Linux: sudo systemctl start mongod

# Verify
mongo
> db.version()  # Should show version
```

### 4. Start Server
```bash
npm start
# or with auto-reload
npm run dev
```

---

## Architecture Overview

### Folder Structure

```
backend/
├── server.js                         # Entry point
├── package.json                      # Dependencies
├── .env                             # Environment variables
│
├── config/
│   ├── db.js                        # MongoDB connection
│   └── razorpay.js                  # Razorpay initialization
│
├── models/                          # Database schemas
│   ├── User.js                      # User model
│   ├── Product.js                   # Product model
│   ├── Cart.js                      # Shopping cart
│   └── Order.js                     # Orders
│
├── controllers/                     # Business logic
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── paymentController.js
│
├── routes/                          # API endpoints
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── paymentRoutes.js
│
├── middleware/
│   └── authMiddleware.js            # JWT verification
│
└── README.md                        # This file
```

### Request Flow

```
HTTP Request
     ↓
Routes (Match endpoint)
     ↓
Middleware (Auth, validation)
     ↓
Controller (Business logic)
     ↓
Models (Database operations)
     ↓
Database (MongoDB)
     ↓
Response (JSON)
```

---

## Database Models

### User Model

**File**: `models/User.js`

**Schema**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: Enum ['user', 'shop', 'admin'] (required),
  phone: String,
  avatar: String (URL),
  
  // Seller Info
  shopName: String,
  shopDescription: String,
  shopImage: String,
  
  // Addresses
  addresses: [{
    _id: ObjectId,
    pincode: String,
    address: String,
    city: String,
    state: String,
    country: String,
    isDefault: Boolean
  }],
  
  // Profile
  wishlist: [ObjectId] (Product refs),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })
```

### Product Model

**Schema**:
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  price: Number (required),
  originalPrice: Number,
  discount: Number (default: 0),
  
  // Media
  images: [String] (URLs),
  thumbnail: String,
  
  // Classification
  category: String (required),
  subcategory: String,
  tags: [String],
  
  // Ratings & Reviews
  rating: Number (default: 0),
  reviews: Number (default: 0),
  
  // Inventory
  stock: Number (required),
  sold: Number (default: 0),
  
  // Seller Reference
  shop: ObjectId (User ref),
  shopName: String,
  
  // Status
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.products.createIndex({ shop: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ createdAt: -1 })
db.products.createIndex({ title: 'text', description: 'text' })
```

### Cart Model

**Schema**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (User ref, unique),
  items: [{
    _id: ObjectId,
    product: ObjectId (Product ref),
    quantity: Number,
    price: Number (price at time of adding),
    addedAt: Date
  }],
  totalPrice: Number (computed),
  totalQuantity: Number (computed),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.carts.createIndex({ user: 1 }, { unique: true })
db.carts.createIndex({ updatedAt: -1 })
```

### Order Model

**Schema**:
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  
  // Customer Reference
  user: ObjectId (User ref),
  
  // Items Ordered
  items: [{
    _id: ObjectId,
    product: ObjectId (Product ref),
    productTitle: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  
  // Pricing
  subtotal: Number,
  tax: Number (calculated),
  shipping: Number (if applicable),
  discount: Number,
  totalPrice: Number,
  
  // Shipping Address
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  // Payment Information
  paymentMethod: String (razorpay),
  paymentStatus: Enum [
    'Pending',
    'Completed',
    'Failed',
    'Refunded'
  ] (default: 'Pending'),
  transactionId: String,
  
  // Order Status
  orderStatus: Enum [
    'Processing',
    'Confirmed',
    'Paid',
    'Shipped',
    'Delivered',
    'Cancelled'
  ] (default: 'Processing'),
  
  // Tracking
  trackingNumber: String,
  estimatedDelivery: Date,
  
  // Returns/Refunds
  returnRequested: Boolean,
  returnReason: String,
  refundAmount: Number,
  refundedAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
```javascript
db.orders.createIndex({ user: 1, createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })
db.orders.createIndex({ paymentStatus: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
```

---

## API Endpoints

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.shopsmart.com/api
```

### Standard Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional info"
  }
}
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "user"
}

Response (201):
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGc..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGc..."
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Product Endpoints

#### Get All Products
```
GET /products?category=electronics&minPrice=1000&maxPrice=50000&page=1&limit=20&sort=price

Query Parameters:
- category: String (filter by category)
- minPrice: Number
- maxPrice: Number
- page: Number (default: 1)
- limit: Number (default: 20)
- sort: String (price, rating, newest)
- search: String (search in title & description)

Response (200):
{
  "success": true,
  "data": {
    "products": [...],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

#### Get Product by ID
```
GET /products/:id

Response (200):
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Product Name",
    "price": 5000,
    ...
  }
}
```

#### Search Products
```
GET /products/search?q=laptop

Response (200):
{
  "success": true,
  "data": [
    { ... },
    { ... }
  ]
}
```

#### Create Product (Seller)
```
POST /products
Authorization: Bearer <SELLER_TOKEN>
Content-Type: application/json

{
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones...",
  "price": 5000,
  "originalPrice": 7500,
  "category": "Electronics",
  "images": ["url1", "url2"],
  "stock": 50
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

#### Update Product (Seller)
```
PUT /products/:id
Authorization: Bearer <SELLER_TOKEN>
Content-Type: application/json

{
  "price": 4500,
  "stock": 45
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### Delete Product (Seller)
```
DELETE /products/:id
Authorization: Bearer <SELLER_TOKEN>

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Cart Endpoints

#### Get Cart
```
GET /cart
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "_id": "...",
    "items": [
      {
        "product": { ... },
        "quantity": 2,
        "price": 5000
      }
    ],
    "totalPrice": 10000
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

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### Remove from Cart
```
POST /cart/remove
Authorization: Bearer <TOKEN>

{
  "productId": "507f1f77bcf86cd799439011"
}

Response (200):
{
  "success": true,
  "data": { ... }
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

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### Clear Cart
```
DELETE /cart
Authorization: Bearer <TOKEN>

Response (200):
{
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
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "razorpay"
}

Response (201):
{
  "success": true,
  "data": {
    "order": { ... },
    "razorpayOrder": {
      "id": "order_...",
      "amount": 500000,
      "currency": "INR"
    }
  }
}
```

#### Get My Orders
```
GET /orders/my-orders
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "total": 5
  }
}
```

#### Get Order by ID
```
GET /orders/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "data": {
    "_id": "...",
    "orderNumber": "ORD-2026-001",
    ...
  }
}
```

#### Get All Orders (Admin)
```
GET /orders
Authorization: Bearer <ADMIN_TOKEN>

Query Parameters:
- status: String (filter by status)
- page: Number
- limit: Number
- sort: String

Response (200):
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "total": 500,
    "page": 1
  }
}
```

#### Update Order Status (Admin)
```
PUT /orders/:id/status
Authorization: Bearer <ADMIN_TOKEN>

{
  "orderStatus": "Shipped",
  "trackingNumber": "TRACK-123"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### Cancel Order
```
POST /orders/:id/cancel
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

#### Request Return
```
POST /orders/:id/return
Authorization: Bearer <TOKEN>

{
  "reason": "Product defective",
  "description": "Product stopped working"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### Payment Endpoints

#### Create Razorpay Order
```
POST /payment/create-order
Authorization: Bearer <TOKEN>

{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 50000
}

Response (200):
{
  "success": true,
  "data": {
    "id": "order_...",
    "amount": 5000000,
    "currency": "INR",
    "status": "created"
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

Response (200):
{
  "success": true,
  "message": "Payment verified successfully",
  "data": { ... }
}
```

#### Process Refund (Admin)
```
POST /payment/:paymentId/refund
Authorization: Bearer <ADMIN_TOKEN>

{
  "amount": 5000,
  "reason": "Refund requested by customer"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

---

## Authentication Flow

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1645000000,
  "exp": 1652000000
}

Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

### Authentication Process

1. **Register**: User creates account
   ```
   User → POST /auth/register → Server → MongoDB → Generate JWT
   ```

2. **Login**: User authenticates
   ```
   User → POST /auth/login → Verify credentials → Generate JWT
   ```

3. **Use Token**: Include in requests
   ```
   User → Request + "Authorization: Bearer <TOKEN>" → Server
   ```

4. **Verify Token**: Middleware checks validity
   ```
   Middleware → Decode JWT → Verify signature → Attach user to request
   ```

5. **Refresh Token**: Auto-renew on expiry
   ```
   Client detects 401 → Request new token → Continue with new token
   ```

### Token Expiry & Refresh

```javascript
// server.js
const JWT_EXPIRY = '7d';  // Token valid for 7 days

// On request with expired token:
// 1. Middleware returns 401 error
// 2. Client refreshes token
// 3. Server generates new token
// 4. Client retries request with new token
```

---

## Error Handling

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "rule": "email",
      "value": "invalid-email"
    }
  }
}
```

### Common Errors

```javascript
// 1. Invalid Credentials
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password"
  }
}

// 2. Token Expired
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "Token expired, please login again"
  }
}

// 3. Product Not Found
{
  "success": false,
  "error": {
    "code": "RESOURCE_001",
    "message": "Product not found"
  }
}

// 4. Insufficient Stock
{
  "success": false,
  "error": {
    "code": "STOCK_001",
    "message": "Insufficient stock available",
    "details": {
      "requested": 10,
      "available": 5
    }
  }
}
```

---

## Middleware & Interceptors

### Auth Middleware

```javascript
// middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_001', message: 'Token required' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { code: 'AUTH_002', message: 'Invalid token' }
    });
  }
};

module.exports = authMiddleware;
```

### Role Check Middleware

```javascript
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_003', message: 'Insufficient permissions' }
      });
    }
    next();
  };
};
```

### Using Middleware

```javascript
// routes/productRoutes.js
router.post(
  '/create',
  authMiddleware,
  roleCheck(['shop', 'admin']),
  createProduct
);
```

---

## Configuration

### Database Configuration

**config/db.js**:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Razorpay Configuration

**config/razorpay.js**:
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpay;
```

---

## Development

### Project Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Using Nodemon for Auto-Reload

```bash
npm install -D nodemon
npm run dev  # Automatically restarts on file changes
```

### Debugging

```bash
# Enable verbose logging
DEBUG=shopsmart:* npm start

# Debug with Node inspector
node --inspect server.js
# Open chrome://inspect in Chrome
```

---

## Testing

### Unit Tests

```javascript
// controllers/__tests__/userController.test.js
const { register, login } = require('../userController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('User Controller', () => {
  it('should register new user', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass123',
        role: 'user'
      }
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '123', ...req.body });

    // Assert expectations
    expect(User.create).toHaveBeenCalled();
  });
});
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
```

---

## Deployment

### Environment Setup

Create `.env.production`:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
RAZORPAY_KEY_ID=<production-key>
RAZORPAY_KEY_SECRET=<production-secret>
```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Build & Run**:
```bash
docker build -t shopsmart-backend:latest .
docker run -p 5000:5000 --env-file .env.production shopsmart-backend:latest
```

### Cloud Deployment Options

**Heroku**:
```bash
heroku create shopsmart-api
heroku config:set JWT_SECRET=xxx
heroku config:set MONGODB_URI=xxx
git push heroku main
```

**Railway**:
```bash
railway init
railway link
railway up
```

**AWS EC2**:
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node & MongoDB
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash
sudo yum install nodejs

# Clone & setup
git clone <repo>
npm install
npm start
```

---

## Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions**:
1. Ensure MongoDB is running: `mongod`
2. Check MONGODB_URI in .env
3. Verify network connectivity
4. Check MongoDB Atlas IP whitelist

### JWT Authentication Errors

```
Error: invalid token
```

**Solutions**:
1. Verify JWT_SECRET matches frontend
2. Check token format: "Bearer <token>"
3. Ensure token not expired
4. Verify token payload

### Razorpay Integration Failing

```
Error: Razorpay initialization failed
```

**Solutions**:
1. Verify RAZORPAY_KEY_ID and KEY_SECRET
2. Check Razorpay test vs production keys
3. Ensure amount in paise (multiply by 100)
4. Verify webhook configuration

### Port Already in Use

```bash
# Find and kill process on port 5000
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Performance

```javascript
// Add indexes for frequently queried fields
db.users.createIndex({ email: 1 })
db.products.createIndex({ shop: 1, createdAt: -1 })
db.orders.createIndex({ user: 1, createdAt: -1 })

// Monitor slow queries
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().limit(3).sort({ ts: -1 }).pretty()
```

---

**Last Updated**: February 21, 2026  
**Maintained By**: ShopSmart Development Team
