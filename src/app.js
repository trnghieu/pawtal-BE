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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/", publicRoutes);

app.get("/health", (req, res) => res.json({ ok: true, name: "pawtal" }));

module.exports = app;
