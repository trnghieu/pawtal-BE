const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const petRoutes = require("./routes/pet.routes");
const publicRoutes = require("./routes/public.routes");

const { swaggerUi, swaggerDocument } = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const allowlist = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://pawtal-be.onrender.com",
  "https://pawtal-fe.vercel.app"
]
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/", publicRoutes);

app.get("/health", (req, res) => res.json({ ok: true, name: "pawtal" }));
app.use(
  cors({
    origin: function (origin, cb) {
      // Swagger UI đôi khi origin = undefined (curl/postman) → cho qua
      if (!origin) return cb(null, true);
      if (allowlist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.options("*", cors());
module.exports = app;
