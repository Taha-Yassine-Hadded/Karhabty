const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user", "entreprise"],
    required: true,
    default: "user"
  },
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  password: { type: String, required: true, minlength: 6 },
  entrepriseName: { type: String }, // only if role === "entreprise"
  address: { type: String, maxlength: 100 },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
