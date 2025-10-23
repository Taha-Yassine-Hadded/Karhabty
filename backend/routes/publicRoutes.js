const express = require("express");
const adminCtrl = require("../controllers/adminController");

const router = express.Router();

// Public routes - no authentication required

// Suppliers (public access)
router.get("/suppliers", adminCtrl.getAllSuppliers);
router.get("/suppliers/:id", adminCtrl.getSupplierById);

// Technicians (public access)
router.get("/technicians", adminCtrl.getAllTechnicians);
router.get("/technicians/:id", adminCtrl.getTechnicianById);

module.exports = router;