const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { errorHandler } = require("./middlewares/errorMiddleware");
const { requireAuth } = require("./middlewares/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const packageRoutes = require("./routes/packageRoutes");
const servicePackageRoutes = require("./routes/servicePackageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "CWSMS",
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    name: "cwsms.sid",
    secret: process.env.SESSION_SECRET || "dev_insecure_secret_change_me",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/", (req, res) => {
  res.json({ message: "CWSMS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", requireAuth, carRoutes);
app.use("/api/packages", requireAuth, packageRoutes);
app.use("/api/service-packages", requireAuth, servicePackageRoutes);
app.use("/api/payments", requireAuth, paymentRoutes);
app.use("/api/reports", requireAuth, reportRoutes);

app.use(errorHandler);

module.exports = app;
