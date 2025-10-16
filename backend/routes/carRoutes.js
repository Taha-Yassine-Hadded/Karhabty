const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getUserCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  getAllSpareParts
} = require("../controllers/carController");

// @route   GET /api/cars/spare-parts/all
// @desc    Get all available spare parts
// @access  Private
router.get("/spare-parts/all", protect, getAllSpareParts);

// @route   GET /api/cars
// @desc    Get all cars for logged-in user
// @access  Private
router.get("/", protect, getUserCars);

// @route   GET /api/cars/:id
// @desc    Get single car by ID
// @access  Private
router.get("/:id", protect, getCarById);

// @route   POST /api/cars
// @desc    Add a new car
// @access  Private
router.post("/", protect, upload.single('image'), addCar);

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private
router.put("/:id", protect, upload.single('image'), updateCar);

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private
router.delete("/:id", protect, deleteCar);

module.exports = router;
