const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, min: 1900, max: new Date().getFullYear() },
  kilometrage: { type: Number, required: true, min: 0 },
  fuelType: { type: String, enum: ["gasoline", "diesel", "electric", "hybrid"] },
  image: { type: String }, // Car image path
  spareParts: [{
    part: { type: mongoose.Schema.Types.ObjectId, ref: "SparePart", required: true },
    changeMonth: { type: Number, required: true, min: 1, max: 12 },
    changeYear: { type: Number, required: true, min: 2000, max: new Date().getFullYear() + 1 },
    kilometrage: { type: Number, default: 0, min: 0 } // Kilometrage when spare part was added/changed
  }]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
