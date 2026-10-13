import express from "express";
import Availability from "../models/Availability.js";
import Assignment from "../models/Assignment.js";

const router = express.Router();

// GET /api/availability/by-date/:fecha
// Obtener personas no disponibles en una fecha
router.get("/by-date/:fecha", async (req, res) => {
  try {
    const availability = await Availability.find({
      fecha: req.params.fecha,
    }).lean();

    res.json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/availability
// Marcar persona como no disponible
router.post("/", async (req, res) => {
  try {
    const { personaId, fecha, motivo, nota = "" } = req.body;

    if (!personaId || !fecha || !motivo) {
      return res.status(400).json({
        error: "Missing required fields: personaId, fecha, motivo",
      });
    }

    const availability = await Availability.findOneAndUpdate(
      {
        personaId,
        fecha,
      },
      {
        personaId,
        fecha,
        motivo,
        nota,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    // Una persona no disponible no puede permanecer asignada
    // a un edificio ese mismo día.
    await Assignment.deleteOne({
      personaId,
      fecha,
    });

    res.json(availability);
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/availability/:id
// Volver a hacer disponible a una persona
router.delete("/:id", async (req, res) => {
  try {
    const availability = await Availability.findByIdAndDelete(req.params.id);

    if (!availability) {
      return res.status(404).json({
        error: "Availability record not found",
      });
    }

    res.json({
      message: "Person is available again",
      availability,
    });
  } catch (error) {
    console.error("Error removing availability:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
