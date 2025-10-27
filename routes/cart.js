var express = require("express");
var router = express.Router();
const { nanoid } = require("nanoid");
const { handleError, verifyAuth, getProduct } = require("../utils");
var { users, products } = require("../db");

// Cart Controller

// GET - Retrieve cart
router.get("/", verifyAuth, (req, res) => {
  console.log(`GET request to "/cart" received`);
  return res.status(200).json(req.user.cart);
});

// DELETE - Remove item from cart (must be before other routes with params)
router.delete("/:productId", verifyAuth, (req, res) => {
  console.log(`DELETE request to "/cart/${req.params.productId}" received`);
  console.log("User cart before delete:", req.user.cart);
  console.log("Product ID to delete:", req.params.productId);
  
  const index = req.user.cart.findIndex(
    (element) => element.productId === req.params.productId
  );
  
  console.log("Index found:", index);
  
  if (index === -1) {
    console.log("Product not found in cart");
    return res.status(404).json({ 
      success: false, 
      message: "Product not found in cart" 
    });
  }
  
  req.user.cart.splice(index, 1);
  
  console.log("User cart after delete:", req.user.cart);
  
  users.update(
    { _id: req.user._id },
    { $set: { cart: req.user.cart } },
    {},
    (err) => {
      if (err) {
        console.error("Database update error:", err);
        return handleError(res, err);
      }

      console.log(
        `Product ${req.params.productId} removed from user ${req.user.username}'s cart`
      );

      console.log("Updated cart being sent:", req.user.cart);
      return res.status(200).json(req.user.cart);
    }
  );
});

// POST - Update cart
router.post("/", verifyAuth, async (req, res) => {
  console.log(`POST request to "/cart" received`);

  products.findOne({ _id: req.body.productId }, async (err, product) => {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product doesn't exist" });
    }

    const index = await req.user.cart.findIndex(
      (element) => element.productId === req.body.productId
    );

    if (index === -1) {
      req.user.cart.push({
        productId: req.body.productId,
        qty: req.body.qty,
      });
    } else if (req.body.qty === 0) {
      // delete
      req.user.cart.splice(index, 1);
    } else {
      //modify
      req.user.cart[index].qty = req.body.qty;
    }
    users.update(
      { _id: req.user._id },
      { $set: { cart: req.user.cart } },
      {},
      (err) => {
        if (err) {
          handleError(res, err);
        }

        console.log(
          `User ${req.user.username}'s cart updated to`,
          req.user.cart
        );

        return res.status(200).json(req.user.cart);
      }
    );
  });
});

// POST - Checkout
router.post("/checkout", verifyAuth, async (req, res) => {
  console.log(
    `POST request received to "/cart/checkout": ${req.user.username}`
  );

  let total = 0;
  for (let element of req.user.cart) {
    try {
      const product = await getProduct(element.productId);
      if (product == null) {
        throw new Error("Invalid product in cart. ");
      }
      total = total + element.qty * product.cost;
    } catch (error) {
      handleError(res, error);
    }
  }
  if (total === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }
  if (req.user.balance < total) {
    return res.status(400).json({
      success: false,
      message: "Wallet balance not sufficient to place order",
    });
  }
  if (!req.body.addressId) {
    return res.status(400).json({
      success: false,
      message: "Address not set",
    });
  }
  const addressIndex = await req.user.addresses.findIndex(
    (element) => element._id === req.body.addressId
  );
  if (addressIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Bad address specified" });
  }
  req.user.balance -= total;
  console.log("Mock order placed");
  console.log("Cart", req.user.cart);
  console.log("Total cost", total);
  console.log("Address", req.user.addresses[addressIndex]);
  
  // Save order to user's orders history
  const orderItems = [];
  for (let element of req.user.cart) {
    try {
      const product = await getProduct(element.productId);
      if (product) {
        orderItems.push({
          productId: product._id,
          name: product.name,
          cost: product.cost,
          qty: element.qty,
          image: product.image
        });
      }
    } catch (error) {
      console.error("Error getting product:", error);
    }
  }
  
  const newOrder = {
    _id: nanoid(),
    items: orderItems,
    total: total,
    address: req.user.addresses[addressIndex],
    date: new Date().toISOString()
  };
  
  req.user.orders = req.user.orders || [];
  req.user.orders.push(newOrder);
  
  // Now clear cart
  req.user.cart = [];
  users.update({ _id: req.user._id }, req.user, {}, (err) => {
    if (err) {
      handleError(res, err);
    }
    return res.status(200).json({
      success: true,
      order: newOrder
    });
  });
});

module.exports = router;
