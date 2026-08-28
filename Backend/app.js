const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); 


const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.0.154:3000",
  "https://moderndev-frontend.vercel.app",
  "http://13.207.8.179"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const routes = require("./src/routes");
app.use("/api", routes);

// ✅ Health
app.get("/", (req, res) => {
  res.json({ message: "API working 🚀" });
});

module.exports = app;