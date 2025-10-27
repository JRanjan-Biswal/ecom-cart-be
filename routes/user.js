var express = require("express");
var router = express.Router();
const { nanoid } = require("nanoid");
const { handleError, verifyAuth } = require("../utils");
var { users } = require("../db");

router.get("/addresses", verifyAuth, (req, res) => {
  console.log(`GET request received to "/user/addresses"`);

  return res.status(200).json(req.user.addresses);
});

router.post("/addresses", verifyAuth, (req, res) => {
  console.log(`POST request received to "/cart/addresses"`);

  if (req.body.address.length < 20) {
    return res.status(400).json({
      success: false,
      message: "Address should be greater than 20 characters",
    });
  }
  if (req.body.address.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Address should be less than 128 characters",
    });
  }
  req.user.addresses.push({
    _id: nanoid(),
    address: req.body.address,
  });
  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        handleError(res, err);
      }

      console.log(
        `Address "${req.body.address}" added to user ${req.user.username}'s address list`
      );

      return res.status(200).json(req.user.addresses);
    }
  );
});

router.delete("/addresses/:id", verifyAuth, async (req, res) => {
  console.log(`DELETE request received to "/cart/addresses"`);

  const index = await req.user.addresses.findIndex(
    (element) => element._id === req.params.id
  );
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Address to delete was not found",
    });
  }
  req.user.addresses.splice(index, 1);
  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        handleError(res, err);
      }

      console.log(
        `Address with id ${req.user._id} deleteed from user ${req.user.username}'s address list`
      );

      return res.status(200).json(req.user.addresses);
    }
  );
});

// Get user profile
router.get("/profile", verifyAuth, (req, res) => {
  console.log(`GET request to "/user/profile" received for user: ${req.user.username}`);
  
  return res.status(200).json({
    username: req.user.username,
    balance: req.user.balance,
    addresses: req.user.addresses || [],
    name: req.user.name || "",
    mobile: req.user.mobile || "",
    orders: req.user.orders || [],
  });
});

// Update user profile
router.put("/profile", verifyAuth, (req, res) => {
  console.log(`PUT request to "/user/profile" received for user: ${req.user.username}`);
  console.log("Update data:", req.body);

  const updates = {};
  
  if (req.body.name !== undefined) {
    updates.name = req.body.name;
  }
  if (req.body.mobile !== undefined) {
    updates.mobile = req.body.mobile;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields to update"
    });
  }

  users.update(
    { _id: req.user._id },
    { $set: updates },
    {},
    (err, numReplaced) => {
      if (err) {
        console.error("Database update error:", err);
        return handleError(res, err);
      }

      console.log("Profile updated successfully, fields replaced:", numReplaced);

      // Return updated user data
      users.findOne({ _id: req.user._id }, (err, updatedUser) => {
        if (err) {
          console.error("Error finding updated user:", err);
          return handleError(res, err);
        }

        if (!updatedUser) {
          console.error("Updated user not found");
          return res.status(404).json({
            success: false,
            message: "User not found after update"
          });
        }

        console.log("Returning updated profile:", {
          name: updatedUser.name || "",
          mobile: updatedUser.mobile || ""
        });

        return res.status(200).json({
          username: updatedUser.username,
          balance: updatedUser.balance,
          addresses: updatedUser.addresses || [],
          name: updatedUser.name || "",
          mobile: updatedUser.mobile || "",
          orders: updatedUser.orders || [],
        });
      });
    }
  );
});

module.exports = router;
