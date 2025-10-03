const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, min: 1900, max: new Date().getFullYear() },
  kilometrage: { type: Number, required: true, min: 0 },
  fuelType: { type: String, enum: ["gasoline", "diesel", "electric", "hybrid"] },
  spareParts: [{ type: mongoose.Schema.Types.ObjectId, ref: "SparePart" }]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
