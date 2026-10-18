const express = require("express");

const adminMiddleware = require("../middleware/adminMiddleware");

const authMiddleware = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/foodController");

const router = express.Router();

//routes
//CREATE FOOD
router.post("/create", authMiddleware, createFoodController);

//GET ALL FOOD
router.get("/getAll", getAllFoodsController);

//GET SINGLE FOOD
router.get("/get/:id", getSingleFoodController);

//GET FOOD by restaurant
router.get("/getByRestaurant/:id", getFoodByRestaurantController);

//UPDATE FOOD
router.put("/update/:id", authMiddleware, updateFoodController);

//DELETE FOOD
router.delete("/delete/:id", authMiddleware, deleteFoodController);

//PLACE ORDER
router.post("/placeorder", authMiddleware, placeOrderController);

//ORDER STATUS
router.post(
  "/orderStatus/:id",
  authMiddleware,
  adminMiddleware,
  orderStatusController,
);

// GET ORDERS OF LOGGED-IN USER
router.get("/myorders", authMiddleware, getMyOrdersController);

// GET ALL ORDERS - ADMIN ONLY
router.get(
  "/allorders",
  authMiddleware,
  adminMiddleware,
  getAllOrdersController,
);

module.exports = router;
