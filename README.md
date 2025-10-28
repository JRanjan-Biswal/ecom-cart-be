# EComCart Backend API

A RESTful backend API for the EComCart e-commerce platform, built with Node.js, Express.js, and MongoDB (Mongoose).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [MongoDB Setup](#mongodb-setup)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## 🎯 Overview

EComCart Backend is a lightweight e-commerce API server that provides essential functionality for user authentication, product management, shopping cart operations, and user profile management. It uses **MongoDB** with Mongoose for data persistence, making it perfect for development, production, and deployment on platforms like Vercel.

## 📸 Application Screenshots

**Frontend Application**

![Homepage](screenshots/homepage.png)
*Modern homepage with hero banner, product grid and search functionality*

![Cart](screenshots/cart.png)
*Shopping cart interface*

📸 For more screenshots, visit the [Frontend Repository](https://github.com/JRanjan-Biswal/ecom-cart-fe)

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
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: CORS enabled, SHA-256 password hashing
- **Utilities**: nanoid for unique IDs, dotenv for environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EComCart-frontend-v2/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see MongoDB Setup below)

4. Run migration to populate database:
```bash
npm run migrate
```

5. Start the server:
```bash
npm start
```

The server will start on port `8082` (configurable via `config.json` or `PORT` environment variable).

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Create `.env` file** in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   ```

4. **Example `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecomcart
   ```

### Option 2: Local MongoDB

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/ecomcart
```

### Quick Setup Script

On Windows:
```bash
cd backend
CREATE_ENV.bat
```

On Linux/Mac:
```bash
cd backend
./create-env.sh
```

Then edit `.env` and add your MongoDB connection string.

### Security Notes

⚠️ **Important**: 
- The `.env` file is gitignored and should never be committed
- Never commit MongoDB credentials to version control
- Use environment variables for all sensitive data

## ⚙️ Configuration

The backend configuration is stored in `config.json`:

```json
{
    "port": 8082,
    "jwtSecret": "YourSecretKeyHere"
}
```

### Environment Variables

#### Required

- `MONGODB_URI`: MongoDB connection string (required)
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
  ```

#### Optional

- `PORT`: Overrides the port specified in config.json (default: 8082)

## 📦 Database

The application uses **MongoDB** with Mongoose ODM:

### Models

- **User Model** (`models/User.js`):
  - `username` - Unique username
  - `password` - SHA-256 hashed password
  - `balance` - User balance (default: 5000)
  - `cart` - Array of cart items
  - `addresses` - Array of user addresses
  - `name`, `mobile` - Profile information
  - `orders` - Order history

- **Product Model** (`models/Product.js`):
  - `name` - Product name
  - `category` - Product category
  - `cost` - Price
  - `rating` - Rating (0-5)
  - `image` - Image URL
  - `promoted` - Featured product flag
  - `promotionOrder` - Order in featured list

### Migration

Run the migration script to populate the database with initial product data:

```bash
npm run migrate
```

This will:
- Connect to your MongoDB database
- Create the database if it doesn't exist
- Insert 12 sample products
- Migrate any existing users from local NeDB files

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
├── models/               # Mongoose models
│   ├── User.js          # User model
│   └── Product.js       # Product model
├── routes/              # API route handlers
│   ├── auth.js         # Authentication endpoints
│   ├── cart.js         # Shopping cart endpoints
│   ├── product.js      # Product endpoints
│   └── user.js         # User profile endpoints
├── db/                  # Legacy NeDB files (for migration)
│   ├── users.db
│   └── products.db
├── config.json          # Configuration file
├── db.js                # Mongoose adapter
├── db-connection.js     # MongoDB connection handler
├── migrate.js           # Data migration script
├── index.js             # Main server file
├── utils.js             # Utility functions
├── .env                 # Environment variables (create this)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies

```

## 🚀 Deployment

### Deploy to Vercel

1. **Set up environment variables** in Vercel:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `MONGODB_URI` with your connection string

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Your API will be available at**:
   ```
   https://your-project.vercel.app
   ```

### Deploy to Railway

1. Connect your GitHub repository
2. Railway auto-detects the project
3. Add environment variable: `MONGODB_URI`
4. Deploy!

### Deploy to Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set Root Directory: `backend`
4. Add environment variable: `MONGODB_URI`
5. Deploy!

## 🔧 Development

### Adding New Products

Products are stored in MongoDB. To add products:

```javascript
const Product = require('./models/Product');

const newProduct = await Product.create({
  _id: nanoid(),
  name: "New Product",
  category: "Electronics",
  cost: 999,
  rating: 5,
  image: "https://example.com/image.png",
  promoted: false
});
```

### Creating Promoted Products

Promoted products are identified by the `promoted` field set to `true`:

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

- **Security**: 
  - ⚠️ Never commit `.env` files to git
  - Store JWT secret in environment variables
  - Use HTTPS in production
  - Implement rate limiting for production
  - Consider using bcrypt instead of SHA-256 for passwords

- **Database**: 
  - Uses MongoDB Atlas for production
  - Data persists across deployments
  - Automatic connection pooling
  - Serverless-ready

## 📚 Additional Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud MongoDB
- [Mongoose Docs](https://mongoosejs.com/docs/) - Mongoose documentation
- [Vercel Docs](https://vercel.com/docs) - Deployment guide

## 🔗 Related Repositories

- **Frontend**: [ecom-cart-fe ( https://github.com/JRanjan-Biswal/ecom-cart-fe )](https://github.com/JRanjan-Biswal/ecom-cart-fe) - EComCart frontend application

## 📝 License

This project is for educational/evaluation purposes.

## 👨‍💻 Developer

**Jyoti Ranjan**

Created as part of the EComCart e-commerce platform.

**GitHub**: [@JRanjan-Biswal](https://github.com/JRanjan-Biswal)

