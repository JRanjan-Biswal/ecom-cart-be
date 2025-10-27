# EComCart Backend API

A RESTful backend API for the EComCart e-commerce platform, built with Node.js, Express.js, and NeDB.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)

## 🎯 Overview

EComCart Backend is a lightweight e-commerce API server that provides essential functionality for user authentication, product management, shopping cart operations, and user profile management. It uses NeDB (Node Embedded Database) for data persistence, making it perfect for development and small-scale deployments.

## ✨ Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 🛍️ **Product Management**: CRUD operations for products with search functionality
- 🛒 **Shopping Cart**: Add, update, and remove items from cart
- 👤 **User Profiles**: User profile management with address support
- 💰 **Balance System**: Virtual currency system for purchases
- 📊 **Order Management**: Track and manage user orders
- 🔍 **Search Functionality**: Search products by name or category
- 🌟 **Featured Products**: Support for promoted/featured products

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v4.17.1
- **Database**: NeDB v1.8.0 (Embedded NoSQL database)
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: CORS enabled, SHA-256 password hashing
- **Utilities**: nanoid for unique IDs

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EComCart-frontend-v2/backend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the server:
```bash
npm start
# or
node index.js
```

The server will start on port `8082` (configurable via `config.json` or `PORT` environment variable).

## ⚙️ Configuration

The backend configuration is stored in `config.json`:

```json
{
    "port": 8082,
    "jwtSecret": "YourSecretKeyHere"
}
```

### Environment Variables

- `PORT`: Overrides the port specified in config.json (optional)

## 📦 Database

The application uses NeDB, a lightweight embedded database:

- **Location**: `./db/`
- **Files**:
  - `users.db` - User accounts and profiles
  - `products.db` - Product catalog

Data is stored in binary format and persists across server restarts.

## 🔐 Authentication

The API uses JWT-based authentication:

1. Register a new user: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/login`
3. Include token in subsequent requests: `Authorization: Bearer <token>`

### Token Expiration
- JWT tokens expire after 6 hours

### Password Security
- Passwords are hashed using SHA-256 before storage
- Never store plain-text passwords

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "username": "user123",
    "password": "password123"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "username": "user123",
    "password": "password123"
}

Response:
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "user123",
    "balance": 5000
}
```

### Products

#### Get All Products
```http
GET /api/v1/products
```

#### Search Products
```http
GET /api/v1/products/search?value=laptop
```

#### Get Featured Products
```http
GET /api/v1/products/promoted
```

#### Get Single Product
```http
GET /api/v1/products/:id
```

### Cart

#### Get Cart Items (Protected)
```http
GET /api/v1/cart
Authorization: Bearer <token>
```

#### Add/Update Cart Item (Protected)
```http
POST /api/v1/cart
Authorization: Bearer <token>
Content-Type: application/json

{
    "productId": "abc123",
    "qty": 2
}
```

#### Delete Cart Item (Protected)
```http
DELETE /api/v1/cart/:productId
Authorization: Bearer <token>
```

#### Clear Cart (Protected)
```http
DELETE /api/v1/cart
Authorization: Bearer <token>
```

### User Profile

#### Get User Details (Protected)
```http
GET /api/v1/user
Authorization: Bearer <token>
```

#### Update User Profile (Protected)
```http
PUT /api/v1/user
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "John Doe",
    "mobile": "1234567890",
    "addresses": [...]
}
```

## 📁 Project Structure

```
backend/
├── db/
│   ├── users.db          # User database
│   └── products.db       # Product database
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── cart.js           # Shopping cart endpoints
│   ├── product.js        # Product endpoints
│   └── user.js           # User profile endpoints
├── config.json           # Configuration file
├── db.js                 # Database initialization
├── index.js              # Main server file
├── utils.js              # Utility functions
└── package.json          # Dependencies

```

## 🔧 Development

### Adding New Products to Database

Products are stored in `products.db`. To add products, use the NeDB API or import from external sources.

### Creating Promoted Products

Promoted products are identified by the `promoted` field set to `true` in the product document.

Example:
```javascript
{
    _id: "abc123",
    name: "Product Name",
    cost: 999,
    category: "Electronics",
    rating: 4.5,
    image: "url",
    promoted: true,
    promotionOrder: 1
}
```

## ⚠️ Important Notes

- **Security**: This is a development/evaluation backend. For production:
  - Use a more secure password hashing algorithm (bcrypt)
  - Store JWT secret in environment variables
  - Implement proper rate limiting
  - Add input validation and sanitization
  - Use HTTPS

- **Database**: NeDB is suitable for development and small-scale applications. For production, consider:
  - MongoDB
  - PostgreSQL
  - MySQL

## 🔗 Related Repositories

- **Frontend**: [ecom-cart-fe ( https://github.com/JRanjan-Biswal/ecom-cart-fe )](https://github.com/JRanjan-Biswal/ecom-cart-fe) - EComCart frontend application

## 📝 License

This project is for educational/evaluation purposes.

## 👨‍💻 Developer

**Jyoti Ranjan**

Created as part of the EComCart e-commerce platform.

**GitHub**: [@JRanjan-Biswal](https://github.com/JRanjan-Biswal)

