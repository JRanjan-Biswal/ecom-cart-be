require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const { initialize } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database connection before routes
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    await initialize();
    dbInitialized = true;
  }
  next();
});

const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/user', userRouter);

// For Vercel serverless functions, export the app handler
// For local development, start the server
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

if (isServerless) {
  // Export for Vercel serverless
  module.exports = app;
} else {
  // Start server for local development
  const port = process.env.PORT || config.port;
  
  // Initialize database on startup
  initialize().then(() => {
    app.listen(port, () => {
      console.log(`EComCart Backend running at port ${port}`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
