const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  createRestaurantController,
  getAllRestaurantController,
  getRestaurantByIdController,
  deleteRestaurantController,
} = require("../controllers/restaurantController");

const router = express.Router();

//routes
//CREATE RESTAURANT || POST
router.post("/create", authMiddleware, createRestaurantController);

//GET ALL RESTAURANTS || GET
router.get("/getAll", getAllRestaurantController);

//GET SINGLE RESTAURANT || GET
router.get("/get/:id", getRestaurantByIdController);

//DELETE RESTAURANT || DELETE
router.delete("/delete/:id", authMiddleware, deleteRestaurantController);

module.exports = router;
