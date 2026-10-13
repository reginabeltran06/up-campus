import express from "express";
import Assignment from "../models/Assignment.js";
import AssignmentBackup from "../models/AssignmentBackup.js";

const router = express.Router();

// GET /api/assignments - Obtener todas las asignaciones
router.get("/", async (req, res) => {
  try {
    const { fecha } = req.query;
    let query = {};

    if (fecha) {
      query.fecha = fecha;
    }

    const assignments = await Assignment.find(query).lean();
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/assignments/by-date/:fecha - Obtener asignaciones por fecha
router.get("/by-date/:fecha", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      fecha: req.params.fecha,
    }).lean();
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments by date:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments - Crear una asignación
router.post("/", async (req, res) => {
  try {
    const { personaId, zonaId, fecha } = req.body;

    if (!personaId || !zonaId || !fecha) {
      return res.status(400).json({
        error: "Missing required fields: personaId, zonaId, fecha",
      });
    }

    // Verificar si ya existe una asignación para esa persona en esa fecha
    const existing = await Assignment.findOne({
      personaId,
      fecha,
    });

    if (existing) {
      // Actualizar la asignación existente
      existing.zonaId = zonaId;
      await existing.save();
      return res.json(existing);
    }

    // Crear nueva asignación
    const assignment = new Assignment({
      personaId,
      zonaId,
      fecha,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/assignments/:id - Actualizar una asignación
router.put("/:id", async (req, res) => {
  try {
    const { zonaId } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { zonaId },
      { new: true },
    );

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/assignments/:id - Eliminar una asignación
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted", assignment });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: error.message });
  }
});

const getToday = () => new Date().toISOString().split("T")[0];

// GET /api/assignments/backups/latest

router.get("/backups/latest", async (req, res) => {
  try {
    const { fecha } = req.query;
    const query = fecha ? { fecha } : {};

    const backup = await AssignmentBackup.findOne(query).sort({
      createdAt: -1,
    });

    res.json(backup);
  } catch (error) {
    console.error("Error fetching assignment backup:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments/clear
// Guarda un respaldo y limpia las asignaciones del día.
router.post("/clear", async (req, res) => {
  try {
    const fecha = req.body.fecha || getToday();

    const currentAssignments = await Assignment.find({ fecha }).lean();

    const backup = await AssignmentBackup.create({
      fecha,
      assignments: currentAssignments.map((assignment) => ({
        personaId: assignment.personaId,
        zonaId: assignment.zonaId,
      })),
    });

    await Assignment.deleteMany({ fecha });

    res.json({
      message: "Mapa limpiado. Respaldo guardado.",
      backupId: backup._id,
      fecha,
      cleared: currentAssignments.length,
    });
  } catch (error) {
    console.error("Error clearing assignments:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments/restore/:backupId
// Reemplaza las asignaciones del día con las del respaldo.
router.post("/restore/:backupId", async (req, res) => {
  try {
    const backup = await AssignmentBackup.findById(req.params.backupId).lean();

    if (!backup) {
      return res.status(404).json({ error: "Backup not found" });
    }

    await Assignment.deleteMany({ fecha: backup.fecha });

    if (backup.assignments.length > 0) {
      await Assignment.insertMany(
        backup.assignments.map((assignment) => ({
          personaId: assignment.personaId,
          zonaId: assignment.zonaId,
          fecha: backup.fecha,
        })),
      );
    }

    res.json({
      message: "Asignaciones restauradas.",
      fecha: backup.fecha,
      restored: backup.assignments.length,
    });
  } catch (error) {
    console.error("Error restoring assignments:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
