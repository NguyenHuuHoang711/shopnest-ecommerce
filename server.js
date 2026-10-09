require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const hpp = require("hpp");

const errorHandler = require("./middlewares/errorHandler.js");
const autoSeed = require("./seed/autoSeed.js");

const contactRoute = require("./routes/contactRoute.js");
const subscriptionRoute = require("./routes/subscriptionRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const shippingRoutes = require("./routes/shippingRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const adminRoutes = require("./routes/adminRoute.js");
const seedRoutes = require("./routes/seedRoutes.js");

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);

// Enable CORS for frontend and API consumers
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin reverse-proxy requests)
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  helmet({
    contentSecurityPolicy: false, // Handled or compatible with frontend proxy
  }),
);

app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

app.use(
  hpp({
    whitelist: ["category", "gender"],
  }),
);

// Health check endpoint for Docker & CI/CD deployment verification
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: "ok",
    database: dbState === 1 ? "connected" : "connecting",
    uptime: process.uptime(),
  });
});

app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoute);
app.use("/api", subscriptionRoute);
app.use("/api", shippingRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", reviewRoutes);
app.use("/api", adminRoutes);
app.use("/api", seedRoutes);

app.use((req, res, next) => {
  const error = new Error("Invalid route, please try again!");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

async function startServer(retries = 10, delay = 3000) {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopnest";

  while (retries > 0) {
    try {
      console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:[^:]*@/, ":****@")}`);
      await mongoose.connect(mongoUri);
      console.log("✅ Database connected successfully");
      break;
    } catch (err) {
      retries -= 1;
      console.error(`❌ Database connection failed. Retries left: ${retries}. Error:`, err.message);
      if (retries === 0) {
        console.error("Exhausted all database connection attempts. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Automatic database initialization & seed
  await autoSeed();

  app.listen(port, () => {
    console.log("🚀 Server running on port " + port);
  });
}

startServer();
