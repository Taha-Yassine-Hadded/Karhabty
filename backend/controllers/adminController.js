const User = require("../models/User");
const SparePart = require("../models/SparePart");
const Supplier = require("../models/Supplier");
const Technician = require("../models/Technician");
const Car = require("../models/Car");
const bcrypt = require("bcryptjs");

//
// USERS MANAGEMENT
//
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, entrepriseName, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      entrepriseName: role === "entreprise" ? entrepriseName : undefined,
      address: role === "entreprise" ? address : undefined,
      cars: []
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select("-password");
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ msg: "Error creating user", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, entrepriseName, address } = req.body;
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email is already taken by another user" });
      }
    }

    // Prepare update data
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
    };

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Handle entreprise-specific fields
    if (updateData.role === "entreprise") {
      updateData.entrepriseName = entrepriseName;
      updateData.address = address;
    } else {
      updateData.entrepriseName = undefined;
      updateData.address = undefined;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Error updating user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//
// SPARE PARTS MANAGEMENT
//
const createSparePart = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      lifespanKm,
      lifespanMonths,
      suppliers,
    } = req.body;

    // Validation
    if (!name || !category || !brand === undefined) {
      return res.status(400).json({ msg: "Please fill all required fields (name, category, brand)" });
    }

    // Create spare part
    const sparePart = new SparePart({
      name: name.trim(),
      category,
      brand: brand.trim(),
      lifespanKm: lifespanKm ? parseInt(lifespanKm) : undefined,
      lifespanMonths: lifespanMonths ? parseInt(lifespanMonths) : undefined,
      suppliers: suppliers || [],
    });

    await sparePart.save();

    // Update suppliers' spareParts arrays
    if (suppliers && suppliers.length > 0) {
      await Supplier.updateMany(
        { _id: { $in: suppliers } },
        { $addToSet: { spareParts: sparePart._id } }
      );
    }

    // Populate suppliers before sending response
    await sparePart.populate('suppliers', 'name email phone address');
    
    res.status(201).json(sparePart);
  } catch (err) {
    console.error('Create spare part error:', err);
    res.status(500).json({ msg: "Error creating spare part", error: err.message });
  }
};

const getAllSpareParts = async (req, res) => {
  try {
    const parts = await SparePart.find().populate("suppliers", "name contactInfo").sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    console.error('Get spare parts error:', err);
    res.status(500).json({ msg: "Error fetching parts", error: err.message });
  }
};

const getSparePartById = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id).populate("suppliers", "name contactInfo");
    if (!part) {
      return res.status(404).json({ msg: "Spare part not found" });
    }
    res.json(part);
  } catch (err) {
    console.error('Get spare part by ID error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Spare part not found" });
    }
    res.status(500).json({ msg: "Error fetching part", error: err.message });
  }
};

const updateSparePart = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      lifespanKm,
      lifespanMonths,
      suppliers,
    } = req.body;

    // Find existing part
    const existingPart = await SparePart.findById(req.params.id);
    if (!existingPart) {
      return res.status(404).json({ msg: "Spare part not found" });
    }

    // Get old suppliers to remove this part from their arrays
    const oldSuppliers = existingPart.suppliers || [];
    const newSuppliers = suppliers || [];

    // Remove this spare part from old suppliers that are no longer selected
    const suppliersToRemove = oldSuppliers.filter(
      oldId => !newSuppliers.some(newId => newId.toString() === oldId.toString())
    );
    
    if (suppliersToRemove.length > 0) {
      await Supplier.updateMany(
        { _id: { $in: suppliersToRemove } },
        { $pull: { spareParts: req.params.id } }
      );
    }

    // Add this spare part to new suppliers
    const suppliersToAdd = newSuppliers.filter(
      newId => !oldSuppliers.some(oldId => oldId.toString() === newId.toString())
    );
    
    if (suppliersToAdd.length > 0) {
      await Supplier.updateMany(
        { _id: { $in: suppliersToAdd } },
        { $addToSet: { spareParts: req.params.id } }
      );
    }

    // Prepare update data
    const updateData = {
      name: name ? name.trim() : existingPart.name,
      category: category || existingPart.category,
      brand: brand ? brand.trim() : existingPart.brand,
      lifespanKm: lifespanKm !== undefined ? (lifespanKm ? parseInt(lifespanKm) : null) : existingPart.lifespanKm,
      lifespanMonths: lifespanMonths !== undefined ? (lifespanMonths ? parseInt(lifespanMonths) : null) : existingPart.lifespanMonths,
      suppliers: newSuppliers,
    };

    const updated = await SparePart.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('suppliers', 'name email phone address');

    res.json(updated);
  } catch (err) {
    console.error('Update spare part error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Spare part not found" });
    }
    res.status(500).json({ msg: "Error updating part", error: err.message });
  }
};

const deleteSparePart = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ msg: "Spare part not found" });
    }

    // Remove this spare part from all suppliers' spareParts arrays
    if (part.suppliers && part.suppliers.length > 0) {
      await Supplier.updateMany(
        { _id: { $in: part.suppliers } },
        { $pull: { spareParts: req.params.id } }
      );
    }

    await SparePart.findByIdAndDelete(req.params.id);
    res.json({ msg: "Spare part deleted successfully" });
  } catch (err) {
    console.error('Delete spare part error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Spare part not found" });
    }
    res.status(500).json({ msg: "Error deleting part", error: err.message });
  }
};

