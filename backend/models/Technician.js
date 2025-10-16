const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, enum: ["mechanic", "electrician"], required: true },
  cars: [{ type: String }],
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  website: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Technician", technicianSchema);
