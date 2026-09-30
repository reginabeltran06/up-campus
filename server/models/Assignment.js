import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    personaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    zonaId: {
      type: String,
      required: true,
    },
    fecha: {
      type: String,
      required: true, // Formato: YYYY-MM-DD
    },
  },
  { timestamps: true }
);

// Índice único: una persona no puede estar en dos zonas el mismo día
assignmentSchema.index({ personaId: 1, fecha: 1 }, { unique: true });

export default mongoose.model('Assignment', assignmentSchema);
