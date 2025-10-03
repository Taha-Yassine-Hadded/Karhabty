const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["engine", "electrical", "brakes", "body", "other"], required: true },
  lifespanKm: { type: Number, min: 0 },  // recommended change after X km
  lifespanMonths: { type: Number, min: 0 }, // recommended change after X months
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  img: {
    type: String,
    trim: true,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("SparePart", sparePartSchema);
