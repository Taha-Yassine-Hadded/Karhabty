const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true
  },
  address: { 
    type: String,
    trim: true
  },
  img: {
    type: String,
    trim: true,
    default: null
  },
  spareParts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SparePart" 
  }]
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);