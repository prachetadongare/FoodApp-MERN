const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");

//CREATE FOOD
const createFoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
    } = req.body;
    if (!title || !description || !price || !restaurant) {
      return res.status(500).send({
        success: false,
        message: "Please Provide all fields",
      });
    }
    const newFood = new foodModel({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,

      code,
      isAvailable,
      restaurant,
      rating,
    });

    await newFood.save();
    res.status(201).send({
      success: true,
      message: "New Food Item Created",
      newFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Food API",
      error,
    });
  }
};

//GET ALL FOODS
const getAllFoodsController = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    if (!foods) {
      return res.status(404).send({
        success: false,
        message: "no food items were found",
      });
    }
    res.status(200).send({
      success: true,
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get ALL Foods API",
      error,
    });
  }
};

//GET SINGLE FOOD
const getSingleFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      return res.status(404).send({
        success: false,
        message: "please provide id",
      });
    }
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found with this id",
      });
    }
    res.status(200).send({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get Single Food API",
      error,
    });
  }
};

//GET FOOD BY RESTAURANT
const getFoodByRestaurantController = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "please provide id",
      });
    }
    const food = await foodModel.find({ restaurant: restaurantId });
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found with this id",
      });
    }
    res.status(200).send({
      success: true,
      message: "Food based on restaurant",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get Single Food API",
      error,
    });
  }
};

//UPDATE FOOD ITEM
const updateFoodController = async (req, res) => {
  try {
    const foodID = req.params.id;
    if (!foodID) {
      return res.status(404).send({
        success: false,
        message: "no food Id was found",
      });
    }
    const food = await foodModel.findById(foodID);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found",
      });
    }
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      catgeory,
      code,
      isAvailabe,
      restaurant,
      rating,
    } = req.body;
    const updatedFood = await foodModel.findByIdAndUpdate(
      foodID,
      {
        title,
        description,
        price,
        imageUrl,
        foodTags,
        catgeory,
        code,
        isAvailabe,
        restaurant,
        rating,
      },
      { new: true },
    );
    res.status(200).send({
      success: true,
      message: "Food Item Was Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In UPDATE FOOD API",
      error,
    });
  }
};

// DELETE FOOD
const deleteFoodController = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      return res.status(404).send({
        success: false,
        message: "provide food id",
      });
    }
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found with id",
      });
    }
    await foodModel.findByIdAndDelete(foodId);
    res.status(200).send({
      success: true,
      message: "Food Item Dleeted ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror In Delete Food APi",
      error,
    });
  }
};

//PLACE ORDER

const placeOrderController = async (req, res) => {
  try {
    const { cart, deliveryAddress } = req.body;

    // 1. Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // 2. Validate delivery address
    const requiredFields = ["fullName", "phone", "street", "city", "pincode"];

    if (
      !deliveryAddress ||
      requiredFields.some(
        (field) =>
          typeof deliveryAddress[field] !== "string" ||
          !deliveryAddress[field].trim(),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all delivery address fields.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(deliveryAddress.phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number.",
      });
    }

    if (!/^\d{6}$/.test(deliveryAddress.pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 6-digit PIN code.",
      });
    }

    // 3. Validate item IDs and quantities
    const quantitiesById = new Map();

    for (const item of cart) {
      const foodId = item?._id;
      const quantity = Number(item?.quantity);

      if (
        !foodId ||
        !mongoose.Types.ObjectId.isValid(foodId) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return res.status(400).json({
          success: false,
          message: "The cart contains an invalid food item or quantity.",
        });
      }

      quantitiesById.set(foodId, (quantitiesById.get(foodId) || 0) + quantity);
    }

    // 4. Fetch trusted food prices from MongoDB
    const orderItems = [];
    let total = 0;

    for (const [foodId, quantity] of quantitiesById) {
      const food = await foodModel.findById(foodId);

      if (!food) {
        return res.status(400).json({
          success: false,
          message: "A food item in your cart no longer exists.",
        });
      }

      if (food.isAvailable === false) {
        return res.status(400).json({
          success: false,
          message: `${food.title} is currently unavailable.`,
        });
      }

      const price = Number(food.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${food.title}.`,
        });
      }

      orderItems.push({
        food: food._id,
        title: food.title,
        price,
        quantity,
      });

      total += price * quantity;
    }

    // 5. Create the order for the authenticated user
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in before placing an order.",
      });
    }

    const newOrder = await orderModel.create({
      items: orderItems,
      payment: Number(total.toFixed(2)),
      buyer: req.user.id,
      deliveryAddress: {
        fullName: deliveryAddress.fullName.trim(),
        phone: deliveryAddress.phone.trim(),
        street: deliveryAddress.street.trim(),
        city: deliveryAddress.city.trim(),
        pincode: deliveryAddress.pincode.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place your order.",
    });
  }
};

//CHANGE ORDER STATUS

const orderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["preparing", "on the way", "delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Order status update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};

// GET MY ORDERS
const getMyOrdersController = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your orders.",
      });
    }

    const orders = await orderModel
      .find({ buyer: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders.",
    });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("buyer", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

module.exports = {
  createFoodController,
  getAllFoodsController,
  getSingleFoodController,
  getFoodByRestaurantController,
  updateFoodController,
  deleteFoodController,
  placeOrderController,
  orderStatusController,
  getMyOrdersController,
  getAllOrdersController,
};
