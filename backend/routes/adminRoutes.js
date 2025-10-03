const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminCtrl = require("../controllers/adminController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Protect all routes: only admin
router.use(authMiddleware(["admin"])); // <--- only admins

// Image upload route
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded' });
    }
    
    // Return the file path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      msg: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ msg: 'Error uploading image', error: error.message });
  }
});

// Users (Complete CRUD)
router.get("/users", adminCtrl.getAllUsers);
router.post("/users", adminCtrl.createUser);
router.put("/users/:id", adminCtrl.updateUser);
router.delete("/users/:id", adminCtrl.deleteUser);

// Spare Parts
router.get("/spare-parts", adminCtrl.getAllSpareParts);
router.post("/spare-parts", adminCtrl.createSparePart);
router.get("/spare-parts/:id", adminCtrl.getSparePartById);
router.put("/spare-parts/:id", adminCtrl.updateSparePart);
router.delete("/spare-parts/:id", adminCtrl.deleteSparePart);

// Suppliers (full CRUD + link spare parts)
router.post("/suppliers", adminCtrl.createSupplier);
router.get("/suppliers", adminCtrl.getAllSuppliers);
router.get("/suppliers/:id", adminCtrl.getSupplierById);
router.put("/suppliers/:id", adminCtrl.updateSupplier);
router.delete("/suppliers/:id", adminCtrl.deleteSupplier);

// Technicians (full CRUD + link spare parts)
router.post("/technicians", adminCtrl.createTechnician);
router.get("/technicians", adminCtrl.getAllTechnicians);
router.get("/technicians/:id", adminCtrl.getTechnicianById);
router.put("/technicians/:id", adminCtrl.updateTechnician);
router.delete("/technicians/:id", adminCtrl.deleteTechnician);

module.exports = router;
