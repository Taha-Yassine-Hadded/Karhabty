const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add metrics middleware EARLY - before routes
const { 
  requestMetricsMiddleware, 
  metricsEndpoint 
} = require('./metrics');

app.use(requestMetricsMiddleware);

// Metrics endpoint (should be accessible without auth)
app.get('/metrics', metricsEndpoint);

// Health check endpoint
const healthRoute = require('./routes/health');
app.use('/', healthRoute);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const carRoutes = require("./routes/carRoutes");
app.use("/api/cars", carRoutes);

const publicRoutes = require("./routes/publicRoutes");
app.use("/api/public", publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));