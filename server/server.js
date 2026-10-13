import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import personsRoutes from "./routes/persons.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✓ Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("✗ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });

app.use("/api/persons", personsRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/availability", availabilityRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 UP Campus Backend`);
  console.log(`📍 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 GET http://localhost:${PORT}/api/health\n`);
});

export default app;
