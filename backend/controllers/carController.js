const Car = require("../models/Car");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Get all cars for the logged-in user
// @route   GET /api/cars
// @access  Private
const getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id })
      .populate('spareParts.part', 'name price category')
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Private
const getCarById = async (req, res) => {
  try {
    const Technician = require("../models/Technician");
    const car = await Car.findById(req.params.id)
      .populate({
        path: 'spareParts.part',
        select: 'name price category lifespanMonths lifespanKm brand stock',
        populate: {
          path: 'suppliers',
          select: 'name email phone address website'
        }
      });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if user owns this car
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this car" });
    }

    // Find technicians who can work on this car's brand
    const matchingTechnicians = await Technician.find({ cars: car.brand })
      .select('name speciality email phone address website cars');

    // Return car details and recommended technicians
    res.json({
      ...car.toObject(),
      recommendedTechnicians: matchingTechnicians
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new car
// @route   POST /api/cars
// @access  Private
const addCar = async (req, res) => {
  try {
    const { brand, model, year, kilometrage, fuelType, spareParts } = req.body;

    // Validate required fields
    if (!brand || !model || !kilometrage) {
      return res.status(400).json({ message: "Please provide brand, model, and kilometrage" });
    }

    // Get user to check role
    const user = await User.findById(req.user.id);
    
    // Check car limit for regular users (max 2 cars)
    if (user.role === 'user') {
      const userCarCount = await Car.countDocuments({ owner: req.user.id });
      if (userCarCount >= 2) {
        return res.status(403).json({ 
          message: "Regular users can only add up to 2 cars. Upgrade to enterprise for unlimited cars." 
        });
      }
    }

    // Parse spareParts if it's a string (from FormData)
    let sparePartsArray = [];
    if (spareParts) {
      sparePartsArray = typeof spareParts === 'string' ? JSON.parse(spareParts) : spareParts;
    }

    const newCar = new Car({
      owner: req.user.id,
      brand,
      model,
      year,
      kilometrage,
      fuelType,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      spareParts: sparePartsArray
    });

    const car = await newCar.save();

    // Add car to user's cars array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { cars: car._id } }
    );

    // Populate spare parts before sending response
    await car.populate('spareParts.part', 'name price category');

    res.status(201).json(car);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res) => {
  try {
    const { brand, model, year, kilometrage, fuelType, spareParts, deleteImage } = req.body;

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if user owns this car
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this car" });
    }

    // Handle image deletion if requested
    if (deleteImage === 'true' && car.image) {
      const oldImagePath = path.join(__dirname, '..', car.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      car.image = null;
    }

    // If new image is uploaded, delete old image and set new one
    if (req.file) {
      // Delete old image if exists
      if (car.image) {
        const oldImagePath = path.join(__dirname, '..', car.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      car.image = `/uploads/${req.file.filename}`;
    }

    // Update fields
    if (brand !== undefined) car.brand = brand;
    if (model !== undefined) car.model = model;
    if (year !== undefined) car.year = year;
    if (kilometrage !== undefined) car.kilometrage = kilometrage;
    if (fuelType !== undefined) car.fuelType = fuelType;
    
    // Update spare parts if provided
    if (spareParts !== undefined) {
      car.spareParts = typeof spareParts === 'string' ? JSON.parse(spareParts) : spareParts;
    }

    await car.save();
    await car.populate('spareParts.part', 'name price category');

    res.json(car);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if user owns this car
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this car" });
    }

    // Delete car image if exists
    if (car.image) {
      const imagePath = path.join(__dirname, '..', car.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Car.findByIdAndDelete(req.params.id);

    // Remove car from user's cars array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { cars: req.params.id } }
    );

    res.json({ message: "Car removed successfully" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all available spare parts for selection
// @route   GET /api/cars/spare-parts/all
// @access  Private
const getAllSpareParts = async (req, res) => {
  try {
    const SparePart = require("../models/SparePart");
    const spareParts = await SparePart.find().select('_id name price category');
    res.json(spareParts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  getAllSpareParts
};