//
// SUPPLIERS MANAGEMENT (FULL CRUD)
//
const createSupplier = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ msg: "Supplier name is required" });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    const supplier = new Supplier({ 
      name: name.trim(),
      phone: phone?.trim(),
      email: email?.trim(),
      address: address?.trim(),
      spareParts: [] // Initialize as empty array
    });

    await supplier.save();
    
    // Populate spareParts before sending response
    await supplier.populate("spareParts", "name category brand");
    
    res.status(201).json(supplier);
  } catch (err) {
    console.error('Create supplier error:', err);
    res.status(500).json({ msg: "Error creating supplier", error: err.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate("spareParts", "name category brand").sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    console.error('Get suppliers error:', err);
    res.status(500).json({ msg: "Error fetching suppliers", error: err.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate("spareParts", "name category brand");
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.json(supplier);
  } catch (err) {
    console.error('Get supplier by ID error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.status(500).json({ msg: "Error fetching supplier", error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    // Find existing supplier
    const existingSupplier = await Supplier.findById(req.params.id);
    if (!existingSupplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }

    // Check if email exists for another supplier (if provided and different)
    if (email && email !== existingSupplier.email) {
      const duplicateSupplier = await Supplier.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (duplicateSupplier) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    // Prepare update data (keep existing spareParts)
    const updateData = {
      name: name ? name.trim() : existingSupplier.name,
      phone: phone !== undefined ? phone?.trim() : existingSupplier.phone,
      email: email !== undefined ? email?.trim() : existingSupplier.email,
      address: address !== undefined ? address?.trim() : existingSupplier.address
      // Don't update spareParts - keep existing ones
    };

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("spareParts", "name category brand");

    res.json(supplier);
  } catch (err) {
    console.error('Update supplier error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.status(500).json({ msg: "Error updating supplier", error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ msg: "Supplier deleted successfully" });
  } catch (err) {
    console.error('Delete supplier error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.status(500).json({ msg: "Error deleting supplier", error: err.message });
  }
};

//
// TECHNICIANS MANAGEMENT (FULL CRUD)
//
const createTechnician = async (req, res) => {
  try {
    const { name, speciality, cars, email, phone, address, website } = req.body;
    // Validation
    if (!name || !speciality) {
      return res.status(400).json({ msg: "Please fill all required fields (name, speciality)" });
    }
    const technician = new Technician({
      name: name.trim(),
      speciality,
      cars: cars || [],
      email: email || '',
      phone: phone || '',
      address: address || '',
      website: website || ''
    });
    await technician.save();
    res.status(201).json(technician);
  } catch (err) {
    console.error('Create technician error:', err);
    res.status(500).json({ msg: "Error creating technician", error: err.message });
  }
};

const getAllTechnicians = async (req, res) => {
  try {
    const techs = await Technician.find().sort({ createdAt: -1 });
    res.json(techs);
  } catch (err) {
    console.error('Get technicians error:', err);
    res.status(500).json({ msg: "Error fetching technicians", error: err.message });
  }
};

const getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ msg: "Technician not found" });
    }
    res.json(technician);
  } catch (err) {
    console.error('Get technician by ID error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Technician not found" });
    }
    res.status(500).json({ msg: "Error fetching technician", error: err.message });
  }
};

const updateTechnician = async (req, res) => {
  try {
    const { name, speciality, cars, email, phone, address, website } = req.body;
    // Find existing technician
    const existingTechnician = await Technician.findById(req.params.id);
    if (!existingTechnician) {
      return res.status(404).json({ msg: "Technician not found" });
    }
    // Prepare update data
    const updateData = {
      name: name ? name.trim() : existingTechnician.name,
      speciality: speciality || existingTechnician.speciality,
      cars: cars !== undefined ? cars : existingTechnician.cars,
      email: email !== undefined ? email : existingTechnician.email,
      phone: phone !== undefined ? phone : existingTechnician.phone,
      address: address !== undefined ? address : existingTechnician.address,
      website: website !== undefined ? website : existingTechnician.website
    };
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    res.json(technician);
  } catch (err) {
    console.error('Update technician error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Technician not found" });
    }
    res.status(500).json({ msg: "Error updating technician", error: err.message });
  }
};

const deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ msg: "Technician not found" });
    }

    await Technician.findByIdAndDelete(req.params.id);
    res.json({ msg: "Technician deleted successfully" });
  } catch (err) {
    console.error('Delete technician error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Technician not found" });
    }
    res.status(500).json({ msg: "Error deleting technician", error: err.message });
  }
};

//
// CARS MANAGEMENT
//
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('owner', 'name email role')
      .populate({
        path: 'spareParts.part',
        select: 'name price category brand'
      })
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate({
        path: 'spareParts.part',
        select: 'name price category brand lifespanMonths lifespanKm stock',
        populate: {
          path: 'suppliers',
          select: 'name email phone address website'
        }
      });

    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Car not found" });
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    // Remove car from user's cars array
    await User.findByIdAndUpdate(car.owner, {
      $pull: { cars: car._id }
    });

    // Delete the car
    await Car.findByIdAndDelete(req.params.id);

    res.json({ msg: "Car deleted successfully" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Car not found" });
    }
    res.status(500).json({ msg: "Error deleting car", error: err.message });
  }
};

module.exports = {
  // users
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,

  // spare parts
  createSparePart,
  getAllSpareParts,
  getSparePartById,
  updateSparePart,
  deleteSparePart,

  // suppliers
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,

  // technicians
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,

  // cars
  getAllCars,
  getCarById,
  deleteCar,
};
